// Runs the client activity report.
module.exports = async function repro(db, load) {
  const pipeline = load('exercises/05-activity-report/clientActivityPipeline.js')();
  const rows = await db.collection('receipts').aggregate(pipeline).toArray();

  return rows.map((row) => ({
    client: row._id,
    receipts: row.receipts,
    totalReceived: String(row.totalReceived),
    totalAllocated: String(row.totalAllocated),
  }));
};
