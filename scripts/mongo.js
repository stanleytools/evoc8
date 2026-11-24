#!/usr/bin/env node
// Runs a MongoDB expression against the exercise database and prints the result.
//   npm run mongo -- "db.collection('receipts').find().toArray()"
//   npm run mongo -- "db.collection('engagements').countDocuments({ 'entries.type': 'RECEIPT' })"
// Not part of any exercise.
const util = require('util');
const { config, connectMongo } = require('./lib/db');

async function main() {
  const expression = process.argv.slice(2).join(' ').trim();
  if (!expression) {
    console.log(`Usage: npm run mongo -- "db.collection('receipts').find().toArray()"`);
    process.exit(1);
  }

  const mongo = await connectMongo();
  const db = mongo.db(config.mongoDb);
  try {
    let value = await new Function('db', `return (${expression});`)(db);
    if (value && typeof value.toArray === 'function') value = await value.toArray();
    console.log(util.inspect(value, { depth: 6, colors: process.stdout.isTTY }));
  } catch (error) {
    console.log(`ERROR ${error.message}`);
  }
  await mongo.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
