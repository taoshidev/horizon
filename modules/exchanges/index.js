import * as bybit from "./bybit.js";
import * as okx from "./okx.js";

const exchangeModules = {
  bybit,
  okx,
};

export function getExchangeConfigModule(id) {
  return exchangeModules[id] || null;
}
