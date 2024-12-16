import "dotenv/config";

import express from "express";
import { createServer } from "http";
import _ from "lodash";
import { Command } from "commander";
import config from "config";

import { watchTower } from "./modules/app/index.js";
import { startWebSocket } from "./modules/websocket/start.js";
import { initializeRoutes } from "./routes/index.js";
import { SupportedExchanges } from "./constants/index.js";

const app = express();
const server = createServer(app);
const wss = startWebSocket(server);
const program = new Command();

app.use(express.json());
app.use("/api", initializeRoutes(wss));

const port = config.get("port");

program
  .option("--exchange <string>", "specify the exchange to use", "")
  .option("--port <number>", "specify the port to use", port)
  .parse(process.argv);

const options = program.opts();

(async () => {
  try {
    server.listen(options.port, () => {
      console.log(`Server running on http://localhost:${options.port}`);
      console.log(`WebSocket server running on ws://localhost:${options.port}`);
    });

    if (SupportedExchanges.includes(options.exchange)) {
      console.log(`Initializing watchTower for exchange: ${options.exchange}`);

      await watchTower(options.exchange, wss);
    } else {
      console.warn("Exchange not supported");
    }
  } catch (error) {
    console.warn("Error starting Order Watcher");
  }
})();
