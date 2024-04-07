// DAUNTLESS ENDPOINT
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

// APP
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