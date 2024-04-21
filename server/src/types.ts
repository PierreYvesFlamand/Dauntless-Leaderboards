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
    [key: string]: SEASON_DETAIL
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
    remainingSec: number
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
    [key: string]: SLAYER_DETAIL
}

export type ALL_TRIALS = {
    [key: string]: TRIAL_DETAIL
}

export type SLAYER_DETAIL = {
    id?: string,
    WIN_Name?: string,
    PSN_Name?: string,
    XBL_Name?: string,
    SWT_Name?: string
}

export type TRIAL_DETAIL = {
    lastUpdated: Date,
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
    playerName?: string,
    platform: string,
    playerRoleId: string,
    weapon: number | string
}

export type TRIAL_DETAIL_SOLO_DETAIL_ENTRY = {
    phxAccountId: string,
    playerName?: string,
    platform: string,
    completionTime: number,
    objectivesCompleted: number,
    playerRoleId: string,
    weapon: number | string
}

// CUSTOM
export type ALL_PLAYERS_PERKS = {
    [key in string]: string
}
export type ALL_GUILDS_PERKS = {
    [key in string]: string
}
export type ALL_GUILDS_DETAILS = {
    [key in string]: {
        imageFileName: string,
        discordLink: string,
        description: string
    }
}