// Stops two commands from resetting the databases at the same moment,
// and makes sure only one results table is running. Not part of any exercise.
const fs = require('fs');
const os = require('os');
const path = require('path');

const LOCK_DIR = path.join(os.tmpdir(), 'trust-ledger-db.lock');
const WATCH_PID_FILE = path.join(os.tmpdir(), 'trust-ledger-watch.pid');
const STALE_MS = 45000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let held = false;

function release() {
  if (!held) return;
  held = false;
  try {
    fs.rmdirSync(LOCK_DIR);
  } catch (error) {
    // Already gone.
  }
}

async function acquire() {
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    try {
      fs.mkdirSync(LOCK_DIR);
      held = true;
      return;
    } catch (error) {
      try {
        if (Date.now() - fs.statSync(LOCK_DIR).mtimeMs > STALE_MS) fs.rmdirSync(LOCK_DIR);
      } catch (statError) {
        // Released between the two calls. Try again.
      }
      await sleep(150);
    }
  }
  // Give up waiting rather than hang forever.
}

/** Runs one database job at a time across every terminal. */
async function withDatabaseLock(job) {
  await acquire();
  try {
    return await job();
  } finally {
    release();
  }
}

function isRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return false;
  }
}

/** The newest results table wins: an older one in another terminal is stopped. */
async function becomeTheOnlyWatcher() {
  try {
    const previous = Number(fs.readFileSync(WATCH_PID_FILE, 'utf8'));
    if (previous && previous !== process.pid && isRunning(previous)) {
      process.kill(previous, 'SIGTERM');
      for (let i = 0; i < 40 && isRunning(previous); i += 1) await sleep(100);
    }
  } catch (error) {
    // No earlier results table.
  }
  fs.writeFileSync(WATCH_PID_FILE, String(process.pid));
}

function stopBeingTheWatcher() {
  try {
    if (Number(fs.readFileSync(WATCH_PID_FILE, 'utf8')) === process.pid) fs.unlinkSync(WATCH_PID_FILE);
  } catch (error) {
    // Nothing to clean up.
  }
}

process.on('exit', release);

module.exports = { withDatabaseLock, becomeTheOnlyWatcher, stopBeingTheWatcher, release };
