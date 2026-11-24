# 2. A client can be overdrawn

**Database:** SQL Server
**File to fix:** `exercises/02-disbursement/usp_PostDisbursement.sql`

## Steps to reproduce

Run `npm run try 2`. It shows every client's balance, tries to pay 2000.00 out of
Avery Stone's balance of 500.00, then shows the balances again.

## Expected

The payment is refused with "Insufficient client funds." and Avery Stone's balance stays at 500.00.

A payment of exactly the available balance is allowed. A client with no money in trust cannot be paid anything.

## Actual

The payment goes through and Avery Stone's balance becomes -1500.00.
In trust accounting that means one client's money was used to pay another client.
