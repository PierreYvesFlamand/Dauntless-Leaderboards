import fs from 'fs';
import path from 'path';
import { DAUNTLESS_ALL_SEASONS, DAUNTLESS_SEASON_DETAIL, LEADERBOARD_ITEM, LEADERBOARD_POSITION_DIRECTION, SEASON_DETAIL } from './types';

const ROOT_FOLDER_PATH = path.resolve('../server/public/data');
const ALL_SEASON_URL = 'https://storage.googleapis.com/dauntless-gauntlet-leaderboard/production-gauntlet-all-seasons.json';
const SEASON_URL = 'https://storage.googleapis.com/dauntless-gauntlet-leaderboard';

// Script starter with interval
scrap();
// setInterval(scrap, 1000 * 60 * 1);
setInterval(scrap, 1000 * 60 * 10);

// Main scrap
async function scrap(): Promise<void> {
    // Check if main folder exist and create it if not
    if (!fs.existsSync(ROOT_FOLDER_PATH)) fs.mkdirSync(ROOT_FOLDER_PATH);

    // Get all seasons data and restart scrap if endpoint is down
    const allSeasonsData = await getAllSeasonsData();
    if (!allSeasonsData) {
        setTimeout(scrap, 1000 * 30);
        return;
    }

    // Loop on all past seasons
    for (const season of allSeasonsData.past_seasons) {
        if (Number(season.gauntlet_id.slice(15)) >= Number(allSeasonsData.active_season.gauntlet_id.slice(15))) continue;

        const seasonFolder = `${ROOT_FOLDER_PATH}/${season.gauntlet_id}`;

        // Check if season folder exist and create it if not
        if (!fs.existsSync(seasonFolder)) fs.mkdirSync(seasonFolder);

        const finalLeaderboardFilePath = `${seasonFolder}/final-leaderboard.json`;

        if (!fs.existsSync(finalLeaderboardFilePath)) {
            // Get season data and restart scrap if endpoint is down
            const seasonData = await getSeasonData(season.gauntlet_id);
            if (!seasonData) {
                setTimeout(scrap, 1000 * 30);
                return;
            }

            // Format data
            const formatedSeasonData: SEASON_DETAIL = {
                startAt: season.start_at,
                endAt: seasonData.end_at,
                lastUpdated: seasonData.last_updated,
                leaderboard: seasonData.leaderboard.map(i => {
                    return {
                        guildName: i.guild_name,
                        guildNameplate: i.guild_nameplate,
                        level: i.level,
                        remainingSec: i.remaining_sec,
                    }
                })
            };

            fs.writeFileSync(finalLeaderboardFilePath, JSON.stringify(formatedSeasonData, null, 2), 'utf8');

            // Create or update the "all-seasons" file
            const allSeasonsFilePath = `${ROOT_FOLDER_PATH}/all-seasons.json`;
            let allSeasons: { [key in string]: SEASON_DETAIL } = {};
            if (fs.existsSync(allSeasonsFilePath)) {
                allSeasons = JSON.parse(fs.readFileSync(allSeasonsFilePath, 'utf8'));
            }
            allSeasons[season.gauntlet_id] = formatedSeasonData;

            fs.writeFileSync(allSeasonsFilePath, JSON.stringify(allSeasons, null, 2), 'utf8');
        }
    }

    // Active season
    const seasonFolder = `${ROOT_FOLDER_PATH}/${allSeasonsData.active_season.gauntlet_id}`;

    // Check if active season folder exist and create it if not
    if (!fs.existsSync(seasonFolder)) fs.mkdirSync(seasonFolder);

    const currentLeaderboardFilePath = `${seasonFolder}/current-leaderboard.json`;

    // Get season data and restart scrap if endpoint is down
    const seasonData = await getSeasonData(allSeasonsData.active_season.gauntlet_id);
    if (!seasonData) {
        setTimeout(scrap, 1000 * 30);
        return;
    }

    const date = new Date(seasonData.last_updated);
    const fileName = getFileNameFromDate(date);

    // Format data
    const formatedSeasonData: SEASON_DETAIL = {
        startAt: allSeasonsData.active_season.start_at,
        endAt: seasonData.end_at,
        lastUpdated: seasonData.last_updated,
        leaderboard: seasonData.leaderboard.map(i => {
            return {
                guildName: i.guild_name,
                guildNameplate: i.guild_nameplate,
                level: i.level,
                remainingSec: i.remaining_sec,
            }
        })
    };

    // Add position direction if last file exist
    const lastFileName = getFileNameFromDate(new Date(date.getTime() - 1000 * 60 * 10));
    const lastFileNamePath = `${seasonFolder}/raw/${lastFileName}.json`;

    if (fs.existsSync(lastFileNamePath)) {
        const lastLeaderboard: Array<LEADERBOARD_ITEM> = (JSON.parse(fs.readFileSync(lastFileNamePath, 'utf8')) as SEASON_DETAIL).leaderboard;

        formatedSeasonData.leaderboard.forEach((leaderboardItem, index) => {
            const lastIndex = lastLeaderboard.findIndex(i => i.guildNameplate === leaderboardItem.guildNameplate);

            if (lastIndex === -1) return;
            if (lastIndex < index) {
                leaderboardItem.positionDirection = LEADERBOARD_POSITION_DIRECTION.GEARTER;
            }
            if (lastIndex > index) {
                leaderboardItem.positionDirection = LEADERBOARD_POSITION_DIRECTION.LOWER;
            }
        });
    }


    fs.writeFileSync(currentLeaderboardFilePath, JSON.stringify(formatedSeasonData, null, 2), 'utf8');

    // Create or update the "all-seasons" file
    const allSeasonsFilePath = `${ROOT_FOLDER_PATH}/all-seasons.json`;
    let allSeasons: { [key in string]: SEASON_DETAIL } = {};
    if (fs.existsSync(allSeasonsFilePath)) {
        allSeasons = JSON.parse(fs.readFileSync(allSeasonsFilePath, 'utf8'));
    }
    allSeasons[allSeasonsData.active_season.gauntlet_id] = formatedSeasonData;

    fs.writeFileSync(allSeasonsFilePath, JSON.stringify(allSeasons, null, 2), 'utf8');

    // Add the current raw leaderboard to raw folder
    // Check if raw folder exist and create it if not
    const seasonRawFolder = `${seasonFolder}/raw`;
    if (!fs.existsSync(seasonRawFolder)) fs.mkdirSync(seasonRawFolder);

    const lastUpdateFilePath = `${seasonRawFolder}/${fileName}.json`;
    fs.writeFileSync(lastUpdateFilePath, JSON.stringify(formatedSeasonData, null, 2), 'utf8');

    // Create or update the "all-raw" file
    const allRawFilePath = `${seasonFolder}/all-raw.json`;
    let allRaw: { [key in string]: SEASON_DETAIL } = {};
    if (fs.existsSync(allRawFilePath)) {
        allRaw = JSON.parse(fs.readFileSync(allRawFilePath, 'utf8'));
    }
    allRaw[fileName] = formatedSeasonData;

    fs.writeFileSync(allRawFilePath, JSON.stringify(allRaw, null, 2), 'utf8');
}

// Return the all seasons data
async function getAllSeasonsData(): Promise<DAUNTLESS_ALL_SEASONS | null> {
    try {
        const res = await fetch(`${ALL_SEASON_URL}?_=${new Date()}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
    return null;
}

// Return specific season data
async function getSeasonData(gauntlet_id: string): Promise<DAUNTLESS_SEASON_DETAIL | null> {
    try {
        const res = await fetch(`${SEASON_URL}/production-${gauntlet_id}.json?_=${new Date()}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
    return null;
}

// Return raw file name
function getFileNameFromDate(date: Date): string {
    return [
        date.getUTCFullYear(),
        '-',
        String(date.getUTCMonth() + 1).padStart(2, '0'),
        '-',
        String(date.getUTCDate()).padStart(2, '0'),
        '--',
        String(date.getUTCHours()).padStart(2, '0'),
        '-',
        String(date.getUTCMinutes()).padStart(2, '0')
    ].join('')
}