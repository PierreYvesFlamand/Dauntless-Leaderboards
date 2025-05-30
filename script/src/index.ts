import fs from 'fs';
import pako from 'pako';

import { startImportTrials } from './importers/trials';
import { startGauntletsImport } from './importers/gauntlets';

import { ALL_DATA, BEHEMOTH, GAUNTLET_SEASON, GUILD, GUILD_DATA, PLATFORM, PLAYER, ROLE, TRIAL, WEAPON } from './types/types';

(async () => {
    // await startGauntletsImport();
    // await startImportTrials();

    const gauntlets: GAUNTLET_SEASON[] = [];
    for (const filename of fs.readdirSync('../database/gauntlets')) {
        gauntlets.push(JSON.parse(fs.readFileSync(`../database/gauntlets/${filename}`, 'utf8')) as GAUNTLET_SEASON);
    }

    const trials: TRIAL[] = [];
    for (const filename of fs.readdirSync('../database/trials')) {
        trials.push(JSON.parse(fs.readFileSync(`../database/trials/${filename}`, 'utf8')) as TRIAL);
    }

    const allData: ALL_DATA = {
        gauntlets,
        guilds: JSON.parse(fs.readFileSync('../database/guilds.json', 'utf8')) as GUILD[],
        trials,
        behemoths: JSON.parse(fs.readFileSync('../database/behemoths.json', 'utf8')) as BEHEMOTH[],
        players: JSON.parse(fs.readFileSync('../database/players.json', 'utf8')) as PLAYER[]
    };

    let allDataToText = JSON.stringify(allData);
    fs.writeFileSync('../database/allData.json', allDataToText);
    fs.writeFileSync('../website/public/data/allData.json', allDataToText);
    fs.writeFileSync('../database/allData.json.compressed', pako.deflate(allDataToText));
    fs.writeFileSync('../website/public/data/allData.json.compressed', pako.deflate(allDataToText));

    const dataTimestamp = new Date().getTime();
    fs.writeFileSync('../database/allDataVersion.json', JSON.stringify({ timestamp: dataTimestamp }));
    fs.writeFileSync('../website/public/data/allDataVersion.json', JSON.stringify({ timestamp: dataTimestamp }));

    console.log('Done ✅');
})();