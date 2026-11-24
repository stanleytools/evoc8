# 1. Commission is always zero

**Database:** SQL Server
**File to fix:** `exercises/01-commission/fn_Commission.sql`

## Steps to reproduce

Run `npm run try 1` in a terminal.

## Expected

| 10% of 2500.00 | 15% of 1999.99 | 5% of 80.00 |
| --- | --- | --- |
| 250.00 | 300.00 | 4.00 |

## Actual

Every commission comes back as 0.00, so the agency earns nothing on any receipt.
