#!/usr/bin/env node
// `npm run try 3` resets the data, loads your current code and reproduces ticket 3.
// Not part of any exercise.
const fs = require('fs');
const path = require('path');
const { ROOT, config, connectSql, connectMongo, resetData, loadFresh, describeSqlError } = require('./lib/db');
const { applySqlExercises } = require('./lib/run');
const exercises = require('./lib/exercises');

function splitBatches(text) {
  return text
    .split(/^\s*GO\s*;?\s*$/gim)
    .map((batch) => batch.trim())
    .filter(Boolean);
}

function printRows(rows) {
  if (!rows || rows.length === 0) {
    console.log('(no rows)\n');
    return;
  }
  console.table(rows);
}

async function main() {
  const id = Number(process.argv[2]);
  const exercise = exercises.find((entry) => entry.id === id);
  if (!exercise) {
    console.log('Usage: npm run try <ticket number 1 to 6>');
    process.exit(1);
  }

  const pool = await connectSql();
  const mongo = await connectMongo();
  await resetData(pool, mongo);
  const loadErrors = await applySqlExercises(pool);

  console.log(`\nTicket ${exercise.id}: ${exercise.title} (${exercise.database})\n`);
  if (loadErrors[exercise.id]) console.log(`ERROR ${loadErrors[exercise.id]}\n`);

  if (exercise.file.endsWith('.sql')) {
    const text = fs.readFileSync(path.join(ROOT, exercise.folder, 'repro.sql'), 'utf8');
    for (const batch of splitBatches(text)) {
      console.log(batch.split('\n').map((line) => `  ${line}`).join('\n'));
      try {
        const result = await pool.request().batch(batch);
        for (const recordset of result.recordsets || []) printRows(recordset);
        if (!result.recordsets || result.recordsets.length === 0) console.log('(completed)\n');
      } catch (error) {
        console.log(`ERROR ${describeSqlError(error)}\n`);
      }
    }
  } else {
    try {
      const repro = loadFresh(`${exercise.folder}/repro.js`);
      printRows(await repro(mongo.db(config.mongoDb), loadFresh));
    } catch (error) {
      console.log(`ERROR ${error.message}\n`);
    }
  }

  await pool.close();
  await mongo.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
