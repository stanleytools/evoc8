-- Returns the agency's commission on a gross receipt.
-- @RatePercent is a whole number: 10 means 10 percent.
CREATE OR ALTER FUNCTION dbo.fn_Commission
(
  @Gross       DECIMAL(19,2),
  @RatePercent INT
)
RETURNS DECIMAL(19,2)
AS
BEGIN
  RETURN ROUND(@Gross * (@RatePercent / 100), 2);
END
