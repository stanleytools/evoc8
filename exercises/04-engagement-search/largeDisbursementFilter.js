// Builds the MongoDB filter behind the "large disbursements" search.
//
// It should find engagements that have at least one DISBURSEMENT entry
// of minAmount or more.
module.exports = function largeDisbursementFilter(minAmount) {
  return {
    'entries.type': 'DISBURSEMENT',
    'entries.amount': { $gte: minAmount },
  };
};
