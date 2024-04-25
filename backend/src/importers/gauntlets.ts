import { DAUNTLESS_ALL_SEASONS, DAUNTLESS_SEASON, SEASON_LEADERBOARD_ITEM, GAUNTLET_SEASON, GUILD } from '../types/types';
import { getSeasonNumberFromSeasonId, getTimestampFromDate } from '../utils/utils';
import db from '../database/db';

export async function startGauntletsImport() {
    await importGauntlets();
    setInterval(importGauntlets, 1000 * 60 * 3);
}

async function importGauntlets() {
    console.log('Start gauntlet import at ' + new Date().toUTCString());

    const dauntlessAllSeasons = await fetchAllSeasons();
    if (!dauntlessAllSeasons) return;

    for (const dauntlessAllSeasonDetail of [...dauntlessAllSeasons.past_seasons, dauntlessAllSeasons.active_season]) {
        try {
            const values: string[] = [];

            let [season] = await db.select<GAUNTLET_SEASON[]>(`SELECT * FROM gauntlet_seasons WHERE season = ${getSeasonNumberFromSeasonId(dauntlessAllSeasonDetail.gauntlet_id)}`);
            if (!season.length) {
                await db.insert(`INSERT INTO gauntlet_seasons (season, start_at, end_at) VALUES (${getSeasonNumberFromSeasonId(dauntlessAllSeasonDetail.gauntlet_id)}, FROM_UNIXTIME(${getTimestampFromDate(dauntlessAllSeasonDetail.start_at)}), FROM_UNIXTIME(${getTimestampFromDate(dauntlessAllSeasonDetail.end_at)}))`);
                [season] = await db.select<GAUNTLET_SEASON[]>(`SELECT * FROM gauntlet_seasons WHERE season = ${getSeasonNumberFromSeasonId(dauntlessAllSeasonDetail.gauntlet_id)}`);
            }

            const dauntlessSeason = await fetchSeasonData(dauntlessAllSeasonDetail.gauntlet_id);
            if (!dauntlessSeason) return;

            let [leaderboardItem] = await db.select<SEASON_LEADERBOARD_ITEM[]>(`SELECT * FROM gauntlet_leaderboard_items WHERE gauntlet_season = ${season[0].season} AND last_updated = FROM_UNIXTIME(${getTimestampFromDate(dauntlessSeason.last_updated)})`);
            if (leaderboardItem[0]) continue;

            console.log(`Creating new gauntlet_leaderboard_items row for season ${season[0].season} at ${dauntlessSeason.last_updated}`);

            await db.insert(`INSERT INTO gauntlet_leaderboard_items (last_updated, gauntlet_season) VALUES (FROM_UNIXTIME(${getTimestampFromDate(dauntlessSeason.last_updated)}), ${season[0].season})`);
            [leaderboardItem] = await db.select<SEASON_LEADERBOARD_ITEM[]>(`SELECT * FROM gauntlet_leaderboard_items WHERE gauntlet_season = ${season[0].season} AND last_updated = FROM_UNIXTIME(${getTimestampFromDate(dauntlessSeason.last_updated)})`);

            let rank = 1;
            for (const dauntlessLeaderboardItem of dauntlessSeason.leaderboard) {
                let [guild] = await db.select<GUILD[]>(`SELECT * FROM guilds WHERE tag = '${dauntlessLeaderboardItem.guild_nameplate}'`);
                if (!guild.length) {
                    await db.insert(`INSERT INTO guilds (name, tag) VALUES ('${dauntlessLeaderboardItem.guild_name}', '${dauntlessLeaderboardItem.guild_nameplate}')`);
                    [guild] = await db.select<GUILD[]>(`SELECT * FROM guilds WHERE tag = '${dauntlessLeaderboardItem.guild_nameplate}'`);
                }
                values.push(`(${leaderboardItem[0].id}, ${guild[0].id}, ${dauntlessLeaderboardItem.level}, ${dauntlessLeaderboardItem.remaining_sec}, ${rank})`);
                rank++;
            }

            await db.insert(`INSERT INTO gauntlet_leaderboard_items_guilds (gauntlet_leaderboard_item_id, guild_id, level, remaining_sec, \`rank\`) VALUES ${values.join(', ')}`);
        } catch (error) {
            console.error(error);
        }
    }

    console.log('End of gauntlet import at ' + new Date().toUTCString());
}

async function fetchAllSeasons(): Promise<DAUNTLESS_ALL_SEASONS | null> {
    try {
        const res = await fetch(`https://storage.googleapis.com/dauntless-gauntlet-leaderboard/production-gauntlet-all-seasons.json?_=${new Date()}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
    return null;
}

async function fetchSeasonData(gauntlet_id: string): Promise<DAUNTLESS_SEASON | null> {
    try {
        const res = await fetch(`https://storage.googleapis.com/dauntless-gauntlet-leaderboard/production-${gauntlet_id}.json?_=${new Date()}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
    return null;
}