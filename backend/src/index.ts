import db from './database/db';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { startGauntletsImport } from './importers/gauntlets';
import { COUNT, SEASON_INFO, SEASON_LEADERBOARD_ITEM_GUILD, TRIAL_INFO, TRIAL_LEADERBOARD_ITEM, TRIAL_LEADERBOARD_ITEM_TYPE, TRIAL_LEADERBOARD_ITEM_TYPES } from './types/types';
import { startTrialsImport } from './importers/trials';

(async () => {
    await db.init();

    // await startTrialsImport('762d94168bff4963a331440c4ec9abd4');
    await startGauntletsImport();

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use('/assets', express.static(path.resolve(__dirname, '../public')));

    app.get('/api/dashboard', async (_req, res) => {
        try {
            const seasonInfo = await getSeasonInfo();
            const seasonLeaderboard = await getSeasonLeaderboard(seasonInfo.season, 5);
            const trialInfo = await getTrialInfo();
            const trialLeaderboardSolo = await getTrialLeaderboard(trialInfo.week, 'all', 5);
            const trialLeaderboardGroup = await getTrialLeaderboard(trialInfo.week, 'group', 5);

            res.status(200).json({ seasonInfo, seasonLeaderboard, trialInfo, trialLeaderboardSolo, trialLeaderboardGroup });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    });

    app.get('/api/season/:id', async (req, res) => {
        try {
            const season_id = Number(req.params.id);
            if (isNaN(season_id)) throw new Error(`Season id should be a number`);

            const seasonInfo = await getSeasonInfo(season_id === -1 ? 'current' : season_id);
            const seasonLeaderboard = await getSeasonLeaderboard(seasonInfo.season);
            const allSeasonsInfo = await getAllSeasonsInfo();

            res.status(200).json({ seasonInfo, seasonLeaderboard, allSeasonsInfo });
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

            const guildList = await getGuilds(page, textSearch, orderByField, orderByDirection as 'ASC' | 'DESC');

            res.status(200).json(guildList);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    });

    app.get('/api/guilds/:id', async (req, res) => {
        try {
            const guild_id = Number(req.params.id);
            if (isNaN(guild_id)) throw new Error(`Guild id should be a number`);

            const guildInfo = await getGuild(guild_id);
            const guildSeasonStats = await getGuildSeasonStats(guild_id);

            res.status(200).json({ guildInfo, guildSeasonStats });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    });

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

    app.listen(7001, () => console.log('Server listening on port 7001'));
})();

async function getAllSeasonsInfo() {
    const [allSeasonsInfo] = await db.select<SEASON_INFO[]>(`
        WITH MaxLastUpdated AS (
            SELECT gauntlet_season, MAX(last_updated) AS max_last_updated
            FROM gauntlet_leaderboard_items
            GROUP BY gauntlet_season
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
    const [seasonInfo] = await db.select<SEASON_INFO[]>(`
        WITH MaxSeason AS (
            SELECT MAX(season) AS max_season
            FROM gauntlet_seasons gs
            WHERE season = ${season === 'current' ? 'gs.season' : '?'}
        ),
        MaxLastUpdated AS (
            SELECT MAX(last_updated) AS max_last_updated
            FROM gauntlet_leaderboard_items
            WHERE gauntlet_season = (SELECT max_season FROM MaxSeason)
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
    const [seasonLeaderboard] = await db.select<SEASON_LEADERBOARD_ITEM_GUILD[]>(`
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
    const [trialInfo] = await db.select<TRIAL_INFO[]>(`
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
        AND tli.last_updated = (
            SELECT MAX(last_updated)
            FROM trial_leaderboard_items
            WHERE trial_week = MaxTrialWeek.max_week
        )
    `, [
        week === 'current' ? '' : week
    ]);
    if (!trialInfo.length) throw new Error('Error on trialInfo select');

    return trialInfo[0];
}

async function getTrialLeaderboard(week: number, type: TRIAL_LEADERBOARD_ITEM_TYPES, limit: number = 100) {
    // TODO : type
    const [selectedType] = await db.select<TRIAL_LEADERBOARD_ITEM_TYPE[]>(`SELECT id FROM trial_leaderboard_item_type WHERE type LIKE ?`, [type]);
    if (!selectedType.length) selectedType[0] = { ...selectedType[0], id: 0, type: '' };

    let [trialLeaderboard] = await db.select<any[]>(`
        SELECT tlip.rank, tlip.completion_time, tlip.weapon_id, tlip.role_id, tlip.player_id, pn.name as player_name, pd.icon_filename as player_icon_filename, tlip.platform_id
        FROM trial_leaderboard_items tli
        LEFT JOIN trial_leaderboard_items_players tlip ON tlip.trial_leaderboard_item_id = tli.id
        LEFT JOIN trial_leaderboard_item_type tlit ON tlit.id = tlip.trial_leaderboard_item_type_id
        LEFT JOIN (
            SELECT tl.player_id, tl.platform_id, MAX(tli.last_updated) as max_last_updated
            FROM trial_leaderboard_items tli
            LEFT JOIN trial_leaderboard_items_players tl ON tl.trial_leaderboard_item_id = tli.id
            WHERE tli.trial_week = ?
            GROUP BY tl.player_id, tl.platform_id
        ) max_last_updated ON max_last_updated.player_id = tlip.player_id AND max_last_updated.platform_id = tlip.platform_id
        LEFT JOIN players p ON p.id = tlip.player_id
        LEFT JOIN player_names pn ON pn.player_id = p.id AND pn.platform_id = tlip.platform_id
        LEFT JOIN players_data pd ON pd.player_id = p.id
        WHERE tlip.rank >= 1 AND tlip.rank <= ? AND tli.trial_week = ? AND tlit.id = ? AND tli.last_updated = max_last_updated.max_last_updated
        ORDER BY tlip.rank ASC
    `, [
        week,
        limit,
        week,
        selectedType[0].id
    ]);

    if (type === 'group') {
        const trialLeaderboardGroupFormated: any[] = [];
        for (const row of trialLeaderboard) {
            if (!trialLeaderboardGroupFormated.find(i => i.rank === row.rank)) {
                trialLeaderboardGroupFormated.push({
                    rank: row.rank,
                    completion_time: row.completion_time,
                    players: []
                });
            }
            trialLeaderboardGroupFormated.find(i => i.rank === row.rank).players.push({
                platform_id: row.platform_id,
                player_icon_filename: row.player_icon_filename,
                player_id: row.player_id,
                player_name: row.player_name,
                role_id: row.role_id,
                weapon_id: row.weapon_id
            })
        }
        console.log(trialLeaderboardGroupFormated);

        trialLeaderboard = trialLeaderboardGroupFormated;
    }

    return trialLeaderboard;
}

async function getGuilds(page: number, textSearch: string, orderByField: string, orderByDirection: 'ASC' | 'DESC') {
    // TODO: type
    const [guilds] = await db.select<any[]>(`
        SELECT g.id, gd.icon_filename, g.name, g.tag, 
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

    const [totals] = await db.select<COUNT[]>(`SELECT COUNT(*) as total FROM guilds g WHERE (g.name LIKE ? OR g.tag LIKE ?)`, [`%${textSearch}%`, `%${textSearch}%`]);

    return {
        guilds,
        total: totals[0].total
    };
}

async function getGuild(id: number) {
    // TODO : type
    const [guilds] = await db.select<any[]>(`
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

async function getGuildSeasonStats(id: number) {
    // TODO : type
    const [seasonRanks] = await db.select<any[]>(`
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
    // TODO : type
    const [players] = await db.select<any[]>(`
        SELECT p.id, pn.name, pd.icon_filename
        FROM players p
        LEFT JOIN player_names pn ON pn.player_id = p.id
        LEFT JOIN players_data pd ON pd.player_id = p.id
        WHERE p.id = ?
        LIMIT 1
    `, [playerId]);

    const [guilds] = await db.select<any[]>(`
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