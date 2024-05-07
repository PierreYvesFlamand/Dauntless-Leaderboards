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
export interface DB_GAUNTLET_SEASON extends GAUNTLET_SEASON, RowDataPacket { }
export type GAUNTLET_SEASON = {
    season: number
    start_at: Date
    end_at: Date
    flourish_id: string
}

export interface DB_GAUNTLET_LEADERBOARD_ITEM extends GAUNTLET_LEADERBOARD_ITEM, RowDataPacket { }
export type GAUNTLET_LEADERBOARD_ITEM = {
    id: number
    gauntlet_season: number
    last_updated: Date
}

export interface DB_GUILD extends GUILD, RowDataPacket { }
export type GUILD = {
    id: number
    name: string
    tag: string
}

export interface DB_GAUNTLET_EXPORT extends GAUNTLET_EXPORT, RowDataPacket { }
export type GAUNTLET_EXPORT = {
    last_updated: Date
    leaderboard: {
        guild_name: string
        guild_tag: string
        level: number
        remaining_sec: number
    }[]
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

export interface DB_TRIAL_WEEK extends TRIAL_WEEK, RowDataPacket { }
type TRIAL_WEEK = {
    week: number
    start_at: Date
    end_at: Date
}

export interface DB_PLATFORM extends PLATFORM, RowDataPacket { }
type PLATFORM = {
    id: number
    name: string
}

export interface DB_TRIAL_LEADERBOARD_ITEM_TYPE extends TRIAL_LEADERBOARD_ITEM_TYPE, RowDataPacket { }
type TRIAL_LEADERBOARD_ITEM_TYPE = {
    id: number
    type: string
}

export interface DB_BEHEMOTH extends BEHEMOTH, RowDataPacket { }
export type BEHEMOTH = {
    id: number
    name: string
}

export interface DB_TRIAL_LEADERBOARD_ITEM extends TRIAL_LEADERBOARD_ITEM, RowDataPacket { }
type TRIAL_LEADERBOARD_ITEM = {
    id: number
    trial_week: number
    last_updated: Date
}

export interface DB_PLAYER extends PLAYER, RowDataPacket { }
type PLAYER = {
    id: number
    phx_id: string
}

export interface DB_PLAYER_NAME extends PLAYER_NAME, RowDataPacket { }
type PLAYER_NAME = {
    player_id: number
    platform_id: number
    name: string
}

// ENDPOINTS
export interface DB_SEASON_INFO extends SEASON_INFO, RowDataPacket { }
export type SEASON_INFO = {
    season: number
    start_at: Date
    end_at: Date
    last_updated: Date
    flourish_id: string
}

export interface DB_SEASON_LEADERBOARD extends SEASON_LEADERBOARD, RowDataPacket { }
export type SEASON_LEADERBOARD = {
    rank: number
    guild_id: number
    guild_icon_filename: string | null
    guild_name: string
    guild_tag: string
    level: number
    remaining_sec: number
}

export interface DB_TRIAL_INFO extends TRIAL_INFO, RowDataPacket { }
export type TRIAL_INFO = {
    week: number
    behemoth_name: string
    start_at: Date
    end_at: Date
    last_updated: Date
}

export interface DB_TRIAL_LEADERBOARD extends TRIAL_LEADERBOARD, RowDataPacket { }
export type TRIAL_LEADERBOARD = {
    rank: number
    completion_time: number
    players: TRIAL_LEADERBOARD_PLAYER[]
}

type TRIAL_LEADERBOARD_PLAYER = {
    role_id: string
    player_id: number
    weapon_id: number
    platform_id: number
    player_name: string
    player_icon_filename: string
}

export type TRIAL_LEADERBOARD_ITEM_TYPES = 'all' | 'group' | 'sword' | 'axe' | 'hammer' | 'chainblades' | 'pike' | 'repeaters' | 'strikers';

export interface DB_COUNT extends COUNT, RowDataPacket { }
type COUNT = { total: number }

export interface DB_PLAYER_ME extends PLAYER_ME, RowDataPacket { }
export type PLAYER_ME = {
    id: number
    name: string
    icon_filename: string
}

export interface DB_GUILD_ME extends GUILD_ME, RowDataPacket { }
export type GUILD_ME = {
    id: number
    tag: string
    icon_filename: string
}

export interface DB_GUILD_LIST_ITEM extends GUILD_LIST_ITEM, RowDataPacket { }
export type GUILD_LIST_ITEM = {
    id: number
    icon_filename: string
    name: string
    tag: string
    rating: string
    nbrTop1: string
    nbrTop5: string
    nbrTop20: string
    nbrTop100: string
    totalLevelCleared: string
    discord_link: string
    detail_html: string
}

export interface DB_PLAYER_LIST_ITEM extends PLAYER_LIST_ITEM, RowDataPacket { }
export type PLAYER_LIST_ITEM = {
    player_id: number
    nbrSoloTop1: number
    nbrSoloTop5: number
    nbrSoloTop100: number
    nbrGroupTop1: number
    nbrGroupTop5: number
    nbrGroupTop100: number
    player_names: { name: string, platform_id: number }[]
    icon_filename: string
}

export interface DB_GUILD_INFO extends GUILD_INFO, RowDataPacket { }
type GUILD_INFO = {
    id: number
    icon_filename: string
    discord_link: string
    detail_html: string
    name: string
    tag: string
    rating: string
    nbrTop1: string
    nbrTop5: string
    nbrTop20: string
    nbrTop100: string
    totalLevelCleared: string
}

export interface DB_GUILD_GAUNTLET_STAT_ITEM extends GUILD_GAUNTLET_STAT_ITEM, RowDataPacket { }
export type GUILD_GAUNTLET_STAT_ITEM = {
    season: number
    rank: number
}

export interface DB_TRIAL_LIST_ITEM extends TRIAL_LIST_ITEM, RowDataPacket { }
export type TRIAL_LIST_ITEM = {
    week: number
    behemoth_name: string
    start_at: Date
    end_at: Date
    solo_player: { role_id: string, weapon_id: number }[]
    solo_completion_time: number
    group_players: { role_id: string, weapon_id: number }[]
    group_completion_time: number
}

export interface DB_PLAYER_TRIAL_ITEM extends PLAYER_TRIAL_ITEM, RowDataPacket { }
export type PLAYER_TRIAL_ITEM = {
    trial_leaderboard_item_type_id: number
    week: number
    behemoth_name: string
    rank: number
    players: {
        player_id: number
        weapon_id: number
        role_id: string
        player_name: string
        platform_id: number
        player_icon_filename: string
    }[],
    completion_time: number
    start_at: Date
    end_at: Date
}

// API
export type API_DASHBOARD = {
    current_season_info: SEASON_INFO
    current_season_leaderboard: SEASON_LEADERBOARD[]
    current_trial_info: TRIAL_INFO
    current_trial_leaderboard_solo: TRIAL_LEADERBOARD[]
    current_trial_leaderboard_group: TRIAL_LEADERBOARD[]
}

export type API_ME = {
    player: PLAYER_ME
    guild: GUILD_ME
}

export type API_SEASON = {
    all_seasons_info: SEASON_INFO[]
    season_info: SEASON_INFO
    season_leaderboard: SEASON_LEADERBOARD[]
}

type API_DATA_LIST<T> = {
    data: T[]
    total: number
}

export type API_GUILD_LIST = API_DATA_LIST<GUILD_LIST_ITEM>

export type API_TRIAL_LIST = API_DATA_LIST<TRIAL_LIST_ITEM>

export type API_PLAYER_LIST = API_DATA_LIST<PLAYER_LIST_ITEM>

export type API_GUILD = {
    guild_info: GUILD_LIST_ITEM
    guild_gauntlet_stats: GUILD_GAUNTLET_STAT_ITEM[]
}

export type API_TRIAL = {
    info: TRIAL_INFO
    all_leaderboard: TRIAL_LEADERBOARD[]
    group_leaderboard: TRIAL_LEADERBOARD[]
    hammer_leaderboard: TRIAL_LEADERBOARD[]
    axe_leaderboard: TRIAL_LEADERBOARD[]
    sword_leaderboard: TRIAL_LEADERBOARD[]
    chainblades_leaderboard: TRIAL_LEADERBOARD[]
    repeaters_leaderboard: TRIAL_LEADERBOARD[]
    pike_leaderboard: TRIAL_LEADERBOARD[]
    strikers_leaderboard: TRIAL_LEADERBOARD[]
}

export type API_PLAYER = {
    player_info: {
        id: number,
        icon_filename: string
        names: { name: string, platform_id: number }[]
    },
    player_trials: PLAYER_TRIAL_ITEM[]
}