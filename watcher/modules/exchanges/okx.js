import _ from "lodash";
import { TradePair } from "../../constants/index.js";

const OrderType = {
  BUY: "LONG",
  SELL: "SHORT",
};

export function transformOrder(order) {
  const formattedSymbol = _.replace(order.info.instId, "-", "");

  return {
    trade_pair: TradePair[formattedSymbol],
    order_type: OrderType[_.upperCase(order.info.side)],
  };
}

export function transformBalance(balance) {
  return balance;
}

export function configureExchange(exchange, config) {
  if (typeof exchange.set_sandbox_mode === "function") {
    exchange.set_sandbox_mode(config.demo);
  }
}
