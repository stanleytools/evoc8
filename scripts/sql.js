#!/usr/bin/env node
// Runs T-SQL against the exercise database and prints the result.
//   npm run sql -- "SELECT * FROM dbo.LedgerEntry"
//   npm run sql -- exercises/02-disbursement/repro.sql
// Not part of any exercise.
const fs = require('fs');
const path = require('path');
const { connectSql, describeSqlError } = require('./lib/db');

async function main() {
  const input = process.argv.slice(2).join(' ').trim();
  if (!input) {
    console.log('Usage: npm run sql -- "SELECT ..."   or   npm run sql -- path/to/file.sql');
    process.exit(1);
  }
  const text = input.endsWith('.sql') && fs.existsSync(path.resolve(input)) ? fs.readFileSync(path.resolve(input), 'utf8') : input;

  const pool = await connectSql();
  const batches = text
    .split(/^\s*GO\s*;?\s*$/gim)
    .map((batch) => batch.trim())
    .filter(Boolean);

  for (const batch of batches) {
    try {
      const result = await pool.request().batch(batch);
      const recordsets = result.recordsets || [];
      if (recordsets.length === 0) console.log('(completed)');
      for (const recordset of recordsets) {
        if (recordset.length === 0) console.log('(no rows)');
        else console.table(recordset);
      }
    } catch (error) {
      console.log(`ERROR ${describeSqlError(error)}`);
    }
  }
  await pool.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
