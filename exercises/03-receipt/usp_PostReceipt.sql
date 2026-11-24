-- Records money received for a client and the agency's commission on it.
-- Three rows belong together:
--   1. the gross receipt on the client's ledger
--   2. the commission the agency earned
--   3. the commission taken off the client's ledger
CREATE OR ALTER PROCEDURE dbo.usp_PostReceipt
  @ClientId         INT,
  @Gross            DECIMAL(19,2),
  @CommissionAmount DECIMAL(19,2),
  @Reference        VARCHAR(50)
AS
BEGIN
  SET NOCOUNT ON;

  INSERT INTO dbo.LedgerEntry (ClientId, EntryType, Amount, Reference)
  VALUES (@ClientId, 'RECEIPT', @Gross, @Reference);

  INSERT INTO dbo.CommissionEarned (ClientId, Amount, Reference)
  VALUES (@ClientId, @CommissionAmount, @Reference);

  INSERT INTO dbo.LedgerEntry (ClientId, EntryType, Amount, Reference)
  VALUES (@ClientId, 'COMMISSION', -@CommissionAmount, @Reference);
END
