# Trust ledger: live debugging exercises

A small trust accounting system for a talent agency. The agency holds client money in
trust, takes commission on receipts, and pays money out to clients and other payees.

Two databases are already running and loaded with data:

- **SQL Server** holds the ledger, receipts and stored procedures.
- **MongoDB** holds engagement and receipt documents used for search and reporting.

There are six tickets. Each one describes a bug, and each fix is one to six lines.

## How this works

1. A terminal opens on its own and shows a results table for all six tickets. The first
   time, wait for the databases to start. It re-checks every ticket each time you save a
   file. If no table appears, open a terminal and run `npm run watch`.
2. Open the tickets in order: `exercises/01-commission/TICKET.md` first.
3. Open a second terminal (the **+** button in the terminal panel) and run the command in
   the ticket to see the bug, for example `npm run try 1`.
4. Fix the file named in the ticket and save it. Watch the results table.
5. A ticket is done when it shows **PASS**.

## Commands

| Command | What it does |
| --- | --- |
| `npm run try 1` | Resets the data, loads your current code, and reproduces ticket 1 (use 1 to 6) |
| `npm run check` | Runs all six checks once |
| `npm run sql -- "SELECT * FROM dbo.LedgerEntry"` | Runs any T-SQL and prints the result |
| `npm run sql -- path/to/file.sql` | Runs a .sql file |
| `npm run mongo -- "db.collection('receipts').find().toArray()"` | Runs a MongoDB expression |

Every `try` and every check starts from the same clean data, so you cannot break anything.

## Ground rules

- Talk through what you are thinking. How you get to the fix matters as much as the fix.
- Only the file named in each ticket needs to change.
- Official documentation is fine to use. Ask your interviewer before using anything else.
- Leave `scripts/` and `db/` as they are.

## Where things are

```
exercises/   one folder per ticket: the ticket, the file to fix, and a script that reproduces the bug
db/          table definitions and starting data, worth reading
scripts/     the commands above
```

The table definitions are in `db/sqlserver/reset.sql`. The MongoDB documents are in
`db/mongo/seed.js`.
