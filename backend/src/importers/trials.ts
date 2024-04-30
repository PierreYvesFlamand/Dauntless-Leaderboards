import db from "../database/db";
import { BEHEMOTH, DAUNTLESS_TRIAL, DAUNTLESS_TRIAL_SOLO_DETAIL, PLATFORM, PLAYER, PLAYER_NAME, TRIAL_LEADERBOARD_ITEM, TRIAL_LEADERBOARD_ITEM_TYPE, TRIAL_WEEK } from "../types/types";
import { getBehemothNameFromWeek, getCurrentWeek, getTimestampFromDate, getWeekEndDate, getWeekStartDate } from "../utils/utils";

let REFRESH_TOKEN = '';
let SESSION_TOKEN = '';

export async function startTrialsImport(authorizationCode: string) {
    await initRefreshToken(authorizationCode);
    await refreshSessionToken();

    // console.log('Checking if all older weeks are in the database');
    // const [trial_weeks] = await db.select<TRIAL_WEEK[]>(`SELECT * FROM trial_weeks`);
    // for (let i = 1; i < getCurrentWeek(); i++) {
    //     if (trial_weeks.find(tw => tw.week === i)) continue;
    //     await importTrials(i);
    // }

    console.log('Starting current week import');
    await importTrials();
    setInterval(importTrials, 1000 * 60 * 10);
}

async function importTrials(week: number = getCurrentWeek()) {
    console.log(`Start trial week ${week} import at ${new Date().toUTCString()}`);

    const dauntlessTrial = await fetchTrialLeaderboard(week);
    if (!dauntlessTrial?.payload?.world) return;

    try {
        const [platforms] = await db.select<PLATFORM[]>(`SELECT * FROM platforms`);
        const [trialLeaderboardsItemTypes] = await db.select<TRIAL_LEADERBOARD_ITEM_TYPE[]>(`SELECT * FROM trial_leaderboard_item_type`);

        const behemothName = getBehemothNameFromWeek(week);
        let [behemoth] = await db.select<BEHEMOTH[]>(`SELECT * FROM behemoths WHERE name = ?`, [behemothName]);
        if (!behemoth.length) {
            await db.select(`
                INSERT INTO behemoths (name)
                VALUES (?)
            `, [
                behemothName
            ]);
            [behemoth] = await db.select<BEHEMOTH[]>(`SELECT * FROM behemoths WHERE name = ?`, [behemothName]);
        }

        let [trialWeek] = await db.select<TRIAL_WEEK[]>(`SELECT * FROM trial_weeks WHERE week = ?`, [week]);
        if (!trialWeek.length) {
            await db.select(`
                INSERT INTO trial_weeks (week, start_at, end_at, behemoth_id)
                VALUES (?, FROM_UNIXTIME(?), FROM_UNIXTIME(?), ?)
            `, [
                week,
                getTimestampFromDate(getWeekStartDate(week)),
                getTimestampFromDate(getWeekEndDate(week)),
                behemoth[0].id
            ]);
            [trialWeek] = await db.select<TRIAL_WEEK[]>(`SELECT * FROM trial_weeks WHERE week = ?`, [week]);
        }

        const lastUpdated = new Date();
        await db.insert(`
            INSERT INTO trial_leaderboard_items (last_updated, trial_week)
            VALUES (FROM_UNIXTIME(?), ?)
        `, [
            getTimestampFromDate(lastUpdated),
            week
        ]);
        let [trialLeaderboardItem] = await db.select<TRIAL_LEADERBOARD_ITEM[]>(`
            SELECT * FROM trial_leaderboard_items
            WHERE trial_week = ? AND last_updated = FROM_UNIXTIME(?)
        `, [
            week,
            getTimestampFromDate(lastUpdated)
        ]);

        // SOLO
        const values: (string | number)[] = [];

        for (const trialLeaderboardsItemType of trialLeaderboardsItemTypes.filter(tlit => tlit.type !== 'group')) {
            for (const dauntlessTrialLeaderboardItem of (<DAUNTLESS_TRIAL_SOLO_DETAIL>(<any>dauntlessTrial.payload.world.solo)[trialLeaderboardsItemType.type]).entries) {
                let [player] = await db.select<PLAYER[]>(`SELECT * FROM players WHERE phx_id = ?`, [dauntlessTrialLeaderboardItem.phx_account_id]);
                if (!player.length) {
                    await db.insert(`INSERT INTO players (phx_id) VALUES (?)`, [dauntlessTrialLeaderboardItem.phx_account_id]);
                    [player] = await db.select<PLAYER[]>(`SELECT * FROM players WHERE phx_id = ?`, [dauntlessTrialLeaderboardItem.phx_account_id]);
                }

                const platform = platforms.find(p => p.name === dauntlessTrialLeaderboardItem.platform);
                if (!platform) continue;

                let [playerName] = await db.select<PLAYER_NAME[]>(`
                    SELECT *
                    FROM player_names
                    WHERE player_id = ? AND platform_id = ?
                `, [
                    player[0].id,
                    platform.id
                ]);
                if (!playerName.length) {
                    await db.insert(`
                        INSERT INTO player_names (player_id, platform_id, name)
                        VALUES (?, ?, ?)
                    `, [
                        player[0].id,
                        platform.id,
                        dauntlessTrialLeaderboardItem.platform_name.replace(/'/g, "''")
                    ]);
                }

                const type = trialLeaderboardsItemTypes.find(tlit => tlit.type === trialLeaderboardsItemType.type);
                if (!type) continue;

                if (trialLeaderboardsItemType.type !== 'all') {
                    dauntlessTrialLeaderboardItem.weapon = ['hammer', 'axe', 'sword', 'chainblades', 'pike', 'repeaters', 'strikers'].findIndex(w => w === trialLeaderboardsItemType.type) + 1;
                }

                values.push(trialLeaderboardItem[0].id, type.id, player[0].id, platform.id, dauntlessTrialLeaderboardItem.objectives_completed, dauntlessTrialLeaderboardItem.completion_time, dauntlessTrialLeaderboardItem.weapon, dauntlessTrialLeaderboardItem.player_role_id, dauntlessTrialLeaderboardItem.rank);
            }
        }

        // GROUP
        for (const dauntlessTrialLeaderboardItem of dauntlessTrial.payload.world.group.entries) {
            for (const dauntlessTrialLeaderboardItemEntries of dauntlessTrialLeaderboardItem.entries) {
                let [player] = await db.select<PLAYER[]>(`SELECT * FROM players WHERE phx_id = ?`, [dauntlessTrialLeaderboardItemEntries.phx_account_id]);
                if (!player.length) {
                    await db.insert(`INSERT INTO players (phx_id) VALUES (?)`, [dauntlessTrialLeaderboardItemEntries.phx_account_id]);
                    [player] = await db.select<PLAYER[]>(`SELECT * FROM players WHERE phx_id = ?`, [dauntlessTrialLeaderboardItemEntries.phx_account_id]);
                }

                const platform = platforms.find(p => p.name === dauntlessTrialLeaderboardItemEntries.platform);
                if (!platform) continue;

                let [playerName] = await db.select<PLAYER_NAME[]>(`
                    SELECT *
                    FROM player_names
                    WHERE player_id = ? AND platform_id = ?
                `, [
                    player[0].id,
                    platform.id
                ]);
                if (!playerName.length) {
                    await db.insert(`
                        INSERT INTO player_names (player_id, platform_id, name)
                        VALUES (?, ?, ?)
                    `, [
                        player[0].id,
                        platform.id,
                        dauntlessTrialLeaderboardItemEntries.platform_name.replace(/'/g, "''")
                    ]);
                }

                const type = trialLeaderboardsItemTypes.find(tlit => tlit.type === 'group');
                if (!type) continue;

                values.push(trialLeaderboardItem[0].id, type.id, player[0].id, platform.id, dauntlessTrialLeaderboardItem.objectives_completed, dauntlessTrialLeaderboardItem.completion_time, dauntlessTrialLeaderboardItemEntries.weapon, dauntlessTrialLeaderboardItemEntries.player_role_id, dauntlessTrialLeaderboardItem.rank);
            }
        }

        await db.insert(`
        INSERT INTO trial_leaderboard_items_players (trial_leaderboard_item_id, trial_leaderboard_item_type_id, player_id, platform_id, objectives_completed, completion_time, weapon_id, role_id, \`rank\`)
            VALUES ${'(?,?,?,?,?,?,?,?,?)'.repeat(values.length / 9).split(')(').join('),(')}
        `, values);
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