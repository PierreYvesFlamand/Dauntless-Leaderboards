export type ALL_SEASONS = {
    [key in string]: {
        startAt: Date,
        endAt: Date,
        lastUpdated: Date,
        leaderboard: Array<LEADERBOARD_ITEM>
    }
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