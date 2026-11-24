-- An integration sends a receipt with the commission amount missing.
EXEC dbo.usp_PostReceipt
  @ClientId = 1, @Gross = 1000.00, @CommissionAmount = NULL, @Reference = 'R-BROKEN';
GO

-- What was written for that receipt?
SELECT 'LedgerEntry' AS TableName, EntryType, Amount
FROM dbo.LedgerEntry WHERE Reference = 'R-BROKEN'
UNION ALL
SELECT 'CommissionEarned', 'COMMISSION', Amount
FROM dbo.CommissionEarned WHERE Reference = 'R-BROKEN';
