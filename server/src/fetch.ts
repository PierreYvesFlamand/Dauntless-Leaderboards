import fs from 'fs';
import config from '../config';
import { ALL_SLAYERS, ALL_TRIALS, DAUNTLESS_ALL_SEASONS, DAUNTLESS_SEASON, DAUNTLESS_SEASON_DETAIL, DAUNTLESS_TRIAL_DETAIL, SEASON_DETAIL, TRIAL_DETAIL, TRIAL_DETAIL_GROUP_DETAIL, TRIAL_DETAIL_GROUP_DETAIL_ENTRY, TRIAL_DETAIL_SOLO_DETAIL_ENTRY } from './types';

let REFRESH_TOKEN = '';
let SESSION_TOKEN = '';

(async () => {
    await initRefreshToken(config.AUTHORIZATION_CODE);
    await refreshSessionToken();

    await scrapGauntlets();
    // Dauntless website is updated every 10 minutes but we try every 3 minutes to be sure to get the update
    setInterval(scrapGauntlets, 1000 * 60 * 3);

    // Of course this need to be more separated to multiple cmds
    switch (process.argv[2]) {
        case undefined:
            setInterval(refreshSessionToken, 1000 * 60 * 60);
            await scrapTrials(getCurrentWeek());
            setInterval(scrapTrials, 1000 * 60 * 10);
            break;

        case 'last':
            await scrapTrials(getCurrentWeek() - 1);
            console.log('✅ Fetching last week done');
            break;

        case 'all':
            if (fs.existsSync('../database/raw/trials')) fs.rmSync('../database/raw/trials', { recursive: true, force: true });
            if (fs.existsSync('../database/exposed/all-trials.json')) fs.rmSync('../database/exposed/all-trials.json');
            if (fs.existsSync('../database/exposed/all-slayers.json')) fs.rmSync('../database/exposed/all-slayers.json');
            for (let week = 1; week < getCurrentWeek(); week++) {
                await scrapTrials(week);
                console.log('✅ Week ' + week);
            }
            break;

        // Light mode is a hack for now has my server get his RAM killed because of massive file read/write
        case 'light':
            await scrapTrials(getCurrentWeek(), true);
            setInterval(() => { scrapTrials(getCurrentWeek(), true) }, 1000 * 60 * 3);
            setInterval(refreshSessionToken, 1000 * 60 * 60);
            break;

        default:
            console.error('❌ Wrong command arg');
            break;
    }
})();

async function scrapTrials(week: number, isLight: boolean = false) {
    console.log("Scrap trials");

    const rawTrialsFolderPath = '../database/raw/trials';
    if (!fs.existsSync(rawTrialsFolderPath)) fs.mkdirSync(rawTrialsFolderPath);

    const data = await fetchTrialLeaderboard(week);
    if (!data?.payload?.world) {
        await refreshSessionToken();
        scrapTrials(week);
        return;
    }

    let ALL_SLAYERS: ALL_SLAYERS = {};
    const allSlayersFilePath = `../database/exposed/all-slayers.json`;
    const allTrialsFilePath = `../database/exposed/all-trials.json`;
    if (!isLight) {
        if (!fs.existsSync(allSlayersFilePath)) {
            fs.writeFileSync(allSlayersFilePath, JSON.stringify({}), 'utf8');
        }

        if (!fs.existsSync(allTrialsFilePath)) {
            fs.writeFileSync(allTrialsFilePath, JSON.stringify({}), 'utf8');
        }

        ALL_SLAYERS = JSON.parse(fs.readFileSync(allSlayersFilePath, 'utf8'));
    }

    const formatedWeekData: TRIAL_DETAIL = {
        lastUpdated: new Date(),
        group: data.payload.world.group.entries.reduce<Array<TRIAL_DETAIL_GROUP_DETAIL>>((groups, group) => {
            groups.push({
                completionTime: group.completion_time,
                objectivesCompleted: group.objectives_completed,
                entries: group.entries.reduce<Array<TRIAL_DETAIL_GROUP_DETAIL_ENTRY>>((group, player) => {

                    if (!isLight) {
                        // SLAYER NAMES //
                        if (!ALL_SLAYERS[player.phx_account_id]) ALL_SLAYERS[player.phx_account_id] = [];
                        if (!ALL_SLAYERS[player.phx_account_id].find((i) => i.platform === player.platform && i.platformName === player.platform_name)) {
                            ALL_SLAYERS[player.phx_account_id].push({
                                platform: player.platform,
                                platformName: player.platform_name
                            });
                        }
                        // SLAYER NAMES //
                    }

                    group.push({
                        phxAccountId: player.phx_account_id,
                        playerName: player.platform_name,
                        platform: player.platform,
                        weapon: player.weapon,
                        playerRoleId: player.player_role_id
                    });
                    return group;
                }, [])
            });
            return groups;
        }, []),
        solo: ['all', 'sword', 'axe', 'hammer', 'chainblades', 'pike', 'repeaters', 'strikers'].reduce<{ [key: string]: Array<TRIAL_DETAIL_SOLO_DETAIL_ENTRY> }>((solo, weapon) => {
            solo[weapon] = data.payload.world.solo[weapon].entries.reduce<Array<TRIAL_DETAIL_SOLO_DETAIL_ENTRY>>((entries, player) => {

                if (!isLight) {
                    // SLAYER NAMES //
                    if (!ALL_SLAYERS[player.phx_account_id]) ALL_SLAYERS[player.phx_account_id] = [];
                    if (!ALL_SLAYERS[player.phx_account_id].find((i) => i.platform === player.platform && i.platformName === player.platform_name)) {
                        ALL_SLAYERS[player.phx_account_id].push({
                            platform: player.platform,
                            platformName: player.platform_name
                        });
                    }
                    // SLAYER NAMES //
                }

                entries.push({
                    completionTime: player.completion_time,
                    objectivesCompleted: player.objectives_completed,
                    phxAccountId: player.phx_account_id,
                    playerName: player.platform_name,
                    platform: player.platform,
                    weapon: player.weapon,
                    playerRoleId: player.player_role_id,
                });
                return entries
            }, [])
            return solo;
        }, {})
    }

    if (!isLight) {
        const currentWeeksFolder = `${rawTrialsFolderPath}/weeks`;
        if (!fs.existsSync(currentWeeksFolder)) fs.mkdirSync(currentWeeksFolder);

        const currentWeekFolder = `${currentWeeksFolder}/week_${String(week).padStart(4, '0')}`;
        if (!fs.existsSync(currentWeekFolder)) fs.mkdirSync(currentWeekFolder);

        const currentWeekFinalLeaderboardFilename = `${currentWeekFolder}/final-leaderboard.json`;
        fs.writeFileSync(currentWeekFinalLeaderboardFilename, JSON.stringify(formatedWeekData), 'utf8');
    }

    if (week === getCurrentWeek()) {
        fs.writeFileSync('../database/exposed/current-trial.json', JSON.stringify(formatedWeekData), 'utf8');
    }

    if (!isLight) {
        const ALL_TRIALS: ALL_TRIALS = JSON.parse(fs.readFileSync(allTrialsFilePath, 'utf8'));
        ALL_TRIALS[`week_${String(week).padStart(4, '0')}`] = formatedWeekData;
        fs.writeFileSync(allTrialsFilePath, JSON.stringify(ALL_TRIALS), 'utf8');

        fs.writeFileSync(allSlayersFilePath, JSON.stringify(ALL_SLAYERS), 'utf8');
    }
}

function getCurrentWeek(): number {
    const week1StartDate = new Date(Date.UTC(2019, 7 - 1, 18, 17));
    const weekInMs = 1 * 7 * 24 * 60 * 60 * 1000;
    return Math.floor((new Date().getTime() - week1StartDate.getTime()) / weekInMs) + 1
}

async function initRefreshToken(authorization_code: string) {
    const fr_access_token = (await (
        await fetch('https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ='
                },
                method: 'POST',
                body: ['grant_type=authorization_code', `code=${authorization_code}`].join('&')
            }
        )
    ).json()).access_token;

    console.log('✅ fr_access_token');

    const exchange_code = (await (
        await fetch('https://account-public-service-prod.ol.epicgames.com/account/api/oauth/exchange',
            {
                headers: {
                    'Authorization': 'Bearer ' + fr_access_token
                }
            }
        )
    ).json()).code;

    console.log('✅ exchange_code');

    const refresh_token = (await (
        await fetch('https://api.epicgames.dev/epic/oauth/v2/token',
            {
                headers: {
                    'Accept-Encoding': 'deflate, gzip',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'Authorization': 'Basic MTJjNDI3OTg2MmFiNDQ2MGEyNWMyZTlmYTUzNWZiN2U6eEZEZnN5QkhXdllXWXZGWkxodXlqamhGNFVEUEZUNms=',
                    'X-Epic-Correlation-ID': 'EOS-7Xy9sxln5k6-kd-09Q8ouQ-GmEbSTmd6UmlCwuKAdQF_w',
                    'User-Agent': 'EOS-SDK/1.16.0-25515828 (Windows/10.0.22621.2506.64bit) Dauntless/1.0.0',
                    'X-EOS-Version': '1.16.0-25515828'
                },
                method: 'POST',
                body: ['grant_type=exchange_code', `exchange_code=${exchange_code}`].join('&')
            }
        )
    ).json()).refresh_token;

    console.log('✅ refresh_token');
    REFRESH_TOKEN = refresh_token;
}

async function refreshSessionToken() {
    let access_token = undefined;

    try {
        const res = await fetch('https://api.epicgames.dev/epic/oauth/v2/token',
            {
                headers: {
                    'Accept-Encoding': 'deflate, gzip',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'Authorization': 'Basic MTJjNDI3OTg2MmFiNDQ2MGEyNWMyZTlmYTUzNWZiN2U6eEZEZnN5QkhXdllXWXZGWkxodXlqamhGNFVEUEZUNms=',
                    'X-Epic-Correlation-ID': 'EOS-7Xy9sxln5k6-kd-09Q8ouQ-GmEbSTmd6UmlCwuKAdQF_w',
                    'User-Agent': 'EOS-SDK/1.16.0-25515828 (Windows/10.0.22621.2506.64bit) Dauntless/1.0.0',
                    'X-EOS-Version': '1.16.0-25515828'
                },
                method: 'POST',
                body: ['grant_type=refresh_token', `refresh_token=${REFRESH_TOKEN}`].join('&')
            }
        );
        const data = await res.json();

        access_token = data.access_token;
        REFRESH_TOKEN = data.refresh_token;
    } catch (error) {
        console.log(error);
        return;
    }

    try {
        const res = await fetch('https://gamesession-prod.steelyard.ca/gamesession/epiceos',
            {
                headers: {
                    'Accept': '*/*',
                    'Accept-Encoding': 'deflate, gzip',
                    'Authorization': 'BEARER ' + access_token,
                    'Content-Type': 'application/json; charset=utf-8',
                    'X-Archon-Console': '(Windows)',
                    'User-Agent': 'Archon/++dauntless+rel-1.14.6-CL-615145 Windows/10.0.22621.1.768.64bit'
                },
                method: 'PUT'
            }
        );
        const data = await res.json();

        SESSION_TOKEN = data.payload.sessiontoken;
    } catch (error) {
        console.log(error);
        return;
    }
}

async function fetchTrialLeaderboard(week: number): Promise<DAUNTLESS_TRIAL_DETAIL | null> {
    /**
     * Explanation for posterity
     * 
     * trial_id:
     * - 'Arena_MatchmakerHunt_Elite_XXX' for week from 1 to 185
     * - 'Arena_MatchmakerHunt_Elite_New_XXXX' for week from 185 to now (need to remove 185 from the week as it restart at 1)
     * 
     * endpoint:
     * - Have to fetch on '/solo' for week before 91 as it was before weapon specific weapon (Dauntless 1.6.0)
     * 
     * Huge thank to superevilteam that figured out and share how to get fetch the trial
     * I (polfy) found the last part where you have to use '/solo' for week before 91
     */

    const isNew = week > 185;
    if (isNew) week -= 185;

    try {
        const res = await fetch('https://leaderboards-prod.steelyard.ca/trials/leaderboards/all',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'BEARER ' + SESSION_TOKEN
                },
                method: 'POST',
                body: JSON.stringify({
                    'difficulty': 1,
                    'page': 0,
                    'page_size': 100,
                    'trial_id': `Arena_MatchmakerHunt_Elite${isNew ? '_New' : ''}_${String(week).padStart(isNew ? 4 : 3, '0')}`,
                    'target_platforms': []
                })
            }
        );
        const data = await res.json();

        if (!isNew && week <= 90) {
            const res = await fetch('https://leaderboards-prod.steelyard.ca/trials/leaderboards/solo',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'BEARER ' + SESSION_TOKEN
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        'difficulty': 1,
                        'page': 0,
                        'page_size': 100,
                        'trial_id': `Arena_MatchmakerHunt_Elite${isNew ? '_New' : ''}_${String(week).padStart(isNew ? 4 : 3, '0')}`,
                        'target_platforms': []
                    })
                }
            );
            data.payload.world.solo = {
                'all': { entries: (await res.json()).payload.entries },
                'axe': { entries: [] },
                'chainblades': { entries: [] },
                'hammer': { entries: [] },
                'pike': { entries: [] },
                'repeaters': { entries: [] },
                'strikers': { entries: [] },
                'sword': { entries: [] },
            }
        }

        return data;
    } catch (error) {
        console.log(error);
    }
    return null;
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

async function scrapGauntlets(): Promise<void> {
    console.log("Scrap gauntlets");
    // Check if main folder exist and create it if not
    const rawGauntletsFolderPath = '../database/raw/gauntlets'
    if (!fs.existsSync(rawGauntletsFolderPath)) fs.mkdirSync(rawGauntletsFolderPath);

    // Get season data and restart scrap if endpoint is down
    const allSeasonsData = await getAllSeasonsData();
    if (!allSeasonsData) {
        console.error('❌ Error on all seasons fetch');
        setTimeout(scrapGauntlets, 1000 * 30);
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
                setTimeout(scrapGauntlets, 1000 * 30);
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
        setTimeout(scrapGauntlets, 1000 * 30);
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

    // Disable for know because of huge file loading in RAM
    // Will create a simple fix to create the with a command manualy
    // // Create or update the "all-raw" file
    // const allRawFilePath = `../database/exposed/season-${getSeasonNumberFromSeasonId(allSeasonsData.active_season.gauntlet_id)}-all-raw.json`;
    // let allRaw: { [key: string]: SEASON_DETAIL } = {};
    // if (fs.existsSync(allRawFilePath)) {
    //     allRaw = JSON.parse(fs.readFileSync(allRawFilePath, 'utf8'));
    // }
    // allRaw[fileName] = formatedSeasonData;

    // fs.writeFileSync(allRawFilePath, JSON.stringify(allRaw), 'utf8');
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