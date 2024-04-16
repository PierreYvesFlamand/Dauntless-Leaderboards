import fs from 'fs';
import path from 'path';

// https://www.epicgames.com/id/api/redirect?clientId=ec684b8c687f479fadea3cb2ad83f5c6&responseType=code
const BASE_AUTHORIZATION_CODE = '0a5edb08b2a247da94bbb2ac885c1e1f';
let REFRESH_TOKEN = '';
let SESSION_TOKEN = '';
const ROOT_FOLDER_PATH = path.resolve('../../../server/public/data/trials');

(async () => {
    REFRESH_TOKEN = await initRefreshToken(BASE_AUTHORIZATION_CODE);
    await refreshSessionToken();

    for (let i = 1; i < getCurrentWeek(); i++) {
        await scrap(i);
    }
})();

async function scrap(week) {
    if (!fs.existsSync(ROOT_FOLDER_PATH)) fs.mkdirSync(ROOT_FOLDER_PATH);

    const data = await fetchTrialLeaderboard(week);
    if (!data?.payload.world) {
        await refreshSessionToken();
        scrap(week);
        return;
    }

    const allSlayersFilePath = `${ROOT_FOLDER_PATH}/all-slayers.json`;
    if (!fs.existsSync(allSlayersFilePath)) {
        fs.writeFileSync(allSlayersFilePath, JSON.stringify({}), 'utf8');
    }

    const allTrialsFilePath = `${ROOT_FOLDER_PATH}/all-trials.json`;
    if (!fs.existsSync(allTrialsFilePath)) {
        fs.writeFileSync(allTrialsFilePath, JSON.stringify({}), 'utf8');
    }

    const ALL_SLAYERS = JSON.parse(fs.readFileSync(allSlayersFilePath, 'utf8'));
    const formatedWeekData = {
        group: data.payload.world.group.entries.reduce((groups, group) => {
            groups.push({
                completionTime: group.completion_time,
                objectivesCompleted: group.objectives_completed,
                entries: group.entries.reduce((group, player) => {

                    // SLAYER NAMES //
                    if (!ALL_SLAYERS[player.phx_account_id]) ALL_SLAYERS[player.phx_account_id] = [];
                    if (!ALL_SLAYERS[player.phx_account_id].find((i) => i.platform === player.platform && i.platformName === player.platform_name)) {
                        ALL_SLAYERS[player.phx_account_id].push({
                            platform: player.platform,
                            platformName: player.platform_name
                        });
                    }
                    // SLAYER NAMES //

                    group.push({
                        phxAccountId: player.phx_account_id,
                        platform: player.platform,
                        weapon: player.weapon,
                        playerRoleId: player.player_role_id
                    });
                    return group;
                }, [])
            });
            return groups;
        }, []),
        solo: WEAPONS.reduce((solo, weapon) => {
            solo[weapon] = data.payload.world.solo[weapon].entries.reduce((entries, player) => {

                // SLAYER NAMES //
                if (!ALL_SLAYERS[player.phx_account_id]) ALL_SLAYERS[player.phx_account_id] = [];
                if (!ALL_SLAYERS[player.phx_account_id].find((i) => i.platform === player.platform && i.platformName === player.platform_name)) {
                    ALL_SLAYERS[player.phx_account_id].push({
                        platform: player.platform,
                        platformName: player.platform_name
                    });
                }
                // SLAYER NAMES //

                entries.push({
                    completionTime: player.completion_time,
                    objectivesCompleted: player.objectives_completed,
                    phxAccountId: player.phx_account_id,
                    platform: player.platform,
                    weapon: player.weapon,
                    playerRoleId: player.player_role_id,
                });
                return entries
            }, [])
            return solo;
        }, {})
    }

    const currentWeekFolder = `${ROOT_FOLDER_PATH}/week_${String(week).padStart(4, '0')}`;
    if (!fs.existsSync(currentWeekFolder)) fs.mkdirSync(currentWeekFolder);
    const currentWeekFinalLeaderboardFilename = `${ROOT_FOLDER_PATH}/week_${String(week).padStart(4, '0')}/current-leaderboard.json`;

    fs.writeFileSync(currentWeekFinalLeaderboardFilename, JSON.stringify(formatedWeekData), 'utf8');
    fs.writeFileSync(allSlayersFilePath, JSON.stringify(ALL_SLAYERS), 'utf8');

    const ALL_TRIALS = JSON.parse(fs.readFileSync(allTrialsFilePath, 'utf8'));
    ALL_TRIALS[`week_${String(week).padStart(4, '0')}`] = formatedWeekData;
    fs.writeFileSync(allTrialsFilePath, JSON.stringify(ALL_TRIALS), 'utf8');

    console.log('Finish week fetch at ' + new Date() + '\n');
}

async function initRefreshToken(authorization_code) {
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

    console.log("✅ fr_access_token");

    const exchange_code = (await (
        await fetch('https://account-public-service-prod.ol.epicgames.com/account/api/oauth/exchange',
            {
                headers: {
                    'Authorization': 'Bearer ' + fr_access_token
                }
            }
        )
    ).json()).code;

    console.log("✅ exchange_code");

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

    console.log("✅ refresh_token");

    return refresh_token;
}

async function refreshSessionToken() {
    console.log('Start refreshSessionToken at ' + new Date() + '\n');

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

    console.log('Finish refreshSessionToken at ' + new Date() + '\n');
}

async function fetchTrialLeaderboard(week) {
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
        return data;
    } catch (error) {
        console.log(error);
    }
    return null;
}