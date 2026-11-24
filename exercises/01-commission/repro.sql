SELECT
  dbo.fn_Commission(2500.00, 10) AS [10% of 2500.00],
  dbo.fn_Commission(1999.99, 15) AS [15% of 1999.99],
  dbo.fn_Commission(80.00, 5)    AS [5% of 80.00];
