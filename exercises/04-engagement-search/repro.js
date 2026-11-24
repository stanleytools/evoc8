// Shows what the search returns for disbursements of 5000 or more.
module.exports = async function repro(db, load) {
  const filter = load('exercises/04-engagement-search/largeDisbursementFilter.js')(5000);
  const found = await db.collection('engagements').find(filter).sort({ _id: 1 }).toArray();

  return found.map((engagement) => ({
    engagement: engagement._id,
    title: engagement.title,
    entries: engagement.entries.map((entry) => `${entry.type} ${entry.amount}`).join(', '),
  }));
};
