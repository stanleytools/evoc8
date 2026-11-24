// Builds the aggregation pipeline behind the "client activity" report.
//
// One row per client:
//   receipts        how many receipts the client has
//   totalReceived   the sum of the receipt amounts
//   totalAllocated  the sum of everything allocated out of those receipts
module.exports = function clientActivityPipeline() {
  return [
    { $unwind: '$allocations' },
    {
      $group: {
        _id: '$clientId',
        receipts: { $sum: 1 },
        totalReceived: { $sum: '$amount' },
        totalAllocated: { $sum: '$allocations.amount' },
      },
    },
    { $sort: { _id: 1 } },
  ];
};
