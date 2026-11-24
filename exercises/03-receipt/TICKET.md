# 3. A receipt is half posted

**Database:** SQL Server
**File to fix:** `exercises/03-receipt/usp_PostReceipt.sql`

## Steps to reproduce

Run `npm run try 3`. It posts a receipt whose commission amount is missing, the way a
faulty integration would send it, then lists what was written.

## Expected

The procedure fails with an error and writes nothing at all for that receipt.
A valid receipt still writes all three rows.

## Actual

The procedure reports errors, but the 1000.00 receipt is left on the client's ledger with
no commission. The client's balance is overstated and the agency's commission is lost.

## Constraint

Leave the three INSERT statements and the table definitions as they are.
