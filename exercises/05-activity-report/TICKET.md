# 5. Activity report totals are inflated

**Database:** MongoDB, collection `receipts`
**File to fix:** `exercises/05-activity-report/clientActivityPipeline.js`

## Steps to reproduce

Run `npm run try 5`. It runs the client activity report.

## Expected

| client | receipts | totalReceived | totalAllocated |
| --- | --- | --- | --- |
| C-01 | 2 | 3500.00 | 3500.00 |
| C-02 | 2 | 1000.00 | 600.00 |
| C-03 | 1 | 750.50 | 750.50 |

## Actual

The receipt counts and totalReceived are wrong for every client. C-01 shows 5 receipts
and 9500.00 received, and C-02 is missing a receipt. Only totalAllocated is right.

## Note

Each receipt document embeds how it was shared out, for example:

```
{ _id: 'RC-1', clientId: 'C-01', amount: 1000.00,
  allocations: [ { payee: 'Client share', amount: 900.00 }, { payee: 'Agency commission', amount: 100.00 } ] }
```

A receipt that has not been shared out yet has an empty `allocations` array.
