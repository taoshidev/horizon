import _ from "lodash";
import { TradePair } from "../../constants/index.js";

const OrderType = {
  BUY: "LONG",
  SELL: "SHORT",
};

export function transformOrder(order) {
  return {
    trade_pair: TradePair[order.info.symbol],
    order_type: OrderType[_.upperCase(order.info.side)],
  };
}

export function transformBalance(balance) {
  return balance;
}

export async function configureExchange(exchange, config) {
  if (typeof exchange.enableDemoTrading === "function") {
    await exchange.enableDemoTrading(config.demo);
  }
}
