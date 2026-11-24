-- Shares a receipt between its payees according to dbo.ReceiptSplit
-- and writes the result to dbo.ReceiptAllocation.
CREATE OR ALTER PROCEDURE dbo.usp_AllocateReceipt
  @ReceiptId INT
AS
BEGIN
  SET NOCOUNT ON;

  DELETE FROM dbo.ReceiptAllocation
  WHERE ReceiptId = @ReceiptId;

  INSERT INTO dbo.ReceiptAllocation (ReceiptId, PayeeId, Amount)
  SELECT r.ReceiptId,
         s.PayeeId,
         ROUND(r.Amount * s.SharePercent / 100.0, 2)
  FROM dbo.Receipt r
  JOIN dbo.ReceiptSplit s ON s.ReceiptId = r.ReceiptId
  WHERE r.ReceiptId = @ReceiptId;
END
