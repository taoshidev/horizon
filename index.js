import "dotenv/config";

import "./instrument.js";

import * as Sentry from "@sentry/node";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Command } from "commander";
import config from "config";

import { watchTower } from "./watcher/modules/app/index.js";
import { startWebSocket } from "./watcher/modules/websocket/start.js";
import { initializeRoutes } from "./watcher/routes/index.js";
import { SupportedExchanges } from "./watcher/constants/index.js";

const app = express();
Sentry.setupExpressErrorHandler(app);

app.use(cors({
  origin: 'http://localhost:3000',
}));

const server = createServer(app);
const wss = startWebSocket(server);
const program = new Command();

const port = config.get("port");
const exchange = config.get("exchange");

app.use(express.json());
app.use("/api", initializeRoutes(wss));

program
  .option("--exchange <string>", "specify the exchange to use", exchange)
  .option("--port <number>", "specify the port to use", port)
  .parse(process.argv);

(async () => {
  try {
    server.listen(program.opts().port, () => {
      console.log(`Server running on http://localhost:${program.opts().port}`);
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
