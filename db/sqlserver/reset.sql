-- Rebuilds the tables and starting data. Runs before every check.
-- Not part of any exercise.
DROP TABLE IF EXISTS dbo.ReceiptAllocation;
DROP TABLE IF EXISTS dbo.ReceiptSplit;
DROP TABLE IF EXISTS dbo.Receipt;
DROP TABLE IF EXISTS dbo.Payee;
DROP TABLE IF EXISTS dbo.CommissionEarned;
DROP TABLE IF EXISTS dbo.LedgerEntry;
DROP TABLE IF EXISTS dbo.Client;
GO

CREATE TABLE dbo.Client (
  ClientId INT NOT NULL PRIMARY KEY,
  Name     NVARCHAR(100) NOT NULL
);

-- One row per movement of client money held in trust.
-- Amount is signed: receipts are positive, disbursements and commission are negative.
-- A client's balance is SUM(Amount) over their rows.
CREATE TABLE dbo.LedgerEntry (
  EntryId   INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  ClientId  INT NOT NULL REFERENCES dbo.Client (ClientId),
  EntryType VARCHAR(20) NOT NULL CHECK (EntryType IN ('RECEIPT', 'DISBURSEMENT', 'COMMISSION')),
  Amount    DECIMAL(19,2) NOT NULL,
  Reference VARCHAR(50) NOT NULL,
  PostedAt  DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME()
);

-- Commission the agency has earned, one row per receipt.
CREATE TABLE dbo.CommissionEarned (
  CommissionId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  ClientId     INT NOT NULL REFERENCES dbo.Client (ClientId),
  Amount       DECIMAL(19,2) NOT NULL CHECK (Amount >= 0),
  Reference    VARCHAR(50) NOT NULL
);

CREATE TABLE dbo.Payee (
  PayeeId INT NOT NULL PRIMARY KEY,
  Name    NVARCHAR(100) NOT NULL
);

-- Money received that has to be shared between several payees.
CREATE TABLE dbo.Receipt (
  ReceiptId INT NOT NULL PRIMARY KEY,
  ClientId  INT NOT NULL REFERENCES dbo.Client (ClientId),
  Amount    DECIMAL(19,2) NOT NULL,
  Reference VARCHAR(50) NOT NULL
);

-- How each receipt is shared. SharePercent adds up to 100 per receipt.
CREATE TABLE dbo.ReceiptSplit (
  ReceiptId    INT NOT NULL REFERENCES dbo.Receipt (ReceiptId),
  PayeeId      INT NOT NULL REFERENCES dbo.Payee (PayeeId),
  SharePercent DECIMAL(9,4) NOT NULL,
  PRIMARY KEY (ReceiptId, PayeeId)
);

-- The amounts actually allocated. Written by dbo.usp_AllocateReceipt.
CREATE TABLE dbo.ReceiptAllocation (
  ReceiptId INT NOT NULL REFERENCES dbo.Receipt (ReceiptId),
  PayeeId   INT NOT NULL REFERENCES dbo.Payee (PayeeId),
  Amount    DECIMAL(19,2) NOT NULL,
  PRIMARY KEY (ReceiptId, PayeeId)
);
GO

INSERT INTO dbo.Client (ClientId, Name) VALUES
  (1, N'Avery Stone'),
  (2, N'Jordan Blake'),
  (3, N'Riley Chen');

INSERT INTO dbo.LedgerEntry (ClientId, EntryType, Amount, Reference) VALUES
  (1, 'RECEIPT',   500.00, 'R-1001'),
  (2, 'RECEIPT', 10000.00, 'R-1002');

INSERT INTO dbo.Payee (PayeeId, Name) VALUES
  (1, N'Client share'),
  (2, N'Manager'),
  (3, N'Business manager');

INSERT INTO dbo.Receipt (ReceiptId, ClientId, Amount, Reference) VALUES
  (501, 1,  100.00, 'TOUR-501'),
  (502, 2, 1000.00, 'FILM-502'),
  (503, 2,    0.05, 'RESIDUAL-503'),
  (504, 3, 2500.01, 'ENDORSE-504');

INSERT INTO dbo.ReceiptSplit (ReceiptId, PayeeId, SharePercent) VALUES
  (501, 1, 33.3334), (501, 2, 33.3333), (501, 3, 33.3333),
  (502, 1, 50.0000), (502, 2, 30.0000), (502, 3, 20.0000),
  (503, 1, 50.0000), (503, 2, 50.0000),
  (504, 1, 60.0000), (504, 2, 40.0000);
GO
