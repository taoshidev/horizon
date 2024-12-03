import { pro as ccxt } from "ccxt";

import { getExchangeConfigModule } from "../exchanges/index.js";

export async function initializeExchange(id, config) {
  const { apiKey, secret, password, demo } = config;

  if (!apiKey || !secret) {
    throw new Error("API key or secret is missing.");

  }

  const exchangeConfigModule = getExchangeConfigModule(id);

  const exchangeConfig = {
    apiKey,
    secret,
    ...(password && { password }),
    ...(exchangeConfigModule?.getOptions && {
      options: Object.assign(exchangeConfigModule.getOptions(), {'defaultType': 'future'})
    }),
  };

  const exchange = new ccxt[id](exchangeConfig);

  if (exchangeConfigModule?.configureExchange) {
    await exchangeConfigModule.configureExchange(exchange, { demo });
  }

  exchange.enableRateLimit = true;
  
  return exchange;
}
