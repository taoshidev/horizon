import * as bybit from "./bybit.js";
import * as okx from "./okx.js";
import * as mexc from "./mexc.js";

const exchangeModules = {
  bybit,
  okx,
  mexc,
};

export function getExchangeConfigModule(id) {
  return exchangeModules[id] || null;
}
