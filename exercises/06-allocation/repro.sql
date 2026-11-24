EXEC dbo.usp_AllocateReceipt @ReceiptId = 501;
EXEC dbo.usp_AllocateReceipt @ReceiptId = 502;
EXEC dbo.usp_AllocateReceipt @ReceiptId = 503;
EXEC dbo.usp_AllocateReceipt @ReceiptId = 504;
GO

-- Each allocation
SELECT a.ReceiptId, p.Name AS Payee, s.SharePercent, a.Amount
FROM dbo.ReceiptAllocation a
JOIN dbo.ReceiptSplit s ON s.ReceiptId = a.ReceiptId AND s.PayeeId = a.PayeeId
JOIN dbo.Payee p ON p.PayeeId = a.PayeeId
ORDER BY a.ReceiptId, a.PayeeId;
GO

-- Does each receipt add up?
SELECT r.ReceiptId,
       r.Amount                AS ReceiptAmount,
       SUM(a.Amount)           AS Allocated,
       r.Amount - SUM(a.Amount) AS Difference
FROM dbo.Receipt r
JOIN dbo.ReceiptAllocation a ON a.ReceiptId = r.ReceiptId
GROUP BY r.ReceiptId, r.Amount
ORDER BY r.ReceiptId;
