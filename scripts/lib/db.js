// Database helpers shared by the scripts. Not part of any exercise.
const fs = require('fs');
const path = require('path');
const sql = require('mssql');
const { MongoClient } = require('mongodb');
const config = require('./config');

const ROOT = path.join(__dirname, '..', '..');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Keeps trying until the database answers, so the scripts work while it is still starting. */
async function retry(label, attempt, { tries = 60, waitMs = 3000, quiet = false } = {}) {
  let lastError;
  for (let i = 0; i < tries; i += 1) {
    try {
      return await attempt();
    } catch (error) {
      lastError = error;
      if (!quiet && i === 1) console.log(`Waiting for ${label} to start...`);
      await sleep(waitMs);
    }
  }
  throw new Error(`${label} did not respond: ${lastError && lastError.message}`);
}

async function connectSql(options) {
  await retry(
    'SQL Server',
    async () => {
      const master = new sql.ConnectionPool({ ...config.sql, database: 'master' });
      await master.connect();
      try {
        await master
          .request()
          .batch(`IF DB_ID('${config.sql.database}') IS NULL CREATE DATABASE [${config.sql.database}];`);
      } finally {
        await master.close();
      }
    },
    options,
  );

  return retry(
    'SQL Server',
    async () => {
      const pool = new sql.ConnectionPool(config.sql);
      await pool.connect();
      await pool.request().query('SELECT 1 AS ok');
      return pool;
    },
    options,
  );
}

async function connectMongo(options) {
  return retry(
    'MongoDB',
    async () => {
      const client = new MongoClient(config.mongoUrl, { serverSelectionTimeoutMS: 3000 });
      await client.connect();
      await client.db(config.mongoDb).command({ ping: 1 });
      return client;
    },
    options,
  );
}

/** Splits a script on GO lines, the way SQL Server tools do. */
function splitBatches(text) {
  return text
    .split(/^\s*GO\s*;?\s*$/gim)
    .map((batch) => batch.trim())
    .filter(Boolean);
}

/** Runs a .sql file and returns every result set it produced. */
async function runSqlText(pool, text) {
  const recordsets = [];
  for (const batch of splitBatches(text)) {
    const result = await pool.request().batch(batch);
    for (const recordset of result.recordsets || []) recordsets.push(recordset);
  }
  return recordsets;
}

async function runSqlFile(pool, relativePath) {
  return runSqlText(pool, fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

/** Loads a JavaScript exercise file fresh, so saved edits are picked up. */
function loadFresh(relativePath) {
  const absolute = path.join(ROOT, relativePath);
  delete require.cache[require.resolve(absolute)];
  return require(absolute);
}

/** Puts both databases back to their starting data. */
async function resetData(pool, mongo) {
  await runSqlFile(pool, 'db/sqlserver/reset.sql');
  const seed = loadFresh('db/mongo/seed.js');
  const db = mongo.db(config.mongoDb);
  for (const [name, documents] of Object.entries(seed())) {
    await db.collection(name).deleteMany({});
    if (documents.length) await db.collection(name).insertMany(documents);
  }
}

function describeSqlError(error) {
  const number = error && error.number ? `Msg ${error.number}: ` : '';
  return `${number}${(error && error.message) || error}`.replace(/\s+/g, ' ').trim();
}

module.exports = {
  ROOT,
  config,
  sleep,
  connectSql,
  connectMongo,
  runSqlText,
  runSqlFile,
  loadFresh,
  resetData,
  describeSqlError,
};
