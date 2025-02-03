export const userBalance = (balance) => {
  const balances = ["USDC", "BTC", "ETH", "USDT"].map((currency) => ({
    Currency: currency,
    Free: balance[currency]?.free || "N/A",
    Used: balance[currency]?.used || "N/A",
    Total: balance[currency]?.total || "N/A",
    Debt: balance[currency]?.debt || "N/A",
  }));

  console.table(balances);
};
