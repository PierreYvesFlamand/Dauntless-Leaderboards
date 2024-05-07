import db from './database/db';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { startGauntletsImport } from './importers/gauntlets';
import { startTrialsImport } from './importers/trials';
import { DB_BEHEMOTH, DB_COUNT, DB_GUILD_GAUNTLET_STAT_ITEM, DB_GUILD_INFO, DB_GUILD_LIST_ITEM, DB_GUILD_ME, DB_PLAYER_ME, DB_SEASON_INFO, DB_SEASON_LEADERBOARD, DB_TRIAL_INFO, DB_TRIAL_LEADERBOARD, DB_TRIAL_LEADERBOARD_ITEM_TYPE, TRIAL_LEADERBOARD_ITEM_TYPES, DB_PLAYER_LIST_ITEM, DB_PLAYER_TRIAL_ITEM, DB_GAUNTLET_EXPORT } from './types/types';
import config from '../config';

// Needs true folder structure for this part
(async () => {
    await db.init();

    startTrialsImport(config.AUTHORIZATION_CODE);
    startGauntletsImport();

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get('/api/me', async (req, res) => {
        try {
            let playerId = Number(req.query['playerId']);
            if (isNaN(playerId)) playerId = -1;
            let guildId = Number(req.query['guildId']);
            if (isNaN(guildId)) guildId = -1;

            const me = await getMe(playerId, guildId);

            res.status(200).json(me);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    });

    app.get('/api/dashboard', async (_req, res) => {
        try {
            const current_season_info = await getSeasonInfo();
            const current_season_leaderboard = await getSeasonLeaderboard(current_season_info.season, 5);
            const current_trial_info = await getTrialInfo();
            const current_trial_leaderboard_solo = await getTrialLeaderboard(current_trial_info.week, 'all', 5);
            const current_trial_leaderboard_group = await getTrialLeaderboard(current_trial_info.week, 'group', 5);

            res.status(200).json({ current_season_info, current_season_leaderboard, current_trial_info, current_trial_leaderboard_solo, current_trial_leaderboard_group });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    });

    app.get('/api/season/:id', async (req, res) => {
        try {
            const season_id = Number(req.params.id);
            if (isNaN(season_id)) throw new Error(`Season id should be a number`);

            const season_info = await getSeasonInfo(season_id === -1 ? 'current' : season_id);
            const season_leaderboard = await getSeasonLeaderboard(season_info.season);
            const all_seasons_info = await getAllSeasonsInfo();

            res.status(200).json({ all_seasons_info, season_info, season_leaderboard });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    });

    app.get('/api/guilds', async (req, res) => {
        try {
            let page = Number(req.query['page']);
            if (isNaN(page)) page = 1;

            let textSearch = String(req.query['textSearch']) || '';

            let orderByField = String(req.query['orderByField']) || 'DESC';
            const allowedOrderByFields = ['rating', 'nbrTop1', 'nbrTop5', 'nbrTop100', 'totalLevelCleared'];
            if (!allowedOrderByFields.includes(orderByField)) {
                orderByField = allowedOrderByFields[0];
            }

            let orderByDirection = String(req.query['orderByDirection']) || '';
            const allowedOrderByDirections = ['DESC', 'ASC'];
            if (!allowedOrderByDirections.includes(orderByDirection)) {
                orderByDirection = allowedOrderByDirections[0];
            }

            const guild_list = await getGuilds(page, textSearch, orderByField, orderByDirection as 'ASC' | 'DESC');

            res.status(200).json(guild_list);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    });

    app.get('/api/guilds/:id', async (req, res) => {
        try {
            const guild_id = Number(req.params.id);
            if (isNaN(guild_id)) throw new Error(`Guild id should be a number`);

            const guild_info = await getGuild(guild_id);
            const guild_gauntlet_stats = await getGuildGauntletStats(guild_id);

            res.status(200).json({ guild_info, guild_gauntlet_stats });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    });

    app.get('/api/trials', async (req, res) => {
        try {
            let page = Number(req.query['page']);
            if (isNaN(page)) page = 1;
            let behemothId: number | undefined | string = Number(req.query['behemothId']);
            if (isNaN(behemothId) || behemothId <= 0) behemothId = undefined;

            const trial_list = await getTrials(page, behemothId);

            res.status(200).json(trial_list);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    });

    app.get('/api/trials/:id', async (req, res) => {
        try {
            const trial_id = Number(req.params.id);
            if (isNaN(trial_id)) throw new Error(`Trial id should be a number`);

            const info = await getTrialInfo(trial_id);
            const all_leaderboard = await getTrialLeaderboard(trial_id, 'all');
            const group_leaderboard = await getTrialLeaderboard(trial_id, 'group');
            const hammer_leaderboard = await getTrialLeaderboard(trial_id, 'hammer');
            const axe_leaderboard = await getTrialLeaderboard(trial_id, 'axe');
            const sword_leaderboard = await getTrialLeaderboard(trial_id, 'sword');
            const chainblades_leaderboard = await getTrialLeaderboard(trial_id, 'chainblades');
            const pike_leaderboard = await getTrialLeaderboard(trial_id, 'pike');
            const repeaters_leaderboard = await getTrialLeaderboard(trial_id, 'repeaters');
            const strikers_leaderboard = await getTrialLeaderboard(trial_id, 'strikers');

            res.status(200).json({ info, all_leaderboard, group_leaderboard, hammer_leaderboard, axe_leaderboard, sword_leaderboard, chainblades_leaderboard, pike_leaderboard, repeaters_leaderboard, strikers_leaderboard });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    });

    app.get('/api/behemoths', async (_req, res) => {
        try {
            const behemoths = await getBehemoths();

            res.status(200).json(behemoths);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    });

    app.get('/api/players', async (req, res) => {
        try {
            let page = Number(req.query['page']);
            if (isNaN(page)) page = 1;

            let textSearch = String(req.query['textSearch']) || '';

            let orderByField = String(req.query['orderByField']) || 'DESC';
            const allowedOrderByFields = ['nbrSoloTop1', 'nbrSoloTop5', 'nbrSoloTop100', 'nbrGroupTop1', 'nbrGroupTop5', 'nbrGroupTop100'];
            if (!allowedOrderByFields.includes(orderByField)) {
                orderByField = allowedOrderByFields[0];
            }

            let orderByDirection = String(req.query['orderByDirection']) || '';
            const allowedOrderByDirections = ['DESC', 'ASC'];
            if (!allowedOrderByDirections.includes(orderByDirection)) {
                orderByDirection = allowedOrderByDirections[0];
            }

            const player_list = await getPlayers(page, textSearch, orderByField, orderByDirection as 'ASC' | 'DESC');

            res.status(200).json(player_list);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    });

    app.get('/api/players/:id', async (req, res) => {
        try {
            const player_id = Number(req.params.id);
            if (isNaN(player_id)) throw new Error(`Player id should be a number`);

            const player_info = await getPlayerInfo(player_id);
            const player_trials = await getPlayer(player_id);

            res.status(200).json({ player_info, player_trials });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    });

    app.post('/api/season/full/:id', async (req, res) => {
        try {
            let pwd = req.body['pwd']
            if (pwd !== config.EXPORT_PWD) throw new Error(`It's a no no`);

            const seasonId = Number(req.params.id);
            if (isNaN(seasonId)) throw new Error(`Season id should be a number`);

            const seasonExport = await getFullSeasonExport(seasonId);

            res.status(200).json(seasonExport);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    });

    app.use(express.static(path.resolve(__dirname, '../public/frontend/browser')));
    app.use('/assets', express.static(path.resolve(__dirname, '../public')));
    app.get('*', (_req, res) => {
        res.sendFile(path.resolve(__dirname, '../public/frontend/browser/index.html'));
    });

    app.listen(config.EXPRESS_PORT, () => console.log(`Server listening on port ${config.EXPRESS_PORT}`));
})();

async function getAllSeasonsInfo() {
    const [allSeasonsInfo] = await db.select<DB_SEASON_INFO[]>(`
        WITH MaxLastUpdated AS (
            SELECT gli.gauntlet_season, MAX(gli.last_updated) AS max_last_updated
            FROM gauntlet_leaderboard_items gli
            GROUP BY gli.gauntlet_season
        )
        SELECT gs.season, gs.start_at, gs.end_at, gli.last_updated, gs.flourish_id
        FROM gauntlet_seasons gs
        LEFT JOIN gauntlet_leaderboard_items gli ON gli.gauntlet_season = gs.season
        LEFT JOIN MaxLastUpdated mu ON mu.gauntlet_season = gs.season
        WHERE gli.last_updated = mu.max_last_updated;
    `);

    return allSeasonsInfo;
}

async function getSeasonInfo(season: number | 'current' = 'current') {
    const [seasonInfo] = await db.select<DB_SEASON_INFO[]>(`
        WITH MaxSeason AS (
            SELECT MAX(gs.season) AS max_season
            FROM gauntlet_seasons gs
            WHERE gs.season = ${season === 'current' ? 'gs.season' : '?'}
        ),
        MaxLastUpdated AS (
            SELECT MAX(gli.last_updated) AS max_last_updated
            FROM gauntlet_leaderboard_items gli
            WHERE gli.gauntlet_season = (SELECT max_season FROM MaxSeason)
        )
        SELECT gs.season, gs.start_at, gs.end_at, gli.last_updated, gs.flourish_id
        FROM gauntlet_seasons gs
        LEFT JOIN gauntlet_leaderboard_items gli ON gli.gauntlet_season = gs.season
        CROSS JOIN MaxSeason
        CROSS JOIN MaxLastUpdated
        WHERE gs.season = MaxSeason.max_season
        AND gli.last_updated = MaxLastUpdated.max_last_updated
    `, [
        season === 'current' ? '' : season
    ]);
    if (!seasonInfo.length) throw new Error('Error on seasonInfo select');

    return seasonInfo[0];
}

async function getSeasonLeaderboard(season: number, limit: number = 100) {
    const [seasonLeaderboard] = await db.select<DB_SEASON_LEADERBOARD[]>(`
        WITH MaxLastUpdated AS (
            SELECT MAX(last_updated) AS max_last_updated
            FROM gauntlet_leaderboard_items
            WHERE gauntlet_season = ?
        )
        SELECT glig.rank, g.id AS guild_id, gd.icon_filename AS guild_icon_filename, g.name AS guild_name, g.tag AS guild_tag, glig.level, glig.remaining_sec
        FROM gauntlet_leaderboard_items gli
        LEFT JOIN gauntlet_leaderboard_items_guilds glig ON glig.gauntlet_leaderboard_item_id = gli.id
        LEFT JOIN guilds g ON glig.guild_id = g.id
        LEFT JOIN guilds_data gd ON gd.guild_id = g.id
        CROSS JOIN MaxLastUpdated
        WHERE gli.gauntlet_season = ?
        AND gli.last_updated = MaxLastUpdated.max_last_updated
        ORDER BY glig.rank ASC
        LIMIT ?
    `, [
        season,
        season,
        limit
    ]);
    if (!seasonLeaderboard.length) throw new Error('Error on seasonLeaderboard select');

    return seasonLeaderboard;
}

async function getTrialInfo(week: number | 'current' = 'current') {
    const [trialInfo] = await db.select<DB_TRIAL_INFO[]>(`
        WITH MaxTrialWeek AS (
            SELECT MAX(week) AS max_week
            FROM trial_weeks tw
            WHERE week = ${week === 'current' ? 'tw.week' : '?'}
        )
        SELECT tw.week, b.name as behemoth_name, tw.start_at, tw.end_at, tli.last_updated
        FROM trial_weeks tw
        LEFT JOIN trial_leaderboard_items tli ON tli.trial_week = tw.week
        LEFT JOIN behemoths b ON b.id = tw.behemoth_id
        CROSS JOIN MaxTrialWeek
        WHERE tw.week = MaxTrialWeek.max_week
    `, [
        week === 'current' ? '' : week
    ]);
    if (!trialInfo.length) throw new Error('Error on trialInfo select');

    return trialInfo[0];
}

async function getTrialLeaderboard(week: number, type: TRIAL_LEADERBOARD_ITEM_TYPES, limit: number = 100) {
    const [selectedType] = await db.select<DB_TRIAL_LEADERBOARD_ITEM_TYPE[]>(`SELECT * FROM trial_leaderboard_item_type WHERE type LIKE ?`, [type]);
    if (!selectedType.length) selectedType[0] = { ...selectedType[0], id: 0, type: '' };

    let [trialLeaderboard] = await db.select<DB_TRIAL_LEADERBOARD[]>(`
        SELECT
            tlig.rank,
            tlig.completion_time,
            JSON_ARRAYAGG(JSON_OBJECT(
                'player_id', tligp.player_id,
                'player_icon_filename', pd.icon_filename,
                'player_name', pn.name,
                'platform_id', tligp.platform_id,
                'weapon_id', tligp.weapon_id,
                'role_id', tligp.role_id
            )) AS players
        FROM trial_leaderboard_items tli
        LEFT JOIN trial_leaderboard_items_groups tlig ON tlig.trial_leaderboard_item_id = tli.id
        LEFT JOIN trial_leaderboard_items_groups_players tligp ON tligp.trial_leaderboard_items_trial_groups_id = tlig.id
        LEFT JOIN player_names pn ON pn.player_id = tligp.player_id AND pn.platform_id = tligp.platform_id
        LEFT JOIN players_data pd ON pd.player_id = tligp.player_id
        WHERE tlig.rank >= 1 AND tlig.rank <= ? AND tli.trial_week = ? AND tlig.trial_leaderboard_item_type_id = ?
        GROUP BY tlig.rank, tlig.completion_time
        ORDER BY tlig.rank ASC
    `, [
        limit,
        week,
        selectedType[0].id
    ]);

    return trialLeaderboard;
}

async function getGuilds(page: number = 1, textSearch: string = '', orderByField: string = 'g.id', orderByDirection: 'ASC' | 'DESC' = 'ASC') {
    const [guilds] = await db.select<DB_GUILD_LIST_ITEM[]>(`
        SELECT g.id, gd.icon_filename, g.name, g.tag, gd.discord_link, gd.detail_html,
            (100 / 646) * SUM((100 - glig.rank) * (gs.season / 12)) as rating,
            SUM(glig.rank = 1) as nbrTop1,
            SUM(glig.rank <= 5) as nbrTop5,
            SUM(glig.rank <= 20) as nbrTop20,
            SUM(glig.rank <= 100) as nbrTop100,
            SUM(glig.level) as totalLevelCleared
        FROM gauntlet_seasons gs
        LEFT JOIN (
            SELECT MAX(last_updated) as max_last_updated, gauntlet_season
            FROM gauntlet_leaderboard_items
            GROUP BY gauntlet_season
        ) gli_max ON gli_max.gauntlet_season = gs.season
        LEFT JOIN gauntlet_leaderboard_items gli ON gli.gauntlet_season = gs.season AND gli.last_updated = gli_max.max_last_updated
        LEFT JOIN gauntlet_leaderboard_items_guilds glig ON glig.gauntlet_leaderboard_item_id = gli.id
        LEFT JOIN guilds g ON g.id = glig.guild_id
        LEFT JOIN guilds_data gd ON gd.guild_id = glig.guild_id
        WHERE (g.name LIKE ? OR g.tag LIKE ?)
        GROUP BY g.id
        ORDER BY ?? ${orderByDirection}
        LIMIT 20 OFFSET ?
    `, [
        `%${textSearch}%`,
        `%${textSearch}%`,
        orderByField,
        (page - 1) * 20
    ]);

    const [totals] = await db.select<DB_COUNT[]>(`SELECT COUNT(*) as total FROM guilds g WHERE (g.name LIKE ? OR g.tag LIKE ?)`, [`%${textSearch}%`, `%${textSearch}%`]);

    return {
        data: guilds,
        total: totals[0].total
    };
}

async function getGuild(id: number) {
    const [guilds] = await db.select<DB_GUILD_INFO[]>(`
        WITH MaxLastUpdated AS (
            SELECT gauntlet_season, MAX(last_updated) AS max_last_updated
            FROM gauntlet_leaderboard_items
            GROUP BY gauntlet_season
        )
        SELECT g.id, gd.icon_filename, gd.discord_link, gd.detail_html, g.name, g.tag,
            (100 / 646) * SUM((100 - glig.rank) * (gs.season / 12)) AS rating,
            SUM(glig.rank = 1) AS nbrTop1,
            SUM(glig.rank <= 5) AS nbrTop5,
            SUM(glig.rank <= 20) AS nbrTop20,
            SUM(glig.rank <= 100) AS nbrTop100,
            SUM(glig.level) AS totalLevelCleared
        FROM gauntlet_seasons gs
        LEFT JOIN MaxLastUpdated mlu ON mlu.gauntlet_season = gs.season
        LEFT JOIN gauntlet_leaderboard_items gli ON gli.gauntlet_season = gs.season AND gli.last_updated = mlu.max_last_updated
        LEFT JOIN gauntlet_leaderboard_items_guilds glig ON glig.gauntlet_leaderboard_item_id = gli.id
        LEFT JOIN guilds g ON g.id = glig.guild_id
        LEFT JOIN guilds_data gd ON gd.guild_id = glig.guild_id
        WHERE g.id = ?
        GROUP BY g.id
    `, [id]);

    return guilds[0];
}

async function getGuildGauntletStats(id: number) {
    const [seasonRanks] = await db.select<DB_GUILD_GAUNTLET_STAT_ITEM[]>(`
        WITH MaxLastUpdated AS (
            SELECT gauntlet_season, MAX(last_updated) AS max_last_updated
            FROM gauntlet_leaderboard_items
            GROUP BY gauntlet_season
        )
        SELECT gs.season, glig.\`rank\`
        FROM gauntlet_seasons gs
        LEFT JOIN MaxLastUpdated mlu ON mlu.gauntlet_season = gs.season
        LEFT JOIN gauntlet_leaderboard_items gli ON gli.gauntlet_season = gs.season AND gli.last_updated = mlu.max_last_updated
        LEFT JOIN gauntlet_leaderboard_items_guilds glig ON glig.gauntlet_leaderboard_item_id = gli.id
        LEFT JOIN guilds g ON g.id = glig.guild_id
        WHERE g.id = ?;
    `, [id]);

    return seasonRanks;
}

async function getMe(playerId: number, guildId: number) {
    const [players] = await db.select<DB_PLAYER_ME[]>(`
        SELECT p.id, pn.name, pd.icon_filename
        FROM players p
        LEFT JOIN player_names pn ON pn.player_id = p.id
        LEFT JOIN players_data pd ON pd.player_id = p.id
        WHERE p.id = ?
        LIMIT 1
    `, [playerId]);

    const [guilds] = await db.select<DB_GUILD_ME[]>(`
        SELECT g.id, g.tag, gd.icon_filename
        FROM guilds g
        LEFT JOIN guilds_data gd ON gd.guild_id = g.id
        WHERE g.id = ?
    `, [guildId]);

    return {
        player: players[0],
        guild: guilds[0]
    };
}

async function getTrials(page: number = 1, behemothId?: number) {
    const params: (string | number)[] = [];
    if (behemothId !== undefined) params.push(behemothId);
    params.push((page - 1) * 20);

    const [trials] = await db.select<any[]>(`
        SELECT
            tw.week,
            b.name AS behemoth_name,
            tw.start_at,
            tw.end_at,
            tlig_s.solo_player,
            tlig_s.completion_time AS solo_completion_time,
            JSON_ARRAYAGG(JSON_OBJECT('weapon_id', tligp_g.weapon_id, 'role_id', tligp_g.role_id)) AS group_players,
            tlig_g.completion_time AS group_completion_time
        FROM trial_weeks tw
        LEFT JOIN (
            SELECT
                tli.trial_week,
                JSON_ARRAYAGG(JSON_OBJECT('weapon_id', tligp_s.weapon_id, 'role_id', tligp_s.role_id)) AS solo_player,
                tlig_s.completion_time
            FROM trial_leaderboard_items tli
            LEFT JOIN trial_leaderboard_items_groups tlig_s ON tlig_s.trial_leaderboard_item_id = tli.id AND tlig_s.trial_leaderboard_item_type_id = 1 AND tlig_s.rank = 1
            LEFT JOIN trial_leaderboard_items_groups_players tligp_s ON tligp_s.trial_leaderboard_items_trial_groups_id = tlig_s.id
            GROUP BY tli.trial_week, tlig_s.completion_time
        ) tlig_s ON tlig_s.trial_week = tw.week
        LEFT JOIN trial_leaderboard_items tli ON tli.trial_week = tw.week
        LEFT JOIN behemoths b ON tw.behemoth_id = b.id
        LEFT JOIN trial_leaderboard_items_groups tlig_g ON tlig_g.trial_leaderboard_item_id = tli.id AND tlig_g.trial_leaderboard_item_type_id = 2 AND tlig_g.rank = 1
        LEFT JOIN trial_leaderboard_items_groups_players tligp_g ON tligp_g.trial_leaderboard_items_trial_groups_id = tlig_g.id
        WHERE b.id = ${behemothId === undefined ? 'b.id' : '?'}
        GROUP BY tw.week, b.name, tw.start_at, tw.end_at, tlig_s.completion_time, tlig_g.completion_time
        ORDER BY tw.week DESC
        LIMIT 20 OFFSET ?
    `, params);

    const [totals] = await db.select<DB_COUNT[]>(`SELECT COUNT(*) as total FROM trial_weeks tw WHERE tw.behemoth_id = ${behemothId === undefined ? 'tw.behemoth_id' : '?'}`, [behemothId === undefined ? '' : behemothId]);

    return {
        data: trials,
        total: totals[0].total
    };
}

async function getBehemoths() {
    const [behemoths] = await db.select<DB_BEHEMOTH[]>(`SELECT * FROM behemoths b ORDER BY b.name`);
    return behemoths;
}

async function getPlayers(page: number = 1, textSearch: string = '', orderByField: string = 'player_list.player_id', orderByDirection: 'ASC' | 'DESC' = 'ASC') {
    const [players] = await db.select<DB_PLAYER_LIST_ITEM[]>(`
        SELECT
            player_list.*,
            JSON_ARRAYAGG(JSON_OBJECT('platform_id', pn.platform_id, 'name', pn.name)) AS player_names,
            pd.icon_filename
        FROM (
            SELECT
                p.id AS player_id,
                SUM(tlig.rank <= 1 AND tlig.trial_leaderboard_item_type_id = 1) AS nbrSoloTop1,
                SUM(tlig.rank <= 5 AND tlig.trial_leaderboard_item_type_id = 1) AS nbrSoloTop5,
                SUM(tlig.rank <= 100 AND tlig.trial_leaderboard_item_type_id = 1) AS nbrSoloTop100,
                SUM(tlig.rank <= 1 AND tlig.trial_leaderboard_item_type_id = 2) AS nbrGroupTop1,
                SUM(tlig.rank <= 5 AND tlig.trial_leaderboard_item_type_id = 2) AS nbrGroupTop5,
                SUM(tlig.rank <= 100 AND tlig.trial_leaderboard_item_type_id = 2) AS nbrGroupTop100
            FROM trial_weeks tw
            LEFT JOIN trial_leaderboard_items tli ON tli.trial_week = tw.week
            LEFT JOIN trial_leaderboard_items_groups tlig ON tlig.trial_leaderboard_item_id = tli.id
            LEFT JOIN trial_leaderboard_items_groups_players tligp ON tligp.trial_leaderboard_items_trial_groups_id = tlig.id
            LEFT JOIN players p ON p.id = tligp.player_id
            GROUP BY p.id
        ) player_list
        LEFT JOIN player_names pn ON pn.player_id = player_list.player_id
        LEFT JOIN players_data pd ON pd.player_id = player_list.player_id
        WHERE pn.name LIKE ?
        GROUP BY pn.player_id
        ORDER BY ?? ${orderByDirection}
        LIMIT 20 OFFSET ?
    `, [
        `%${textSearch}%`,
        orderByField,
        (page - 1) * 20
    ]);

    const [totals] = await db.select<DB_COUNT[]>(`
        SELECT COUNT(DISTINCT p.id) as total
        FROM players p
        LEFT JOIN player_names pn ON pn.player_id = p.id
        WHERE pn.name LIKE ?
    `, [`%${textSearch}%`]
    );

    return {
        data: players,
        total: totals[0].total
    };
}

async function getPlayerInfo(id: number) {
    const [player_info] = await db.select<DB_PLAYER_TRIAL_ITEM[]>(`
        SELECT
            p.id,
            pd.icon_filename,
            JSON_ARRAYAGG(JSON_OBJECT('name', pn.name, 'platform_id', pn.platform_id)) AS names
        FROM players p
        LEFT JOIN player_names pn ON pn.player_id = p.id
        LEFT JOIN players_data pd ON pd.player_id = p.id
        WHERE p.id = ?
        GROUP BY p.id, pd.icon_filename
    `, [id]);
    if (!player_info.length) throw new Error('Error on player_info select');

    return player_info[0];
}

async function getPlayer(id: number) {
    const [player_trials] = await db.select<DB_PLAYER_TRIAL_ITEM[]>(`
        SELECT
            tlig.trial_leaderboard_item_type_id,
            tw.week,
            b.name AS behemoth_name,
            tlig.rank,
            JSON_ARRAYAGG(JSON_OBJECT('weapon_id', tligp.weapon_id, 'role_id', tligp.role_id, 'player_name', pn.name, 'platform_id', tligp.platform_id, 'player_icon_filename', pd.icon_filename, 'player_id', tligp.player_id)) AS players,
            tlig.completion_time,
            tw.start_at,
            tw.end_at
        FROM trial_leaderboard_items_groups tlig
        LEFT JOIN trial_leaderboard_items tli ON tli.id = tlig.trial_leaderboard_item_id
        LEFT JOIN trial_weeks tw ON tw.week = tli.trial_week
        LEFT JOIN trial_leaderboard_items_groups_players tligp ON tligp.trial_leaderboard_items_trial_groups_id = tlig.id
        LEFT JOIN player_names pn ON pn.player_id = tligp.player_id AND pn.platform_id = tligp.platform_id
        LEFT JOIN players_data pd ON pd.player_id = tligp.player_id
        LEFT JOIN behemoths b ON b.id = tw.behemoth_id
        WHERE tlig.id IN (
            SELECT trial_leaderboard_items_trial_groups_id
            FROM trial_leaderboard_items_groups_players
            WHERE player_id = ?
        )
        GROUP BY tlig.trial_leaderboard_item_type_id, tw.week, b.name, tlig.rank, tlig.completion_time, tw.start_at, tw.end_at
        ORDER BY tlig.trial_leaderboard_item_type_id ASC, tw.week DESC
        LIMIT 9999 OFFSET 0
    `, [id]);

    return player_trials;
}

async function getFullSeasonExport(id: number) {
    const [seasonExport] = await db.select<DB_GAUNTLET_EXPORT[]>(`
        SELECT
            gli.last_updated,
            JSON_ARRAYAGG(JSON_OBJECT(
                'guild_name', g.name,
                'guild_tag', g.tag,
                'level', glig.level,
                'remaining_sec', glig.remaining_sec
            )) AS leaderboard
        FROM gauntlet_leaderboard_items gli
        LEFT JOIN gauntlet_leaderboard_items_guilds glig ON glig.gauntlet_leaderboard_item_id = gli.id
        LEFT JOIN guilds g ON g.id = glig.guild_id
        WHERE gli.gauntlet_season = ?
        GROUP BY gli.last_updated
        ORDER BY gli.last_updated ASC
        LIMIT 100000
    `, [id]);

    return seasonExport;
}