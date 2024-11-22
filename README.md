![Screenshot](assets/oppenheimer.png)

Oppenheimer is a modular and extensible Node.js application that watches orders on multiple exchanges, processes them, and sends signals to [Proprietary Trading Network](https://github.com/taoshidev/proprietary-trading-network). 
It supports integration with popular exchanges like Bybit, OKX, and MEXC, leveraging the ccxt library for exchange interactions.


## Features
- Modular Exchange Integration:
  - Dynamically supports multiple exchanges using the ccxt library.
  - Each exchange has its own configuration and logic for flexibility.
- Signal Processing:
  - Converts exchange orders and balances into PTN signal formats.

## Installation

**Prerequisites**
- **Node.js** (version 20+)
- **npm** (Node Package Manager)

### Steps
1. Clone the repository
```bash
git clone https://github.com/taoshidev/oppenheimer.git
cd oppenheimer
```

2. Install dependencies:
```bash
npm install
```

3. Configure the project:
- Update the `config.json` file with your API keys, secrets, and exchange settings.

## Usage
**Starting the Server**

To start the server for bybit:
```bash
npm run dev -- --exchange bybit
```

**Watching Orders**

The application automatically starts watching orders on the configured exchanges and processes them into signals.

---

## Key Components

**Exchange Initialization**

**File**: `modules/exchanges/index.js`

Exchanges are dynamically loaded based on their ID. For example:
- Bybit: Enables demo trading using enableDemoTrading.
- OKX: Configures sandbox mode via set_sandbox_mode.

```js
import { getExchangeConfigModule } from "./modules/exchanges/index.js";

const exchange = await initializeExchange("bybit", {
  apiKey: "your-api-key",
  secret: "your-secret",
  demo: true,
});
```

**Signal Processing**

**File**: `modules/orders/toSignal.js`

Converts orders and balances into signals:

```js
export function toSignal({ id, order, balance }) {
  const leverage = calculateLeverage(order, balance);

  return {
    trade_pair: order.info.symbol,
    order_type: order.side.toUpperCase() === "BUY" ? "LONG" : "SHORT",
    leverage,
  };
}
```

**WebSocket Broadcasting**

**File**: `modules/websocket/broadcast.js`

Broadcasts signals to connected WebSocket clients:

```js
export function broadcast(wss, message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}
```

## Configuration
**File**: `config.json`

Update this file with your API credentials and exchange settings. For example:
```json
{
  "port": 8080,
  "signal-server": "http://127.0.0.1:3005",
  "bybit": {
    "apiKey": "your-bybit-api-key",
    "secret": "your-bybit-secret",
    "demo": true
  },
  "okx": {
    "apiKey": "your-okx-api-key",
    "secret": "your-okx-secret",
    "password": "your-okx-password",
    "demo": true
  }
}
```

## Adding New Exchanges
1. Create a new module in `modules/exchanges` (e.g., mexc.js):
```js
export function configureExchange(exchange, { demo }) {
  if (demo) {
    console.log("Configuring MEXC in demo mode.");
  }
}

export function getOptions() {
  return { defaultType: "spot" };
}
```

2.	Update the index.js file:
```js
import * as mexc from "./mexc.js";

const exchangeModules = {
  bybit,
  okx,
  mexc, // Add the new exchange here
};

export function getExchangeConfigModule(id) {
  return exchangeModules[id] || null;
}
```

3.	Use initializeExchange to initialize the new exchange.
