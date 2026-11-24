#!/usr/bin/env node
// Prints the results table. `npm run check` runs once, `npm run watch` re-runs on every save.
// Not part of any exercise.
const fs = require('fs');
const path = require('path');
const { ROOT, config, connectSql, connectMongo } = require('./lib/db');
const { runAllChecks } = require('./lib/run');
const { becomeTheOnlyWatcher, stopBeingTheWatcher, release } = require('./lib/lock');

const args = process.argv.slice(2);
const WATCH = args.includes('--watch');
const JSON_OUTPUT = args.includes('--json');

const color = (code, text) => (process.stdout.isTTY ? `\u001b[${code}m${text}\u001b[0m` : text);
const green = (text) => color('1;32', text);
const red = (text) => color('1;31', text);
const dim = (text) => color('2', text);
const bold = (text) => color('1', text);

function render(results) {
  const passed = results.filter((result) => result.passed).length;
  const lines = [];
  lines.push('');
  lines.push(bold(` Trust ledger test ${config.testId}`) + dim(`   checked ${new Date().toLocaleTimeString()}`));
  lines.push('');
  lines.push(dim(' #  Database    Ticket                                  Result'));
  for (const result of results) {
    const status = result.passed ? green('PASS       ') : red('NOT PASSING');
    lines.push(
      ` ${result.id}  ${result.database.padEnd(10)}  ${result.title.padEnd(38)}  ${status}` +
        (result.passed || !result.detail ? '' : `\n${' '.repeat(17)}${dim(result.detail)}`),
    );
  }
  lines.push('');
  const overall = passed >= config.passMark ? green('PASS') : red('NOT PASSED');
  lines.push(` Passing ${passed} of ${results.length}. Pass mark ${config.passMark}. Overall: ${overall}`);
  lines.push('');
  return lines.join('\n');
}

async function main() {
  if (!JSON_OUTPUT) console.log('Connecting to SQL Server and MongoDB...');
  const pool = await connectSql({ quiet: JSON_OUTPUT });
  const mongo = await connectMongo({ quiet: JSON_OUTPUT });

  const runOnce = async () => {
    const results = await runAllChecks(pool, mongo);
    if (JSON_OUTPUT) {
      console.log(JSON.stringify(results));
    } else {
      if (WATCH && process.stdout.isTTY) console.clear();
      console.log(render(results));
      if (WATCH) console.log(dim(' Watching for saved changes. Press Ctrl+C to stop.'));
    }
    return results;
  };

  if (!WATCH) {
    await runOnce();
    await pool.close();
    await mongo.close();
    return;
  }

  await becomeTheOnlyWatcher();
  const stop = (message) => {
    stopBeingTheWatcher();
    release();
    if (message) console.log(message);
    process.exit(0);
  };
  process.on('SIGTERM', () => stop('\n The results table is now running in another terminal.'));
  process.on('SIGINT', () => stop(''));

  let running = false;
  let queued = false;
  let timer;
  const trigger = () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      if (running) {
        queued = true;
        return;
      }
      running = true;
      try {
        await runOnce();
      } catch (error) {
        console.log(red(` Could not run the checks: ${error.message}`));
      }
      running = false;
      if (queued) {
        queued = false;
        trigger();
      }
    }, 300);
  };

  fs.watch(path.join(ROOT, 'exercises'), { recursive: true }, trigger);
  trigger();
}

main().catch((error) => {
  console.error(`Could not run the checks: ${error.message}`);
  process.exit(1);
});
