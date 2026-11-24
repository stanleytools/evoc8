// Starting documents for MongoDB. Reloaded before every check.
// Not part of any exercise.
const { Decimal128 } = require('mongodb');

const money = (value) => Decimal128.fromString(value);

module.exports = function seed() {
  return {
    // One document per engagement, with its trust ledger entries embedded.
    engagements: [
      {
        _id: 'E-1001',
        client: 'Avery Stone',
        title: 'Spring tour',
        entries: [
          { type: 'RECEIPT', amount: money('12000.00'), ref: 'R-2001' },
          { type: 'DISBURSEMENT', amount: money('800.00'), ref: 'D-2001' },
        ],
      },
      {
        _id: 'E-1002',
        client: 'Jordan Blake',
        title: 'Feature film',
        entries: [
          { type: 'RECEIPT', amount: money('3000.00'), ref: 'R-2002' },
          { type: 'DISBURSEMENT', amount: money('6500.00'), ref: 'D-2002' },
        ],
      },
      {
        _id: 'E-1003',
        client: 'Riley Chen',
        title: 'Endorsement',
        entries: [{ type: 'RECEIPT', amount: money('9000.00'), ref: 'R-2003' }],
      },
      {
        _id: 'E-1004',
        client: 'Avery Stone',
        title: 'Podcast series',
        entries: [
          { type: 'DISBURSEMENT', amount: money('200.00'), ref: 'D-2003' },
          { type: 'DISBURSEMENT', amount: money('450.00'), ref: 'D-2004' },
          { type: 'RECEIPT', amount: money('700.00'), ref: 'R-2004' },
        ],
      },
      {
        _id: 'E-1005',
        client: 'Jordan Blake',
        title: 'Streaming special',
        entries: [
          { type: 'RECEIPT', amount: money('20000.00'), ref: 'R-2005' },
          { type: 'DISBURSEMENT', amount: money('5000.00'), ref: 'D-2005' },
          { type: 'DISBURSEMENT', amount: money('120.00'), ref: 'D-2006' },
        ],
      },
      {
        _id: 'E-1006',
        client: 'Riley Chen',
        title: 'Book advance',
        entries: [
          { type: 'RECEIPT', amount: money('5000.00'), ref: 'R-2006' },
          { type: 'DISBURSEMENT', amount: money('4999.99'), ref: 'D-2007' },
        ],
      },
    ],

    // One document per receipt, with how it was shared out embedded.
    receipts: [
      {
        _id: 'RC-1',
        clientId: 'C-01',
        amount: money('1000.00'),
        allocations: [
          { payee: 'Client share', amount: money('900.00') },
          { payee: 'Agency commission', amount: money('100.00') },
        ],
      },
      {
        _id: 'RC-2',
        clientId: 'C-01',
        amount: money('2500.00'),
        allocations: [
          { payee: 'Client share', amount: money('2000.00') },
          { payee: 'Agency commission', amount: money('250.00') },
          { payee: 'Manager', amount: money('250.00') },
        ],
      },
      { _id: 'RC-3', clientId: 'C-02', amount: money('400.00'), allocations: [] },
      {
        _id: 'RC-4',
        clientId: 'C-02',
        amount: money('600.00'),
        allocations: [{ payee: 'Client share', amount: money('600.00') }],
      },
      {
        _id: 'RC-5',
        clientId: 'C-03',
        amount: money('750.50'),
        allocations: [
          { payee: 'Client share', amount: money('375.25') },
          { payee: 'Manager', amount: money('375.25') },
        ],
      },
    ],
  };
};
