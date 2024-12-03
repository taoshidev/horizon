import config from "../../config.json" assert { type: "json" };
import path from "path";

import { readFileSync } from "fs";

/**
 * Here we want to create a function allowing us to override the base config.json
 * This allows us to create a new config based on a dynamic environment (development | production)
 * If there is a config we want to use, it can be specified in the root as config-<env>.json
 * As an example for development we want to create and supply a .env that sets NODE_ENV to development
 * The config can then read this file and overlay it to override the config.json to provide the required secrets
 * @returns Config
 */
export function loadEnvironment() {
    let configOverride;

    // Node has to be handed the root directory or reading files will not work (there may be a better way to do this)
    // Here we want to wrap the configuration read so any errors can be handled here vs throwing them out
    // We can fail gracefully here incase we do not want to override the default config.json
    try {
        if (process.env.NODE_ENV !== 'production') {
            const rootDir = path.dirname(process.argv[1]);

            configOverride = readFileSync(`${rootDir}/config-${process.env.NODE_ENV}.json`, 'utf-8');
        }
    } catch (configReadError) {
        console.error("Could not load environment override file -\n\n", configReadError);
    }

    let environmentConfiguration = config;

    // Before we overlay another config we want to be sure one was read
    if (configOverride) {
        environmentConfiguration = Object.assign(environmentConfiguration, JSON.parse(configOverride));
    }

    return environmentConfiguration;
}