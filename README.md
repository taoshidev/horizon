<p align="center">
  <img src="assets/horizon.png" style="width: 30%; height: auto;">
</p>

Horizon is a complete solution for managing PTN miners and exchange connectivity.

## Features

### Order Watcher

- Real-time order monitoring
- Automated order-to-signal conversion
- Dynamic leverage calculation
- WebSocket status updates
- Exchange sandbox/testnet support
- Modular exchange integration


### Easy Miner

**Miner Management**
- Start/stop miners
- Real-time log viewing

**Order Monitoring**

- Live order feed
- Status tracking
- Error reporting

Architecture

```bash
/
├── watcher/                 # Exchange monitoring service
│   ├── modules/
│   │   ├── app/            # Core application logic
│   │   ├── ccxt/           # Exchange integration
│   │   ├── miner/          # Miner management
│   │   ├── order/          # Order processing
│   │   └── websocket/      # Real-time updates
│   └── routes/             # API endpoints
├── easy-miner/             # Web interface
│   ├── app/                # Next.js application
│   │   ├── actions/        # Server actions
│   │   └── store/          # State management
│   ├── components/         # UI components
│   └── features/           # Feature modules
└── config/                 # Configuration files
```

## Prerequisites
- Node.js 20+
- Python 3.8+
- PTN installed and configured
- Exchange API credentials

## Installation

1. Clone the repository
```bash
git clone https://github.com/taoshidev/horizon.git
cd horizon
```

2. Install dependencies:
```bash
npm install
```

3. Configure the project:
```bash
cp config/default.json.example config/default.json
```

4. Update configuration:

```json
{
  "port": 8080,
  "signal-server": "http://127.0.0.1:3005",
  "ptn-path": "/path/to/your/ptn",
  "exchange": "",
  "[exchange-id]": {
    "apiKey": "your-api-key",
    "secret": "your-secret",
    "market": "future",  // Optional
    "password": "",      // If required by exchange
    "demo": false
  }
}
```

## Usage
### Development Mode

Start both components:
```bash
npm run dev
```

**Start individually:**
```bash
# Watcher only
node index.js --exchange [exchange-id]

# Easy Miner only
cd easy-miner && npm run dev
```

The application automatically starts watching orders on the configured exchanges and processes them into signals.


## Exchange Integration

1. Create exchange module (`/watcher/modules/exchanges/[exchange-id].js`):

```js
export function transformOrder(order) {
  return {
    trade_pair: TradePair[formatSymbol(order)],
    order_type: determineOrderType(order),
  };
}

export function configureExchange(exchange, config) {
  // Configure sandbox mode if supported
  if (typeof exchange.set_sandbox_mode === "function") {
    exchange.set_sandbox_mode(config.demo);
  }

  // Add any exchange-specific configuration
}

// Optional: Custom options for CCXT initialization
export function getOptions() {
  return {
    defaultType: "future", // Or other CCXT options
  };
}
```

2. Add to exchange registry (`./watcher/modules/exchanges/index.js`):

```js
import * as customExchange from "./[exchange-id].js";

const exchangeModules = {
  [exchange-id]: customExchange,
};
```

**Signal Processing**

**File**: `./watcher/modules/orders/toSignal.js`

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


### Production Mode

```bash
npm run build
npm start
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

Ensure your PR:
- Includes tests
- Updates documentation
- Maintains code style
- Has clear description

## License
MIT License

## Support
- GitHub Issues
- Discord: Join
- Email: support@taoshi.io

Built by Taoshi
