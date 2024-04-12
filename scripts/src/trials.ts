import fs from 'fs';
import path from 'path';
import { ALL_SLAYERS, DAUNTLESS_TRIAL_DETAIL, TRIAL_DETAIL, TRIAL_DETAIL_GROUP_DETAIL, TRIAL_DETAIL_GROUP_DETAIL_ENTRY, TRIAL_DETAIL_SOLO_DETAIL_ENTRY } from './types';

// https://www.epicgames.com/id/api/redirect?clientId=ec684b8c687f479fadea3cb2ad83f5c6&responseType=code
const BASE_AUTHORIZATION_CODE = '932ceee1c878450ab224e0d2c6f50387';
let REFRESH_TOKEN = '';
let SESSION_TOKEN = '';
const ROOT_FOLDER_PATH = path.resolve('../server/public/data/trials');

const WEAPONS = ['all', 'axe', 'chainblades', 'hammer', 'pike', 'repeaters', 'strikers', 'sword'];

export enum BEHEMOTH {
    'Shrike',
    'Thunderdeep_Drask',
    'Blaze_Quillshot',
    'Shadowtouched_Koshai',
    'Skarn',
    'Koshai',
    'Shrowd',
    'Gnasher',
    'Skraev',
    'Charrogg',
    'Phaelanx',
    'Stormclaw',
    'Malkarion',
    'Rezakiri',
    'Riftstalker',
    'Drask',
    'Embermane',
    'Shadowtouched_Nayzaga',
    'Quillshot',
    'Pangar',
    'Kharabak',
    'Shadowtouched_Drask',
    'Nayzaga',
    'Boreus',
    'Bloodshot_Shrowd',
}

export const behemoth = [
    'Shrike',
    'Thunderdeep Drask',
    'Blaze Quillshot',
    'Shadowtouched Koshai',
    'Skarn',
    'Koshai',
    'Shrowd',
    'Gnasher',
    'Skraev',
    'Charrogg',
    'Phaelanx',
    'Stormclaw',
    'Malkarion',
    'Rezakiri',
    'Riftstalker',
    'Drask',
    'Embermane',
    'Shadowtouched Nayzaga',
    'Quillshot',
    'Pangar',
    'Kharabak',
    'Shadowtouched Drask',
    'Nayzaga',
    'Boreus',
    'Bloodshot Shrowd',
]

export const oldRatationHistory = [
    BEHEMOTH.Nayzaga,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Embermane,
    BEHEMOTH.Skraev,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Koshai,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Shrike,
    BEHEMOTH.Skarn,
    BEHEMOTH.Pangar,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Nayzaga,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Embermane,
    BEHEMOTH.Skraev,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Koshai,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Shrike,
    BEHEMOTH.Skarn,
    BEHEMOTH.Pangar,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Nayzaga,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Embermane,
    BEHEMOTH.Skraev,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Koshai,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Shrike,
    BEHEMOTH.Skarn,
    BEHEMOTH.Pangar,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Nayzaga,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Boreus,
    BEHEMOTH.Drask,
    BEHEMOTH.Embermane,
    BEHEMOTH.Skraev,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Koshai,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Boreus,
    BEHEMOTH.Shrike,
    BEHEMOTH.Skarn,
    BEHEMOTH.Shadowtouched_Koshai,
    BEHEMOTH.Drask,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Shadowtouched_Nayzaga,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Shadowtouched_Drask,
    BEHEMOTH.Embermane,
    BEHEMOTH.Skraev,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Koshai,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Boreus,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Shrike,
    BEHEMOTH.Skarn,
    BEHEMOTH.Pangar,
    BEHEMOTH.Drask,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Shadowtouched_Nayzaga,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Skraev,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Koshai,
    BEHEMOTH.Shadowtouched_Drask,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Shadowtouched_Koshai,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Embermane,
    BEHEMOTH.Skraev,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Koshai,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Boreus,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Shrike,
    BEHEMOTH.Skarn,
    BEHEMOTH.Pangar,
    BEHEMOTH.Drask,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Shadowtouched_Nayzaga,
    BEHEMOTH.Koshai,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Shadowtouched_Drask,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Shadowtouched_Koshai,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Embermane,
    BEHEMOTH.Skraev,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Boreus,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Shrike,
    BEHEMOTH.Skarn,
    BEHEMOTH.Pangar,
    BEHEMOTH.Drask,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Embermane,
    BEHEMOTH.Shrike,
    BEHEMOTH.Shadowtouched_Nayzaga,
    BEHEMOTH.Koshai,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Skraev,
    BEHEMOTH.Pangar,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Shadowtouched_Drask,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Drask,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Shadowtouched_Koshai,
    BEHEMOTH.Skarn,
    BEHEMOTH.Boreus,
    BEHEMOTH.Koshai,
    BEHEMOTH.Shrike,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Skraev,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Embermane,
    BEHEMOTH.Shadowtouched_Nayzaga,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Pangar,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Shadowtouched_Drask,
    BEHEMOTH.Shrike,
    BEHEMOTH.Drask,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Shadowtouched_Koshai,
    BEHEMOTH.Skarn,
    BEHEMOTH.Koshai,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Skraev,
    BEHEMOTH.Phaelanx,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Embermane,
    BEHEMOTH.Shadowtouched_Nayzaga,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Pangar,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Shadowtouched_Drask,
    BEHEMOTH.Shrike,
    BEHEMOTH.Thunderdeep_Drask,
    BEHEMOTH.Blaze_Quillshot,
    BEHEMOTH.Shadowtouched_Koshai,
    BEHEMOTH.Skarn,
    BEHEMOTH.Koshai,
    BEHEMOTH.Bloodshot_Shrowd,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Skraev,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Phaelanx,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Embermane,
    BEHEMOTH.Shadowtouched_Nayzaga,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Pangar,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Shadowtouched_Drask
];

export const currentBehemothRotation = [
    BEHEMOTH.Shrike,
    BEHEMOTH.Thunderdeep_Drask,
    BEHEMOTH.Blaze_Quillshot,
    BEHEMOTH.Shadowtouched_Koshai,
    BEHEMOTH.Skarn,
    BEHEMOTH.Koshai,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Skraev,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Phaelanx,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Riftstalker,
    BEHEMOTH.Drask,
    BEHEMOTH.Embermane,
    BEHEMOTH.Shadowtouched_Nayzaga,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Pangar,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Shadowtouched_Drask
];

export function getCurrentWeek(): number {
    const week1StartDate = new Date(Date.UTC(2019, 7 - 1, 18, 17));
    const weekInMs = 1 * 7 * 24 * 60 * 60 * 1000;
    return Math.floor((new Date().getTime() - week1StartDate.getTime()) / weekInMs) + 1
}

export function getWeekStartAndEnd(week: number): Array<Date> {
    const week1StartDate = new Date(Date.UTC(2019, 7 - 1, 18, 17));
    const weekInMs = 1 * 7 * 24 * 60 * 60 * 1000;
    return [
        new Date(week1StartDate.getTime() + weekInMs * (week - 1)),
        new Date(week1StartDate.getTime() + weekInMs * week)
    ];
}

export function getBehemothIdFromWeek(week: number): number {
    if (week < oldRatationHistory.length) return oldRatationHistory[week - 1];
    return currentBehemothRotation[(week - oldRatationHistory.length) % currentBehemothRotation.length - 1];
}

(async () => {
    REFRESH_TOKEN = await initRefreshToken(BASE_AUTHORIZATION_CODE);
    await refreshSessionToken();
    setInterval(refreshSessionToken.bind(this), 1000 * 5);
    // await scrap();
    // setInterval(scrap, 1000 * 60 * 10);
})();

async function scrap() {
    console.log('Start week fetch at ' + new Date() + '\n');
    if (!fs.existsSync(ROOT_FOLDER_PATH)) fs.mkdirSync(ROOT_FOLDER_PATH);

    const week = getCurrentWeek();
    const data = await fetchTrialLeaderboard(week);
    if (!data) {
        console.log('Fetch is NOT OK at ' + new Date() + '\n');
        await refreshSessionToken();
        scrap();
        return;
    }
    console.log('Fetch is OK at ' + new Date() + '\n');
    

    const allSlayersFilePath = `${ROOT_FOLDER_PATH}/all-slayers.json`;

    if (!fs.existsSync(allSlayersFilePath)) {
        fs.writeFileSync(allSlayersFilePath, JSON.stringify({}), 'utf8');
    }

    const ALL_SLAYERS: ALL_SLAYERS = JSON.parse(fs.readFileSync(allSlayersFilePath, 'utf8'));
    const formatedWeekData: TRIAL_DETAIL = {
        group: data.payload.world.group.entries.reduce<Array<TRIAL_DETAIL_GROUP_DETAIL>>((groups, group) => {
            groups.push({
                completionTime: group.completion_time,
                objectivesCompleted: group.objectives_completed,
                entries: group.entries.reduce<Array<TRIAL_DETAIL_GROUP_DETAIL_ENTRY>>((group, player) => {

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
        solo: WEAPONS.reduce<{ [key: string]: Array<TRIAL_DETAIL_SOLO_DETAIL_ENTRY> }>((solo, weapon) => {
            solo[weapon] = data.payload.world.solo[weapon].entries.reduce<Array<TRIAL_DETAIL_SOLO_DETAIL_ENTRY>>((entries, player) => {

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

    console.log('Finish week fetch at ' + new Date() + '\n');
}

async function initRefreshToken(authorization_code: string): Promise<string> {
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

async function fetchTrialLeaderboard(week: number): Promise<DAUNTLESS_TRIAL_DETAIL | null> {
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