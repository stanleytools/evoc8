# 4. Search returns the wrong engagements

**Database:** MongoDB, collection `engagements`
**File to fix:** `exercises/04-engagement-search/largeDisbursementFilter.js`

## Steps to reproduce

Run `npm run try 4`. It searches for engagements with a disbursement of 5000 or more.

## Expected

Only the two engagements that really have a disbursement of 5000 or more: E-1002 and E-1005.

## Actual

Four engagements come back. E-1001 and E-1006 are included even though their only
disbursements are 800.00 and 4999.99.

## Note

Each engagement document embeds its ledger entries as an array, for example:

```
{ _id: 'E-1001', entries: [ { type: 'RECEIPT', amount: 12000.00 }, { type: 'DISBURSEMENT', amount: 800.00 } ] }
```
