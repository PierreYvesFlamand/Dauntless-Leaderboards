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

export interface GAUNTLET_LEADERBOARD_ITEM extends RowDataPacket {
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
}

export interface SEASON_LEADERBAORD_ITEM extends RowDataPacket {
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
    start_at: Date
    end_at: Date
    last_updated: Date
}

export interface TRIAL_LEADERBAORD_ITEM extends RowDataPacket {
    rank: number
    completion_time: number
    weapon_id: number
    role_id: string
    player_id: number
    player_name: string
    player_icon_filename: string | null
    platform_id: number
}

export type DASHBOARD_DATA = {
    season_info: SEASON_INFO
    season_leaderbaord: SEASON_LEADERBAORD_ITEM[]
    trial_info: TRIAL_INFO
    trial_leaderbaord: TRIAL_LEADERBAORD_ITEM
}