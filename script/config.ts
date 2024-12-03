/**
 * Taken from https://dev.to/asjadanis/parsing-env-with-typescript-3jjm
 */

import path from 'path';
import dotenv from 'dotenv';

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
    AUTHORIZATION_CODE: string | undefined
    ACTIVE_SEASON: number
}

interface Config {
    AUTHORIZATION_CODE: string
    ACTIVE_SEASON: number
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
    return {
        AUTHORIZATION_CODE: process.env.AUTHORIZATION_CODE,
        ACTIVE_SEASON: Number(process.env.ACTIVE_SEASON)
    };
};

// Throwing an Error if any field was undefined we don't 
// want our app to run if it can't connect to DB and ensure 
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type 
// definition.

const getSanitzedConfig = (config: ENV): Config => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`❌ Missing key ${key} in env`);
        }
    }
    return config as Config;
};

const config = getSanitzedConfig(getConfig());

export default config;