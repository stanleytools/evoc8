# 6. A split payment loses a penny

**Database:** SQL Server
**File to fix:** `exercises/06-allocation/usp_AllocateReceipt.sql`

## Steps to reproduce

Run `npm run try 6`. It allocates four receipts, lists each allocation, then compares
what was allocated with the receipt amount.

## Expected

The allocations for a receipt always add up to exactly the receipt amount, and every
payee still gets their percentage share to within one cent.

Business rule: any rounding difference goes to the payee with the largest share.
If shares are tied, it goes to the lowest PayeeId.

## Actual

Receipt 501 (100.00 split three ways) allocates only 99.99, so a penny of client money
is unaccounted for. Receipt 503 (0.05 split two ways) allocates 0.06, a penny more than
was received.
