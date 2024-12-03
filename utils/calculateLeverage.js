export function calculateLeverage(order, balance) {
	const currentOrderValue = order.price * order.amount;

	const accountBalanceUSD = balance.total.USDC + balance.total.USDT + (balance.total.BTC * balance.free.USDT / balance.free.BTC) + (balance.total.ETH * balance.free.USDT / balance.free.ETH);

	const openPositionValueUSD = Object.values(balance.used).reduce((acc, value) => acc + value, 0);

	const accountLeverage = currentOrderValue / (openPositionValueUSD + accountBalanceUSD + currentOrderValue);

	// return leverage
	return accountLeverage >= 0.01 ? accountLeverage : 0.01;
}