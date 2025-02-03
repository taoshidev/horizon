import { calculateLeverage } from "../../utils/calculateLeverage.js";
import { getExchangeConfigModule } from "../exchanges/index.js";

export function toSignal({ id, order, balance }) {
  const exchange = getExchangeConfigModule(id);

  const transformedOrder = exchange.transformOrder(order);
  const leverage = calculateLeverage(order, balance);

  return {
    ...transformedOrder,
    leverage: leverage,
  };
}
