// Automated checks behind the results table. Not part of any exercise,
// and nothing here needs to change.
//
// Each check uses a procedure, function, filter or pipeline the way its ticket
// describes and reports whether the expected behavior happened. Any fix that
// produces the right behavior passes.
const { config, loadFresh, describeSqlError } = require('./db');

const cents = (value) => Math.round(Number(String(value)) * 100);
const money = (value) => (cents(value) / 100).toFixed(2);
const pass = () => ({ passed: true, detail: '' });
const fail = (detail) => ({ passed: false, detail });

async function scalarRow(pool, text) {
  const result = await pool.request().query(text);
  return result.recordset[0];
}

/** Runs a statement that is expected to raise an error. Returns the error, or null if it succeeded. */
async function expectError(pool, text) {
  let caught = null;
  try {
    await pool.request().batch(text);
  } catch (error) {
    caught = error;
  }
  // Clear up anything the statement left open so later checks start clean.
  let leftOpen = 0;
  try {
    const row = await scalarRow(pool, 'SELECT @@TRANCOUNT AS n');
    leftOpen = row.n;
    if (leftOpen > 0) await pool.request().batch('ROLLBACK TRANSACTION;');
  } catch (error) {
    // Ignore: the connection is reset before the next check.
  }
  return { error: caught, leftOpen };
}

async function balanceOf(pool, clientId) {
  const row = await scalarRow(
    pool,
    `SELECT COALESCE(SUM(Amount), 0) AS Balance FROM dbo.LedgerEntry WHERE ClientId = ${clientId}`,
  );
  return row.Balance;
}

// ---------------------------------------------------------------- 1
async function commission(pool) {
  const row = await scalarRow(
    pool,
    `SELECT dbo.fn_Commission(2500.00, 10) AS a,
            dbo.fn_Commission(1999.99, 15) AS b,
            dbo.fn_Commission(80.00, 5)    AS c`,
  );
  const cases = [
    ['10% of 2500.00', row.a, 250.0],
    ['15% of 1999.99', row.b, 300.0],
    ['5% of 80.00', row.c, 4.0],
  ];
  for (const [label, actual, expected] of cases) {
    if (cents(actual) !== cents(expected)) {
      return fail(`${label} should be ${money(expected)}, got ${money(actual)}`);
    }
  }
  return pass();
}

// ---------------------------------------------------------------- 2
async function disbursement(pool) {
  const over = await expectError(
    pool,
    `EXEC dbo.usp_PostDisbursement @ClientId = 1, @Amount = 2000.00, @Reference = 'CHK-OVER';`,
  );
  if (!over.error || cents(await balanceOf(pool, 1)) !== 50000) {
    return fail(
      `paying 2000.00 from a 500.00 balance should be refused; balance is now ${money(await balanceOf(pool, 1))}`,
    );
  }

  try {
    await pool
      .request()
      .batch(`EXEC dbo.usp_PostDisbursement @ClientId = 1, @Amount = 300.00, @Reference = 'CHK-PART';`);
    await pool
      .request()
      .batch(`EXEC dbo.usp_PostDisbursement @ClientId = 1, @Amount = 200.00, @Reference = 'CHK-REST';`);
  } catch (error) {
    return fail(`a payment within the client's balance was refused: ${describeSqlError(error)}`);
  }
  if (cents(await balanceOf(pool, 1)) !== 0) {
    return fail(`after paying out 300.00 and 200.00 the balance should be 0.00, got ${money(await balanceOf(pool, 1))}`);
  }

  const empty = await expectError(
    pool,
    `EXEC dbo.usp_PostDisbursement @ClientId = 3, @Amount = 1.00, @Reference = 'CHK-EMPTY';`,
  );
  if (!empty.error || cents(await balanceOf(pool, 3)) !== 0) {
    return fail('a client with no money in trust was paid 1.00');
  }
  return pass();
}

// ---------------------------------------------------------------- 3
async function rowsFor(pool, reference) {
  return scalarRow(
    pool,
    `SELECT (SELECT COUNT(*) FROM dbo.LedgerEntry WHERE Reference = '${reference}') AS Ledger,
            (SELECT COUNT(*) FROM dbo.CommissionEarned WHERE Reference = '${reference}') AS Commission,
            (SELECT COALESCE(SUM(Amount), 0) FROM dbo.LedgerEntry WHERE Reference = '${reference}') AS Net`,
  );
}

async function receipt(pool) {
  const badCalls = [
    ['a missing commission amount', 'CHK-NULL', 'NULL'],
    ['a negative commission amount', 'CHK-NEG', '-5.00'],
  ];
  for (const [label, reference, commissionAmount] of badCalls) {
    const result = await expectError(
      pool,
      `EXEC dbo.usp_PostReceipt @ClientId = 1, @Gross = 1000.00,
            @CommissionAmount = ${commissionAmount}, @Reference = '${reference}';`,
    );
    const rows = await rowsFor(pool, reference);
    if (rows.Ledger + rows.Commission > 0) {
      return fail(
        `a receipt with ${label} left ${rows.Ledger + rows.Commission} row(s) behind; it should write nothing`,
      );
    }
    if (!result.error) return fail(`a receipt with ${label} should raise an error`);
    if (result.leftOpen > 0) return fail(`a receipt with ${label} left a transaction open`);
  }

  try {
    await pool
      .request()
      .batch(
        `EXEC dbo.usp_PostReceipt @ClientId = 1, @Gross = 1000.00, @CommissionAmount = 100.00, @Reference = 'CHK-GOOD';`,
      );
  } catch (error) {
    return fail(`a valid receipt failed: ${describeSqlError(error)}`);
  }
  const good = await rowsFor(pool, 'CHK-GOOD');
  if (good.Ledger !== 2 || good.Commission !== 1 || cents(good.Net) !== 90000) {
    return fail('a valid receipt should write two ledger rows and one commission row, netting 900.00');
  }
  return pass();
}

// ---------------------------------------------------------------- 4
async function engagementSearch(pool, db) {
  const buildFilter = loadFresh('exercises/04-engagement-search/largeDisbursementFilter.js');
  const cases = [
    [5000, ['E-1002', 'E-1005']],
    [6000, ['E-1002']],
    [100, ['E-1001', 'E-1002', 'E-1004', 'E-1005', 'E-1006']],
  ];
  for (const [minAmount, expected] of cases) {
    const found = await db.collection('engagements').find(buildFilter(minAmount)).sort({ _id: 1 }).toArray();
    const ids = found.map((engagement) => engagement._id);
    if (ids.join(',') !== expected.join(',')) {
      return fail(
        `disbursements of ${minAmount} or more should match ${expected.join(', ')}; got ${ids.join(', ') || 'nothing'}`,
      );
    }
  }
  return pass();
}

// ---------------------------------------------------------------- 5
async function activityReport(pool, db) {
  const buildPipeline = loadFresh('exercises/05-activity-report/clientActivityPipeline.js');
  const rows = await db.collection('receipts').aggregate(buildPipeline()).toArray();
  const expected = [
    ['C-01', 2, 3500.0, 3500.0],
    ['C-02', 2, 1000.0, 600.0],
    ['C-03', 1, 750.5, 750.5],
  ];
  if (rows.length !== expected.length) {
    return fail(`the report should have ${expected.length} clients, got ${rows.length}`);
  }
  for (const [clientId, receipts, received, allocated] of expected) {
    const row = rows.find((candidate) => candidate._id === clientId);
    if (!row) return fail(`client ${clientId} is missing from the report`);
    if (Number(row.receipts) !== receipts) {
      return fail(`${clientId} should have ${receipts} receipts, got ${row.receipts}`);
    }
    if (cents(row.totalReceived) !== cents(received)) {
      return fail(`${clientId} totalReceived should be ${money(received)}, got ${money(row.totalReceived)}`);
    }
    if (cents(row.totalAllocated) !== cents(allocated)) {
      return fail(`${clientId} totalAllocated should be ${money(allocated)}, got ${money(row.totalAllocated)}`);
    }
  }
  if (rows.map((row) => row._id).join(',') !== expected.map((row) => row[0]).join(',')) {
    return fail('the report should be sorted by client');
  }
  return pass();
}

// ---------------------------------------------------------------- 6
async function allocation(pool) {
  for (const receiptId of [501, 502, 503, 504]) {
    await pool.request().batch(`EXEC dbo.usp_AllocateReceipt @ReceiptId = ${receiptId};`);
  }
  // Running it twice must not double the allocations.
  await pool.request().batch('EXEC dbo.usp_AllocateReceipt @ReceiptId = 501;');

  const result = await pool.request().query(`
    SELECT r.ReceiptId,
           r.Amount,
           COUNT(s.PayeeId) AS Splits,
           COUNT(a.PayeeId) AS Matched,
           (SELECT COUNT(*) FROM dbo.ReceiptAllocation x WHERE x.ReceiptId = r.ReceiptId) AS Allocations,
           (SELECT COALESCE(SUM(x.Amount), 0) FROM dbo.ReceiptAllocation x WHERE x.ReceiptId = r.ReceiptId) AS Allocated,
           COALESCE(MAX(ABS(a.Amount - r.Amount * s.SharePercent / 100.0)), 0) AS MaxDrift
    FROM dbo.Receipt r
    JOIN dbo.ReceiptSplit s ON s.ReceiptId = r.ReceiptId
    LEFT JOIN dbo.ReceiptAllocation a ON a.ReceiptId = s.ReceiptId AND a.PayeeId = s.PayeeId
    GROUP BY r.ReceiptId, r.Amount
    ORDER BY r.ReceiptId`);

  for (const row of result.recordset) {
    if (row.Allocations !== row.Splits || row.Matched !== row.Splits) {
      return fail(`receipt ${row.ReceiptId} should have ${row.Splits} allocations, got ${row.Allocations}`);
    }
    if (cents(row.Allocated) !== cents(row.Amount)) {
      return fail(
        `receipt ${row.ReceiptId} is ${money(row.Amount)} but ${money(row.Allocated)} was allocated`,
      );
    }
    if (Number(row.MaxDrift) > 0.0100001) {
      return fail(`receipt ${row.ReceiptId} has a payee more than one cent away from their share`);
    }
  }
  return pass();
}

module.exports = {
  1: commission,
  2: disbursement,
  3: receipt,
  4: engagementSearch,
  5: activityReport,
  6: allocation,
  mongoDbName: config.mongoDb,
};
