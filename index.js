import "dotenv/config";

import "./instrument.js";

import * as Sentry from "@sentry/node";
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
const port = config.get("port");

Sentry.setupExpressErrorHandler(app);

app.use(express.json());
app.use("/api", initializeRoutes(wss));

program
  .option("--exchange <string>", "specify the exchange to use", "")
  .option("--port <number>", "specify the port to use", port)
  .parse(process.argv);

(async () => {
  try {
    server.listen(options.port, () => {
      console.log(`Server running on http://localhost:${program.opts().port}`);
      console.log(`WebSocket server running on ws://localhost:${options.port}`);
    });

    if (SupportedExchanges.includes(program.opts().exchange)) {
      console.log(
        `Initializing watchTower for exchange: ${program.opts().exchange}`,
      );

      await watchTower(program.opts().exchange, wss);
    } else {
      console.warn("Exchange not supported");
    }
  } catch (error) {
    console.warn("Error starting Order Watcher");
    Sentry.captureException(error);
  }
})();
