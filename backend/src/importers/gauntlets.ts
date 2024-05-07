import { getSeasonNumberFromSeasonId, getTimestampFromDate } from '../utils/utils';
import db from '../database/db';
import { DAUNTLESS_ALL_SEASONS, DAUNTLESS_SEASON, DB_GAUNTLET_LEADERBOARD_ITEM, DB_GAUNTLET_SEASON, DB_GUILD } from '../types/types';

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
            const values: number[] = [];

            let [season] = await db.select<DB_GAUNTLET_SEASON[]>(`
                SELECT *
                FROM gauntlet_seasons gs
                WHERE gs.season = ?
            `, [
                getSeasonNumberFromSeasonId(dauntlessAllSeasonDetail.gauntlet_id)
            ]);

            if (!season.length) {
                await db.insert(`
                    INSERT INTO gauntlet_seasons (season, start_at, end_at)
                    VALUES (?, FROM_UNIXTIME(?), FROM_UNIXTIME(?))
                `, [
                    getSeasonNumberFromSeasonId(dauntlessAllSeasonDetail.gauntlet_id),
                    getTimestampFromDate(dauntlessAllSeasonDetail.start_at),
                    getTimestampFromDate(dauntlessAllSeasonDetail.end_at)
                ]);
                [season] = await db.select<DB_GAUNTLET_SEASON[]>(`
                    SELECT *
                    FROM gauntlet_seasons gs
                    WHERE gs.season = ?
                `, [
                    getSeasonNumberFromSeasonId(dauntlessAllSeasonDetail.gauntlet_id)
                ]);
            }

            if (new Date(season[0].end_at).getTime() < new Date().getTime()) continue;

            const dauntlessSeason = await fetchSeasonData(dauntlessAllSeasonDetail.gauntlet_id);
            if (!dauntlessSeason) return;

            let [leaderboardItem] = await db.select<DB_GAUNTLET_LEADERBOARD_ITEM[]>(`
                SELECT *
                FROM gauntlet_leaderboard_items gli
                WHERE gli.gauntlet_season = ? AND last_updated = FROM_UNIXTIME(?)
            `, [
                season[0].season,
                getTimestampFromDate(dauntlessSeason.last_updated)
            ]);
            if (leaderboardItem[0]) continue;

            console.log(`Creating new gauntlet_leaderboard_items row for season ${season[0].season} at ${dauntlessSeason.last_updated}`);

            await db.insert(`
                INSERT INTO gauntlet_leaderboard_items (last_updated, gauntlet_season)
                VALUES (FROM_UNIXTIME(?), ?)
            `, [
                getTimestampFromDate(dauntlessSeason.last_updated),
                season[0].season
            ]);
            [leaderboardItem] = await db.select<DB_GAUNTLET_LEADERBOARD_ITEM[]>(`
                SELECT *
                FROM gauntlet_leaderboard_items gli
                WHERE gli.gauntlet_season = ? AND last_updated = FROM_UNIXTIME(?)
            `, [
                season[0].season,
                getTimestampFromDate(dauntlessSeason.last_updated)
            ]);

            let rank = 1;
            for (const dauntlessLeaderboardItem of dauntlessSeason.leaderboard) {
                let [guild] = await db.select<DB_GUILD[]>(`
                    SELECT *
                    FROM guilds g
                    WHERE g.tag = ?
                `, [
                    dauntlessLeaderboardItem.guild_nameplate
                ]);

                if (!guild.length) {
                    await db.insert(`
                        INSERT INTO guilds (name, tag)
                        VALUES (?, ?)
                    `, [
                        dauntlessLeaderboardItem.guild_name,
                        dauntlessLeaderboardItem.guild_nameplate
                    ]);

                    [guild] = await db.select<DB_GUILD[]>(`
                        SELECT *
                        FROM guilds g
                        WHERE g.tag = ?
                    `, [
                        dauntlessLeaderboardItem.guild_nameplate
                    ]);
                }

                values.push(leaderboardItem[0].id, guild[0].id, dauntlessLeaderboardItem.level, dauntlessLeaderboardItem.remaining_sec, rank);

                rank++;
            }

            if (values.length) {
                await db.insert(`
                    INSERT INTO gauntlet_leaderboard_items_guilds (gauntlet_leaderboard_item_id, guild_id, level, remaining_sec, \`rank\`)
                    VALUES ${'(?,?,?,?,?)'.repeat(values.length / 5).split(')(').join('),(')}
                `, values);
            }
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