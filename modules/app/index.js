import _ from "lodash";

import config from "config";

import { toSignal } from "../order/toSignal.js";

import { initializeExchange } from "../ccxt/initializeExchange.js";
import { isFilled } from "../ccxt/orderStatus.js";

import { userBalance } from "../logging/userBalance.js";
import { broadcast } from "../websocket/broadcast.js";
import { send } from "../order/send.js";

export const watchTower = async (id, wss) => {
  let exchange = await initializeExchange(id, config.get(id));

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

  console.log(config.get(id).market);

  while (true) {
    try {
      const positions =
        await exchange[
          config.get(id).market === "futures" ? watchMyTrades() : watchOrders()
        ];
      const newPosition = _.last(positions);

      broadcast(wss, {
        type: "notification",
        data: {
          ptn: { error: null, status: "unsent" },
          ...newPosition,
        },
      });

      if (isFilled(newPosition)) {
        const newBalance = await exchange.fetchBalance();

        const signal = toSignal({
          id,
          order: newPosition,
          balance: newBalance,
        });

        try {
          await send(signal);

          console.info(
            `${signal.trade_pair.trade_pair_id}:${signal.order_type} sent to PTN`,
          );

          userBalance(newBalance);
          broadcast(wss, {
            type: "notification",
            data: {
              ptn: { error: null, status: "sent" },
              ...newPosition,
            },
          });
        } catch (error) {
          broadcast(wss, {
            type: "notification",
            data: {
              ptn: {
                error: error.message,
                status: "error",
              },
              ...newPosition,
            },
          });
        }
      }
    } catch (error) {
      broadcast(wss, {
        type: "notification",
        data: {
          ptn: {
            error: error.message,
            status: "error",
          },
        },
      });
    }
  }
};
