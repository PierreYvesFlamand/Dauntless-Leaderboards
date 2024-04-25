import db from './database/db';
import { startGauntletsImport } from './importers/gauntlets';
import { startTrialsImport } from './importers/trials';
import express from 'express';
import cors from 'cors';
import { SEASON_INFO, SEASON_LEADERBAORD_ITEM, TRIAL_INFO, TRIAL_LEADERBAORD_ITEM } from './types/types';

(async () => {
    await db.init();
    // await startTrialsImport('ae3bab7f206d45768ed39fa103527efe');
    // await startGauntletsImport();

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get('/api/dashboard', async (req, res) => {
        try {
            const season_info = await getSeasonInfo();
            const season_leaderbaord = await getSeasonLeaderboard(season_info.season, 5);
            const trial_info = await getTrialInfo();
            const trial_leaderbaord = await getTrialLeaderboard(trial_info.week, 5);

            res.status(200).json({ season_info, season_leaderbaord, trial_info, trial_leaderbaord });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    });

    app.listen(7001, () => console.log('Server listening on port 7001'));
})();

async function getSeasonInfo(season: number | 'current' = 'current') {
    const [seasonInfo] = await db.select<SEASON_INFO[]>(`SELECT gs.season, gs.start_at, gs.end_at, gli.last_updated FROM gauntlet_seasons gs LEFT JOIN gauntlet_leaderboard_items gli ON gli.gauntlet_season = gs.season WHERE gs.season = ( SELECT MAX(gs.season) FROM gauntlet_seasons gs WHERE gs.season = ${season === 'current' ? 'gs.season' : season} ) AND gli.last_updated = ( SELECT MAX(gli.last_updated) FROM gauntlet_leaderboard_items gli WHERE gli.gauntlet_season = ( SELECT MAX(gs.season) FROM gauntlet_seasons gs WHERE gs.season = ${season === 'current' ? 'gs.season' : season} ) )`);
    if (!seasonInfo.length) throw new Error('Error on seasonInfo select');

    return seasonInfo[0];
}

async function getSeasonLeaderboard(season: number, limit: number = 100) {
    const [seasonLeaderboard] = await db.select<SEASON_LEADERBAORD_ITEM[]>(`SELECT glig.rank, g.id AS guild_id, gd.icon_filename as guild_icon_filename, g.name AS guild_name, g.tag AS guild_tag, glig.level, glig.remaining_sec FROM gauntlet_leaderboard_items gli LEFT JOIN gauntlet_leaderboard_items_guilds glig ON glig.gauntlet_leaderboard_item_id = gli.id LEFT JOIN guilds g ON glig.guild_id = g.id LEFT JOIN guilds_data gd ON gd.guild_id = g.id WHERE gli.gauntlet_season = ${season} AND gli.last_updated = ( SELECT MAX(last_updated) FROM gauntlet_leaderboard_items gli WHERE gli.gauntlet_season = ${season} ) ORDER BY glig.rank ASC LIMIT ${limit}`);
    if (!seasonLeaderboard.length) throw new Error('Error on seasonLeaderboard select');

    return seasonLeaderboard;
}

async function getTrialInfo(week: number | 'current' = 'current') {
    const [trialInfo] = await db.select<TRIAL_INFO[]>(`SELECT tw.week, tw.start_at, tw.end_at, tli.last_updated FROM trial_weeks tw LEFT JOIN trial_leaderboard_items tli ON tli.trial_week = tw.week WHERE tw.week = ( SELECT MAX(tw.week) FROM trial_weeks tw WHERE tw.week = ${week === 'current' ? 'tw.week' : week} ) AND tli.last_updated = ( SELECT MAX(last_updated) FROM trial_leaderboard_items tli WHERE tli.trial_week = ( SELECT MAX(tw.week) FROM trial_weeks tw WHERE tw.week = ${week === 'current' ? 'tw.week' : week} ) )`);
    if (!trialInfo.length) throw new Error('Error on trialInfo select');

    return trialInfo[0];
}

async function getTrialLeaderboard(week: number, limit: number = 100) {
    const [trialLeaderboard] = await db.select<TRIAL_LEADERBAORD_ITEM[]>(`SELECT tlip.rank, tlip.completion_time, tlip.weapon_id, tlip.role_id, tlip.player_id, pn.name as player_name, pd.icon_filename as player_icon_filename, tlip.platform_id FROM trial_leaderboard_items tli LEFT JOIN trial_leaderboard_items_players tlip ON tlip.trial_leaderboard_item_id = tli.id LEFT JOIN trial_leaderboard_item_type tlit ON tlit.id = tlip.trial_leaderboard_item_type_id LEFT JOIN players p ON p.id = tlip.player_id LEFT JOIN player_names pn ON pn.player_id = p.id AND pn.platform_id = tlip.platform_id LEFT JOIN players_data pd ON pd.player_id = p.id WHERE tli.trial_week = ${week} AND tlit.id = 1 AND tli.last_updated = ( SELECT MAX(tli.last_updated) FROM trial_leaderboard_items tli WHERE tli.trial_week = ${week} ) ORDER BY tlip.rank ASC LIMIT ${limit}`);
    if (!trialLeaderboard.length) throw new Error('Error on trialLeaderboard select');

    return trialLeaderboard;
}