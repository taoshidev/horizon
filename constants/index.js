export const SupportedExchanges = ["mexc", "bybit", "okx"];

const cryptoBase = {
  fees: 0.001,
  min_leverage: 0.1,
  max_leverage: 5,
  trade_pair_category: "crypto",
};

export const TradePair = {
  BTCUSDT: {
    trade_pair_id: "BTCUSD",
    trade_pair: "BTC/USD",
    ...cryptoBase,
  },
  ETHUSDT: {
    trade_pair_id: "ETHUSD",
    trade_pair: "ETH/USD",
    ...cryptoBase,
  },
  SOLUSDT: {
    trade_pair_id: "SOLUSD",
    trade_pair: "SOL/USD",
    ...cryptoBase,
  },
  XRPUSDT: {
    trade_pair_id: "XRPUSD",
    trade_pair: "XRP/USD",
    ...cryptoBase,
  },
  DOGEUSDT: {
    trade_pair_id: "DOGEUSD",
    trade_pair: "DOGE/USD",
    ...cryptoBase,
  },
};
