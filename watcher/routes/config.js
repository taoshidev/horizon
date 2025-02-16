import { JSONFilePreset } from "lowdb/node";

import config from "config";
import path from "path";

const env = config.util.getEnv("NODE_ENV");
const configPath = path.join("config", `${env}.json`);

export const configRoutes = (router, wss) => {
  router.post("/save-config", async (req, res) => {
    const db = await JSONFilePreset(configPath, config);
    const { exchange, apiKey, secret, demo } = req.body;

    if (!apiKey || !secret || !demo) {
      return res.status(400).json({ error: "Missing required data" });
    }

    try {
      db.data = {
        ...db.data,
        [exchange]: { apiKey, secret, demo },
      };

      await db.write();

      res.status(200).json({
        status: 200,
        message: `Configuration for ${exchange} saved successfully`,
        data: db.data[exchange],
      });
    } catch (error) {
      console.error("Error saving config file:", error);
      return res.status(500).json({ error: "Failed to save config file" });
    }
  });

  router.get("/get-config", async (req, res) => {
    return res.status(200).json({
      message: `Configuration retrieved successfully`,
      data: config.util.toObject(),
    });
  });

  return router;
};
