import { RowDataPacket } from 'mysql2';

// GAUNTLET
export type DAUNTLESS_ALL_SEASONS = {
    active_season: DAUNTLESS_ALL_SEASONS_DETAIL
    past_seasons: DAUNTLESS_ALL_SEASONS_DETAIL[]
}

export type DAUNTLESS_ALL_SEASONS_DETAIL = {
    end_at: Date
    gauntlet_id: string
    start_at: Date
}

export interface GAUNTLET_SEASON extends RowDataPacket {
    season: number
    start_at: Date
    end_at: Date
}

export interface SEASON_LEADERBOARD_ITEM extends RowDataPacket {
    id: number
    gauntlet_season: number
    last_updated: Date
}

export type DAUNTLESS_SEASON = {
    last_updated: Date
    end_at: Date
    leaderboard: DAUNTLESS_SEASON_LEADERBOARD_ITEM[]
}

export type DAUNTLESS_SEASON_LEADERBOARD_ITEM = {
    guild_name: string
    guild_nameplate: string
    level: number
    remaining_sec: number
}

export interface GUILD extends RowDataPacket {
    id: number
    name: string
    tag: string
}

// TRIALS
export type DAUNTLESS_TRIAL = {
    code: any // TODO
    message: string
    payload: {
        difficulty: number
        guild: any // TODO
        page: number
        page_size: number
        trial_id: string
        world: {
            group: {
                difficulty: number
                entries: {
                    completion_time: number
                    entries: {
                        phx_account_id: string
                        platform: string
                        platform_name: string
                        player_role_id: string
                        weapon: number | string
                    }[]
                    objectives_completed: number
                    rank: number
                }[]
                page: number
                page_size: number
                trial_id: string
            },
            solo: {
                all: DAUNTLESS_TRIAL_SOLO_DETAIL
                axe: DAUNTLESS_TRIAL_SOLO_DETAIL
                chainblades: DAUNTLESS_TRIAL_SOLO_DETAIL
                hammer: DAUNTLESS_TRIAL_SOLO_DETAIL
                pike: DAUNTLESS_TRIAL_SOLO_DETAIL
                repeaters: DAUNTLESS_TRIAL_SOLO_DETAIL
                strikers: DAUNTLESS_TRIAL_SOLO_DETAIL
            }
        }
    }
}

export type DAUNTLESS_TRIAL_SOLO_DETAIL = {
    difficulty: number
    entries: {
        completion_time: number
        objectives_completed: number
        phx_account_id: string
        platform: string
        platform_name: string
        player_role_id: string
        rank: number
        weapon: number | string
    }[]
    page: number
    page_size: number
    trial_id: string
}

export interface TRIAL_WEEK extends RowDataPacket {
    week: number
    start_at: Date
    end_at: Date
}

export interface TRIAL_LEADERBOARD_ITEM extends RowDataPacket {
    id: number
    trial_week: number
    last_updated: Date
}

export interface PLAYER extends RowDataPacket {
    id: number
    phx_id: string
}

export interface PLAYER_NAME extends RowDataPacket {
    player_id: number
    platform_id: number
    name: string
}

export interface PLATFORM extends RowDataPacket {
    id: number
    name: string
}

export interface TRIAL_LEADERBOARD_ITEM_TYPE extends RowDataPacket {
    id: number
    type: string
}

// APP
export interface SEASON_INFO extends RowDataPacket {
    season: number
    start_at: Date
    end_at: Date
    last_updated: Date
    flourish_id: string
}

export interface SEASON_LEADERBOARD_ITEM_GUILD extends RowDataPacket {
    rank: number
    guild_id: number
    guild_icon_filename: string | null
    guild_name: string
    guild_tag: string
    level: number
    remaining_sec: number
}

export interface TRIAL_INFO extends RowDataPacket {
    week: number
    behemoth_name: string
    start_at: Date
    end_at: Date
    last_updated: Date
}

export interface TRIAL_LEADERBOARD_ITEM_PLAYER extends RowDataPacket {
    rank: number
    completion_time: number
    weapon_id: number
    role_id: string
    player_id: number
    player_name: string
    player_icon_filename: string | null
    platform_id: number
}

export interface TRIAL_LEADERBOARD_ITEM_TYPE extends RowDataPacket {
    id: number
    type: string
}

export interface BEHEMOTH extends RowDataPacket {
    id: number
    name: string
}

export type TRIAL_LEADERBOARD_ITEM_TYPES = 'all' | 'group' | 'sword' | 'axe' | 'hammer' | 'chainblades' | 'pike' | 'repeaters' | 'strikers';


export interface COUNT extends RowDataPacket {
    total: number
}

// From endpoints
export type DASHBOARD_DATA = {
    seasonInfo: SEASON_INFO
    seasonLeaderboard: SEASON_LEADERBOARD_ITEM_GUILD[]
    trialInfo: TRIAL_INFO
    trialLeaderboardSolo: TRIAL_LEADERBOARD_ITEM_PLAYER_DATA[]
    trialLeaderboardGroup: TRIAL_LEADERBOARD_ITEM_PLAYER_DATA[]
}

export type TRIAL_LEADERBOARD_ITEM_PLAYER_DATA = {
    rank: number
    completion_time: number
    players: {
        weapon_id: number
        role_id: string
        player_id: number
        player_name: string
        player_icon_filename: string | null
        platform_id: number
    }[]
}

export type SEASON_DATA = {
    seasonInfo: SEASON_INFO
    allSeasonsInfo: SEASON_INFO[]
    seasonLeaderboard: SEASON_LEADERBOARD_ITEM_GUILD[]
}

export type GUILD_LIST_DATA = {
    guilds: GUILD_DATA[]
    total: number
}

export type GUILD_DATA = {
    icon_filename: string
    id: number
    name: string
    nbrTop1: string
    nbrTop5: string
    nbrTop100: string
    rating: string
    tag: string
    totalLevelCleared: string
}

export type GUILD_DETAIL = {
    guildInfo: {
        icon_filename: string
        id: number
        name: string
        nbrTop1: string
        nbrTop5: string
        nbrTop100: string
        rating: string
        tag: string
        totalLevelCleared: string
        detail_html: string
        discord_link: string
    }
    guildSeasonStats: {
        season: number
        rank: number
    }[]
}

export type ME = {
    guild?: {
        id: number
        tag: string
        icon_filename: string
    }
    player?: {
        id: number
        name: string
        icon_filename: string
    }
}

export type TRIAL_LIST_DATA = {
    trials: TRIAL_DATA[]
    total: number
}

export type TRIAL_DATA = {
    week: number
    behemoth_name: string
    trial_start_time: Date
    trial_end_time: Date
    solo_weapon_id: number
    solo_role_id: string
    solo_completion_time: number
    group_players: {
        weapon_id: number
        role_id: string
    }[]
    group_completion_time: number
}

export type BEHEMOTH_LIST = {
    id: number
    name: string
}

export type TRIAL_DETAIL = {
    info: TRIAL_INFO
    allLeaderboard: TRIAL_LEADERBOARD_ITEM_PLAYER_DATA[]
    groupLeaderboard: TRIAL_LEADERBOARD_ITEM_PLAYER_DATA[]
    hammerLeaderboard: TRIAL_LEADERBOARD_ITEM_PLAYER_DATA[]
    axeLeaderboard: TRIAL_LEADERBOARD_ITEM_PLAYER_DATA[]
    swordLeaderboard: TRIAL_LEADERBOARD_ITEM_PLAYER_DATA[]
    chainbladesLeaderboard: TRIAL_LEADERBOARD_ITEM_PLAYER_DATA[]
    repeatersLeaderboard: TRIAL_LEADERBOARD_ITEM_PLAYER_DATA[]
    pikeLeaderboard: TRIAL_LEADERBOARD_ITEM_PLAYER_DATA[]
    strikersLeaderboard: TRIAL_LEADERBOARD_ITEM_PLAYER_DATA[]
}

export type PLAYER_LIST_DATA = {
    players: PLAYER_DATA[]
    total: number
}

export type PLAYER_DATA = {
    icon_filename: string
    id: number
    player_names: { platform_id: number, name: string }[]
    nbrSoloTop1: string
    nbrSoloTop5: string
    nbrSoloTop100: string
    nbrGroupTop1: string
    nbrGroupTop5: string
    nbrGroupTop100: string
}