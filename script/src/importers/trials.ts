import fs from 'fs';
import config from '../../config';

import { getBehemothNameFromWeek, getCurrentWeek, getWeekEndDate, getWeekStartDate } from '../utils/utils';
import { BEHEMOTH, DAUNTLESS_TRIAL, DAUNTLESS_TRIAL_SOLO_DETAIL, PLATFORM, PLAYER, ROLE, TRIAL, TRIAL_LEADERBOARD, TRIAL_LEADERBOARD_PLAYER, WEAPON } from '../types/types';

let REFRESH_TOKEN = '';
let SESSION_TOKEN = '';

let TRIAL_LEADERBOARDS_ITEM_TYPES = ['all', 'group', 'sword', 'axe', 'hammer', 'chainblades', 'pike', 'repeaters', 'strikers'];

export async function startImportTrials(authorizationCode: string = config.AUTHORIZATION_CODE) {
    await initRefreshToken(authorizationCode);
    await refreshSessionToken();

    console.log('Checking if all older weeks are in the database');
    const existingTrialFilenames = fs.readdirSync('../database/trials');

    for (let i = 1; i < getCurrentWeek(); i++) {
        if (existingTrialFilenames.findIndex(filename => Number(filename.substring(10, 13)) === i) >= 0) continue;
        await importTrials(i);
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    console.log('Starting current week import');
    await importTrials();
}

async function importTrials(week: number = getCurrentWeek()) {
    console.log(`Start trial week ${week} import at ${new Date().toUTCString()}`);

    const dauntlessTrial = await fetchTrialLeaderboard(week);
    if (!dauntlessTrial?.payload?.world) return;

    try {
        // Save Dauntless raw data
        fs.writeFileSync(`../database/dauntlessData/trials/trial-week${String(week).padStart(3, '0')}.json`, JSON.stringify(dauntlessTrial, null, 4));

        const behemoths = JSON.parse(fs.readFileSync('../database/behemoths.json', 'utf8')) as BEHEMOTH[];
        const players = JSON.parse(fs.readFileSync('../database/players.json', 'utf8')) as PLAYER[];
        const platforms = JSON.parse(fs.readFileSync('../database/platforms.json', 'utf8')) as PLATFORM[];
        const roles = JSON.parse(fs.readFileSync('../database/roles.json', 'utf8')) as ROLE[];
        const weapons = JSON.parse(fs.readFileSync('../database/weapons.json', 'utf8')) as WEAPON[];

        const trial: TRIAL = {
            info: {
                week,
                behemothId: behemoths.find(b => b.name === getBehemothNameFromWeek(week))?.id || 0,
                startAt: getWeekStartDate(week),
                endAt: getWeekEndDate(week),
                lastUpdated: new Date()
            },
            all: [],
            group: [],
            hammer: [],
            axe: [],
            sword: [],
            chainblades: [],
            repeaters: [],
            pike: [],
            strikers: []
        }

        // SOLO
        for (const trialLeaderboardsItemType of TRIAL_LEADERBOARDS_ITEM_TYPES.filter(tlit => tlit !== 'group')) {
            for (const dauntlessTrialLeaderboardItem of (<DAUNTLESS_TRIAL_SOLO_DETAIL>(<any>dauntlessTrial.payload.world.solo)[trialLeaderboardsItemType]).entries) {

                let player = players.find(p => p.phxId === dauntlessTrialLeaderboardItem.phx_account_id);
                if (!player) {
                    players.push({
                        id: players.length + 1,
                        phxId: dauntlessTrialLeaderboardItem.phx_account_id,
                        names: []
                    });
                }

                player = players.find(p => p.phxId === dauntlessTrialLeaderboardItem.phx_account_id)!;
                const platform = platforms.find(p => p.name === dauntlessTrialLeaderboardItem.platform) || platforms[0];

                const currentName = player.names.find(n => n.platformId === platform.id);
                if (!currentName) {
                    player.names.push(
                        {
                            platformId: platform.id,
                            name: dauntlessTrialLeaderboardItem.platform_name
                        }
                    );
                } else {
                    if (currentName.name !== dauntlessTrialLeaderboardItem.platform_name) {
                        currentName.name = dauntlessTrialLeaderboardItem.platform_name;
                    }
                }

                ((trial as any)[trialLeaderboardsItemType] as TRIAL_LEADERBOARD[]).push({
                    rank: dauntlessTrialLeaderboardItem.rank,
                    completionTime: dauntlessTrialLeaderboardItem.completion_time,
                    objectivesCompleted: dauntlessTrialLeaderboardItem.objectives_completed,
                    players: [
                        {
                            playerId: player.id,
                            platformId: platform.id,
                            roleId: roles.find(r => r.name === dauntlessTrialLeaderboardItem.player_role_id)?.id || null,
                            weaponId: weapons.find(w => w.id === dauntlessTrialLeaderboardItem.weapon || w.name === dauntlessTrialLeaderboardItem.weapon)!.id
                        }
                    ]
                });
            }
        }

        // GROUP
        for (const dauntlessTrialLeaderboardItem of dauntlessTrial.payload.world.group.entries) {

            const groupPlayers: TRIAL_LEADERBOARD_PLAYER[] = [];
            for (const groupPlayer of dauntlessTrialLeaderboardItem.entries) {
                let player = players.find(p => p.phxId === groupPlayer.phx_account_id);
                if (!player) {
                    players.push({
                        id: players.length + 1,
                        phxId: groupPlayer.phx_account_id,
                        names: []
                    });
                }

                player = players.find(p => p.phxId === groupPlayer.phx_account_id)!;
                const platform = platforms.find(p => p.name === groupPlayer.platform) || platforms[0];

                const currentName = player.names.find(n => n.platformId === platform.id);
                if (!currentName) {
                    player.names.push(
                        {
                            platformId: platform.id,
                            name: groupPlayer.platform_name
                        }
                    );
                } else {
                    if (currentName.name !== groupPlayer.platform_name) {
                        currentName.name = groupPlayer.platform_name;
                    }
                }

                groupPlayers.push({
                    playerId: player.id,
                    platformId: platform.id,
                    roleId: roles.find(r => r.name === groupPlayer.player_role_id)?.id || null,
                    weaponId: weapons.find(w => w.id === groupPlayer.weapon || w.name === groupPlayer.weapon)!.id
                });
            }

            trial.group.push({
                rank: dauntlessTrialLeaderboardItem.rank,
                completionTime: dauntlessTrialLeaderboardItem.completion_time,
                objectivesCompleted: dauntlessTrialLeaderboardItem.objectives_completed,
                players: groupPlayers
            });
        }

        fs.writeFileSync(`../database/players.json`, JSON.stringify(players, null, 4));
        fs.writeFileSync(`../database/trials/trial-week${String(week).padStart(3, '0')}.json`, JSON.stringify(trial, null, 4));

    } catch (error) {
        console.error(error);
    }

    console.log(`End of trial week ${week} import at ${new Date().toUTCString()}`);
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

// 281 is last before dual weapon
async function fetchTrialLeaderboard(week: number): Promise<DAUNTLESS_TRIAL | null> {
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
     * Huge thank to superevilteam that figured out and share how to fetch the trial
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
            const oldData = (await res.json()).payload.entries;

            data.payload.world.solo = {
                all: { entries: oldData },
                hammer: { entries: oldData.filter((e: any) => e.weapon === 1).reduce((arr: any[], e: any, i: number) => { return [...arr, { ...e, rank: i + 1 }] }, []) },
                axe: { entries: oldData.filter((e: any) => e.weapon === 2).reduce((arr: any[], e: any, i: number) => { return [...arr, { ...e, rank: i + 1 }] }, []) },
                sword: { entries: oldData.filter((e: any) => e.weapon === 3).reduce((arr: any[], e: any, i: number) => { return [...arr, { ...e, rank: i + 1 }] }, []) },
                chainblades: { entries: oldData.filter((e: any) => e.weapon === 4).reduce((arr: any[], e: any, i: number) => { return [...arr, { ...e, rank: i + 1 }] }, []) },
                pike: { entries: oldData.filter((e: any) => e.weapon === 5).reduce((arr: any[], e: any, i: number) => { return [...arr, { ...e, rank: i + 1 }] }, []) },
                repeaters: { entries: oldData.filter((e: any) => e.weapon === 6).reduce((arr: any[], e: any, i: number) => { return [...arr, { ...e, rank: i + 1 }] }, []) },
                strikers: { entries: oldData.filter((e: any) => e.weapon === 7).reduce((arr: any[], e: any, i: number) => { return [...arr, { ...e, rank: i + 1 }] }, []) }
            }
        }

        return data;
    } catch (error) {
        console.log(error);
    }
    return null;
}