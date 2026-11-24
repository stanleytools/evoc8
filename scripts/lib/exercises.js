// The list of tickets. Not part of any exercise.
module.exports = [
  {
    id: 1,
    database: 'SQL Server',
    title: 'Commission is always zero',
    folder: 'exercises/01-commission',
    file: 'fn_Commission.sql',
  },
  {
    id: 2,
    database: 'SQL Server',
    title: 'A client can be overdrawn',
    folder: 'exercises/02-disbursement',
    file: 'usp_PostDisbursement.sql',
  },
  {
    id: 3,
    database: 'SQL Server',
    title: 'A receipt is half posted',
    folder: 'exercises/03-receipt',
    file: 'usp_PostReceipt.sql',
  },
  {
    id: 4,
    database: 'MongoDB',
    title: 'Search returns the wrong engagements',
    folder: 'exercises/04-engagement-search',
    file: 'largeDisbursementFilter.js',
  },
  {
    id: 5,
    database: 'MongoDB',
    title: 'Activity report totals are inflated',
    folder: 'exercises/05-activity-report',
    file: 'clientActivityPipeline.js',
  },
  {
    id: 6,
    database: 'SQL Server',
    title: 'A split payment loses a penny',
    folder: 'exercises/06-allocation',
    file: 'usp_AllocateReceipt.sql',
  },
];
