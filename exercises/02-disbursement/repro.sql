-- Balances before
SELECT c.ClientId, c.Name, COALESCE(SUM(e.Amount), 0) AS Balance
FROM dbo.Client c
LEFT JOIN dbo.LedgerEntry e ON e.ClientId = c.ClientId
GROUP BY c.ClientId, c.Name
ORDER BY c.ClientId;
GO

-- Avery Stone holds 500.00. Try to pay out 2000.00.
EXEC dbo.usp_PostDisbursement @ClientId = 1, @Amount = 2000.00, @Reference = 'D-OVERDRAW';
GO

-- Balances after
SELECT c.ClientId, c.Name, COALESCE(SUM(e.Amount), 0) AS Balance
FROM dbo.Client c
LEFT JOIN dbo.LedgerEntry e ON e.ClientId = c.ClientId
GROUP BY c.ClientId, c.Name
ORDER BY c.ClientId;
