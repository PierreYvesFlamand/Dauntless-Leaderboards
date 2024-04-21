import fs from 'fs';
import { DAUNTLESS_ALL_SEASONS, DAUNTLESS_SEASON, DAUNTLESS_SEASON_DETAIL, SEASON_DETAIL } from './types';

export async function scrap(): Promise<void> {
    // Check if main folder exist and create it if not
    const rawGauntletsFolderPath = '../database/raw/gauntlets'
    if (!fs.existsSync(rawGauntletsFolderPath)) fs.mkdirSync(rawGauntletsFolderPath);

    // Get season data and restart scrap if endpoint is down
    const allSeasonsData = await getAllSeasonsData();
    if (!allSeasonsData) {
        console.error('❌ Error on all seasons fetch');
        setTimeout(scrap, 1000 * 30);
        return;
    }

    // Loop on all past seasons
    for (const season of allSeasonsData.past_seasons) {
        // Don't work on same or older season than the active one
        if (getSeasonNumberFromSeasonId(season.gauntlet_id) >= getSeasonNumberFromSeasonId(allSeasonsData.active_season.gauntlet_id)) continue;

        const seasonFolderPath = `${rawGauntletsFolderPath}/${season.gauntlet_id}`;

        // Check if season folder exist and create it if not
        if (!fs.existsSync(seasonFolderPath)) fs.mkdirSync(seasonFolderPath);

        const finalLeaderboardFilePath = `${seasonFolderPath}/final-leaderboard.json`;

        // Only create past season final leaderboard if it doesn't exist
        if (!fs.existsSync(finalLeaderboardFilePath)) {
            // Get season data and restart scrap if endpoint is down
            const seasonData = await getSeasonData(season.gauntlet_id);
            if (!seasonData) {
                console.error('❌ Error on season fetch');
                setTimeout(scrap, 1000 * 30);
                return;
            }

            // Format data
            const formatedSeasonData = getFormatedSeasonData(season, seasonData);

            fs.writeFileSync(finalLeaderboardFilePath, JSON.stringify(formatedSeasonData), 'utf8');

            // Create or update the "all-seasons" file
            const allSeasonsFilePath = `../database/exposed/all-seasons.json`;
            let allSeasons: { [key: string]: SEASON_DETAIL } = {};
            if (fs.existsSync(allSeasonsFilePath)) {
                allSeasons = JSON.parse(fs.readFileSync(allSeasonsFilePath, 'utf8'));
            }
            allSeasons[season.gauntlet_id] = formatedSeasonData;

            fs.writeFileSync(allSeasonsFilePath, JSON.stringify(allSeasons), 'utf8');
        }
    }

    // Active season
    const seasonFolder = `${rawGauntletsFolderPath}/${allSeasonsData.active_season.gauntlet_id}`;

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
    const formatedSeasonData = getFormatedSeasonData(allSeasonsData.active_season, seasonData);

    fs.writeFileSync(currentLeaderboardFilePath, JSON.stringify(formatedSeasonData), 'utf8');

    // Create or update the "all-seasons" file
    const allSeasonsFilePath = `../database/exposed/all-seasons.json`;
    let allSeasons: { [key: string]: SEASON_DETAIL } = {};
    if (fs.existsSync(allSeasonsFilePath)) {
        allSeasons = JSON.parse(fs.readFileSync(allSeasonsFilePath, 'utf8'));
    }
    allSeasons[allSeasonsData.active_season.gauntlet_id] = formatedSeasonData;

    fs.writeFileSync(allSeasonsFilePath, JSON.stringify(allSeasons), 'utf8');

    // Add the current raw leaderboard to raw folder
    // Check if raw folder exist and create it if not
    const seasonRawFolder = `${seasonFolder}/raw`;
    if (!fs.existsSync(seasonRawFolder)) fs.mkdirSync(seasonRawFolder);

    const lastUpdateFilePath = `${seasonRawFolder}/${fileName}.json`;
    fs.writeFileSync(lastUpdateFilePath, JSON.stringify(formatedSeasonData), 'utf8');
}

// Return file name based on Date
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

function getFormatedSeasonData(season: DAUNTLESS_SEASON, seasonData: DAUNTLESS_SEASON_DETAIL): SEASON_DETAIL {
    return {
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
}

function getSeasonNumberFromSeasonId(id: string): number {
    return Number(id.slice(15));
}

// Return all seasons data
async function getAllSeasonsData(): Promise<DAUNTLESS_ALL_SEASONS | null> {
    try {
        const res = await fetch(`https://storage.googleapis.com/dauntless-gauntlet-leaderboard/production-gauntlet-all-seasons.json?_=${new Date()}`);
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
        const res = await fetch(`https://storage.googleapis.com/dauntless-gauntlet-leaderboard/production-${gauntlet_id}.json?_=${new Date()}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
    return null;
}