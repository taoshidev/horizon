import _ from "lodash";

import config from "../../config.json" assert { type: "json" };

import { toSignal } from "../order/toSignal.js";

import { initializeExchange } from "../ccxt/initializeExchange.js";
import { isFilled } from "../ccxt/isFilled.js";

import { userBalance } from "../logging/userBalance.js";
import { broadcast } from "../websocket/broadcast.js";
import { send } from "../order/send.js";

export const watchTower = async (id, wss) => {
  let exchange = await initializeExchange(id, config[id]);

  if (!exchange) return null;

  try {
    await exchange.loadMarkets();
  } catch (error) {
    console.log(error);
  }

  try {
    const balance = await exchange.fetchBalance();
    userBalance(balance);

    console.info(`Watching orders for ${id}...`);
  } catch (error) {
    console.error("Error fetching balance:", error);
  }

  while (true) {
    try {
      const order = await exchange.watchOrders();
      const recentOrder = _.last(order);

      if (isFilled(recentOrder)) {
        const newBalance = await exchange.fetchBalance();

        const signal = toSignal({
          id,
          order: recentOrder,
          balance: newBalance,
        });

        const response = await send(signal);
        console.info(
          `${signal.trade_pair.trade_pair_id}:${signal.order_type} sent to PTN`,
        );

        userBalance(newBalance);
        broadcast(wss, response.data);
      }
    } catch (error) {
      console.error("Error watching orders:", error);
    }
  }
};
