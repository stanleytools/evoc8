// Runs every check once and returns the results. Not part of any exercise.
const fs = require('fs');
const path = require('path');
const { ROOT, config, runSqlText, resetData, describeSqlError } = require('./db');
const exercises = require('./exercises');
const checks = require('./checks');

/** Loads the candidate's current SQL files into the database. Returns load errors by ticket id. */
async function applySqlExercises(pool, only) {
  const errors = {};
  for (const exercise of exercises) {
    if (!exercise.file.endsWith('.sql')) continue;
    if (only && exercise.id !== only) continue;
    try {
      const text = fs.readFileSync(path.join(ROOT, exercise.folder, exercise.file), 'utf8');
      await runSqlText(pool, text);
    } catch (error) {
      errors[exercise.id] = `could not load ${exercise.file}: ${describeSqlError(error)}`;
    }
  }
  return errors;
}

async function runAllChecks(pool, mongo) {
  const db = mongo.db(config.mongoDb);
  await resetData(pool, mongo);
  const loadErrors = await applySqlExercises(pool);

  const results = [];
  for (const exercise of exercises) {
    let outcome;
    if (loadErrors[exercise.id]) {
      outcome = { passed: false, detail: loadErrors[exercise.id] };
    } else {
      try {
        outcome = await checks[exercise.id](pool, db);
      } catch (error) {
        outcome = { passed: false, detail: describeSqlError(error) };
      }
    }
    results.push({ id: exercise.id, database: exercise.database, title: exercise.title, ...outcome });
  }
  return results;
}

module.exports = { applySqlExercises, runAllChecks };
