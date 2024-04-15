// DAUNTLESS GAUNTLET ENDPOINT
export type DAUNTLESS_ALL_SEASONS = {
    active_season: DAUNTLESS_SEASON,
    past_seasons: Array<DAUNTLESS_SEASON>
};

export type DAUNTLESS_SEASON = {
    gauntlet_id: string,
    start_at: Date,
    end_at: Date
};

export type DAUNTLESS_SEASON_DETAIL = {
    last_updated: Date,
    end_at: Date,
    leaderboard: Array<DAUNTLESS_LEADERBOARD_ITEM>
};

export type DAUNTLESS_LEADERBOARD_ITEM = {
    guild_name: string,
    guild_nameplate: string,
    level: number,
    remaining_sec: number
}

// APP GAUNTLET
export type ALL_SEASONS = {
    [key in string]: SEASON_DETAIL
}

export type SEASON_DETAIL = {
    startAt: Date,
    endAt: Date,
    lastUpdated: Date,
    leaderboard: Array<LEADERBOARD_ITEM>
}

export enum LEADERBOARD_POSITION_DIRECTION {
    GEARTER,
    LOWER
}

export type LEADERBOARD_ITEM = {
    guildName: string,
    guildNameplate: string,
    level: number,
    remainingSec: number,
    positionDirection?: LEADERBOARD_POSITION_DIRECTION
}

export type ALL_GUILDS = Array<GUILD_DETAIL>;

export type GUILD_DETAIL = {
    guildName: string,
    guildNameplate: string,
    leaderboardPositions: Array<LEADERBOARD_POSITION>,
    totalLevelCompleted: number,
    nbrOfTop1: number,
    nbrOfTop5: number,
    nbrOfTop100: number,
    rawRating: number,
    rating: number
}

export type LEADERBOARD_POSITION = {
    [key: string]: number
}

// DAUNTLESS TRIAL ENDPOINT
export type DAUNTLESS_TRIAL_DETAIL = {
    code: null,
    message: string,
    payload: {
        difficulty: number,
        guild: any,
        page: number,
        page_size: number,
        trial_id: string,
        world: {
            group: {
                difficulty: number,
                entries: Array<{
                    completion_time: number
                    entries: Array<{
                        phx_account_id: string,
                        platform: string,
                        platform_name: string,
                        player_role_id: string,
                        weapon: number | string
                    }>,
                    objectives_completed: number,
                    rank: number,
                    session_id: string
                }>,
                page: number,
                page_size: number,
                trial_id: string,
            },
            solo: {
                [key: string]: DAUNTLESS_TRIAL_DETAIL_SOLO_DETAIL
            }
        }
    }
}

export type DAUNTLESS_TRIAL_DETAIL_SOLO_DETAIL = {
    difficulty: number,
    entries: Array<{
        completion_time: number,
        objectives_completed: number,
        phx_account_id: string,
        platform: string,
        platform_name: string,
        player_role_id: string,
        rank: number,
        session_id: string,
        weapon: number | string
    }>,
    page: number,
    page_size: number,
    trial_id: string,
}

// APP TRIAL
export type ALL_SLAYERS = {
    [key: string]: Array<SLAYER_DETAIL>
}

export type ALL_TRIALS = {
    [key: string]: TRIAL_DETAIL
}

export type SLAYER_DETAIL = {
    platform: string,
    platformName: string
}

export type TRIAL_DETAIL = {
    group: Array<TRIAL_DETAIL_GROUP_DETAIL>,
    solo: {
        [key: string]: Array<TRIAL_DETAIL_SOLO_DETAIL_ENTRY>
    }
}

export type TRIAL_DETAIL_GROUP_DETAIL = {
    completionTime: number,
    objectivesCompleted: number,
    entries: Array<TRIAL_DETAIL_GROUP_DETAIL_ENTRY>
}

export type TRIAL_DETAIL_GROUP_DETAIL_ENTRY = {
    phxAccountId: string,
    platform: string,
    playerRoleId: string,
    weapon: number | string
}

export type TRIAL_DETAIL_SOLO_DETAIL_ENTRY = {
    phxAccountId: string,
    platform: string,
    completionTime: number,
    objectivesCompleted: number,
    playerRoleId: string,
    weapon: number | string
}

export const WEAPONS = ['all', 'axe', 'chainblades', 'hammer', 'pike', 'repeaters', 'strikers', 'sword'];

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
    const oldRatationHistory = [
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

    const currentBehemothRotation = [
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

    if (week < oldRatationHistory.length) return oldRatationHistory[week - 1];
    return currentBehemothRotation[(week - oldRatationHistory.length) % currentBehemothRotation.length - 1];
}