import config from "config";
import { spawn } from "child_process";
import path from "path";

import { broadcast } from '../websocket/broadcast.js';

const ptnPath = config.get("ptn-path");

export const startMiner = async (wss, { testnet, wallet, debug = true, dashboard }) => {
  if (!testnet || !wallet) {
    throw new Error(
      "Missing required data: 'testnet' and 'wallet' are required.",
    );
  }

  const scriptPath = path.resolve(`${ptnPath}/neurons/miner.py`);
  const args = [
    `--netuid`,
    testnet ? 116 : 8,
    `--wallet.name`,
    wallet,
    `--wallet.hotkey`,
    "default",
    `--subtensor.network`,
    testnet ? "test" : "main",
  ];

  if (debug) args.push("--logging.debug");
  if (dashboard) {
    args.push("--start-dashboard");
  }

  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", [scriptPath, ...args]);

    let stdout = "";
    let stderr = "";

    pythonProcess.stdout.on("data", (data) => {
      stdout += data.toString();
      console.log("Python STDOUT:", data.toString());
      broadcast(wss, { type: "log", message: data.toString() });
    });

    pythonProcess.stderr.on("data", (data) => {
      stderr += data.toString();
      console.error("Python STDERR:", data.toString());
      broadcast(wss, { type: "error", message: data.toString() });
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        broadcast(wss, {
          type: "status",
          message: "Miner started successfully",
        });
        resolve(stdout);
      } else {
        broadcast(wss, { type: "status", message: "Miner failed to start" });
        reject(new Error(stderr || `Python process exited with code ${code}`));
      }
    });

    pythonProcess.on("error", (error) => {
      reject(error);
    });
  });
};
