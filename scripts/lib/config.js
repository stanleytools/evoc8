// Connection settings for the two local development databases.
// Not part of any exercise.
module.exports = {
  testId: 'DE-TRUST-01',
  passMark: 4,
  sql: {
    server: process.env.SQL_HOST || 'sqlserver',
    port: Number(process.env.SQL_PORT || 1433),
    user: 'sa',
    // Local, throwaway development database. Not a real credential.
    password: process.env.SQL_PASSWORD || 'Ledger-Dev-2026',
    database: 'TrustLedger',
    options: { encrypt: false, trustServerCertificate: true },
    pool: { max: 1, min: 0 },
    requestTimeout: 15000,
    connectionTimeout: 5000,
  },
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017',
  mongoDb: 'trustledger',
};
