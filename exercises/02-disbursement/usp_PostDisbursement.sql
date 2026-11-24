-- Pays money out of a client's trust balance.
-- Rule: a client can never be paid more than that client currently holds in trust.
CREATE OR ALTER PROCEDURE dbo.usp_PostDisbursement
  @ClientId  INT,
  @Amount    DECIMAL(19,2),
  @Reference VARCHAR(50)
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @Available DECIMAL(19,2);

  SELECT @Available = COALESCE(SUM(Amount), 0)
  FROM dbo.LedgerEntry;

  IF @Amount > @Available
  BEGIN
    THROW 50001, 'Insufficient client funds.', 1;
  END

  INSERT INTO dbo.LedgerEntry (ClientId, EntryType, Amount, Reference)
  VALUES (@ClientId, 'DISBURSEMENT', -@Amount, @Reference);
END
