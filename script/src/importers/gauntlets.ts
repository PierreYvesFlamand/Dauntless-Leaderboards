import fs from 'fs';
import config from '../../config';

import { getSeasonNumberFromSeasonId } from '../utils/utils';

import { DAUNTLESS_GAUNTLET_ALL_SEASONS, DAUNTLESS_GAUNTLET_SEASON, DAUNTLESS_GAUNTLET_SEASON_FORMATED, DAUNTLESS_GAUNTLET_SEASON_LEADERBOARD_ITEM, GAUNTLET_SEASON, GAUNTLET_SEASON_LEADERBOARD_ITEM, GUILD } from '../types/types';

export async function startGauntletsImport() {
    console.log('Start gauntlet import at ' + new Date().toUTCString());

    const dauntlessAllSeasons = await fetchAllSeasons();
    if (!dauntlessAllSeasons) return;

    for (const dauntlessSeasonDetail of [...dauntlessAllSeasons.past_seasons, dauntlessAllSeasons.active_season]) {
        if (fs.existsSync(`../database/dauntlessData/gauntlets/${dauntlessSeasonDetail.gauntlet_id}.json`) && getSeasonNumberFromSeasonId(dauntlessSeasonDetail.gauntlet_id) !== config.ACTIVE_SEASON) continue;

        console.log(`Updating gauntlet season ${dauntlessSeasonDetail.gauntlet_id}`);

        const dauntlessSeasonContent = await fetchSeasonData(dauntlessSeasonDetail.gauntlet_id);
        if (!dauntlessSeasonContent) throw new Error();

        // Save Dauntless raw data
        fs.writeFileSync(`../database/dauntlessData/gauntlets/${dauntlessSeasonDetail.gauntlet_id}.json`, JSON.stringify({
            start_at: dauntlessSeasonDetail.start_at,
            end_at: dauntlessSeasonContent.end_at,
            last_updated: dauntlessSeasonContent.last_updated,
            leaderboard: dauntlessSeasonContent.leaderboard
        } as DAUNTLESS_GAUNTLET_SEASON_FORMATED, null, 4));

        // Fetch and update guild list
        const guilds = JSON.parse(fs.readFileSync('../database/guilds.json', 'utf8')) as GUILD[];

        for (const leaderboardItem of dauntlessSeasonContent.leaderboard) {
            if (guilds.find(g => g.tag === leaderboardItem.guild_nameplate)) continue;
            guilds.push({
                id: guilds.length + 1,
                name: leaderboardItem.guild_name,
                tag: leaderboardItem.guild_nameplate
            });
        }

        fs.writeFileSync('../database/guilds.json', JSON.stringify(guilds, null, 4));

        // Create or update gauntlet data
        const gauntletSeason: GAUNTLET_SEASON = {
            startAt: dauntlessSeasonDetail.start_at,
            endAt: dauntlessSeasonContent.end_at,
            lastUpdated: dauntlessSeasonContent.last_updated,
            leaderboard: dauntlessSeasonContent.leaderboard.reduce((array: GAUNTLET_SEASON_LEADERBOARD_ITEM[], item: DAUNTLESS_GAUNTLET_SEASON_LEADERBOARD_ITEM, index: number): GAUNTLET_SEASON_LEADERBOARD_ITEM[] => {
                return [
                    ...array,
                    {
                        guildId: guilds.find(g => g.tag === item.guild_nameplate)!.id,
                        rank: index + 1,
                        level: item.level,
                        remainingSec: item.remaining_sec
                    }
                ]
            }, [])
        };
        fs.writeFileSync(`../database/gauntlets/${dauntlessSeasonDetail.gauntlet_id}.json`, JSON.stringify(gauntletSeason, null, 4));
    }

    console.log('End of gauntlet import at ' + new Date().toUTCString());
}

async function fetchAllSeasons(): Promise<DAUNTLESS_GAUNTLET_ALL_SEASONS | null> {
    try {
        const res = await fetch(`https://storage.googleapis.com/dauntless-gauntlet-leaderboard/production-gauntlet-all-seasons.json?_=${new Date()}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
    return null;
}

async function fetchSeasonData(gauntlet_id: string): Promise<DAUNTLESS_GAUNTLET_SEASON | null> {
    try {
        const res = await fetch(`https://storage.googleapis.com/dauntless-gauntlet-leaderboard/production-${gauntlet_id}.json?_=${new Date()}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
    return null;
}