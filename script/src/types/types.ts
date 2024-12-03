// GAUNTLET
export type DAUNTLESS_GAUNTLET_ALL_SEASONS = {
    active_season: DAUNTLESS_GAUNTLET_ALL_SEASONS_DETAIL
    past_seasons: DAUNTLESS_GAUNTLET_ALL_SEASONS_DETAIL[]
}

export type DAUNTLESS_GAUNTLET_ALL_SEASONS_DETAIL = {
    end_at: Date
    gauntlet_id: string
    start_at: Date
}

export type DAUNTLESS_GAUNTLET_SEASON = {
    last_updated: Date
    end_at: Date
    leaderboard: DAUNTLESS_GAUNTLET_SEASON_LEADERBOARD_ITEM[]
}

export type DAUNTLESS_GAUNTLET_SEASON_LEADERBOARD_ITEM = {
    guild_name: string
    guild_nameplate: string
    level: number
    remaining_sec: number
}

export type DAUNTLESS_GAUNTLET_SEASON_FORMATED = {
    start_at: Date
    end_at: Date
    last_updated: Date
    leaderboard: DAUNTLESS_GAUNTLET_SEASON_LEADERBOARD_ITEM[]
}

export type GAUNTLET_SEASON = {
    startAt: Date
    endAt: Date
    lastUpdated: Date
    leaderboard: GAUNTLET_SEASON_LEADERBOARD_ITEM[]
}

export type GAUNTLET_SEASON_LEADERBOARD_ITEM = {
    guildId: number
    guildNameTag?: string
    rank: number
    level: number
    remainingSec: number
}

// GUILD
export type GUILD = {
    id: number
    name: string
    tag: string
}

export type GUILD_DATA = {
    guildId: number
    iconFilename: string
    discordLink: string
    detailHtml: string
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

export type TRIAL = {
    info: TRIAL_INFO
    all: TRIAL_LEADERBOARD[]
    group: TRIAL_LEADERBOARD[]
    hammer: TRIAL_LEADERBOARD[]
    axe: TRIAL_LEADERBOARD[]
    sword: TRIAL_LEADERBOARD[]
    chainblades: TRIAL_LEADERBOARD[]
    repeaters: TRIAL_LEADERBOARD[]
    pike: TRIAL_LEADERBOARD[]
    strikers: TRIAL_LEADERBOARD[]
}

export type TRIAL_INFO = {
    week: number
    behemothId: number
    startAt: Date
    endAt: Date
    lastUpdated: Date
}

export type TRIAL_LEADERBOARD = {
    rank: number
    completionTime: number
    objectivesCompleted: number
    players: TRIAL_LEADERBOARD_PLAYER[]
}

export type TRIAL_LEADERBOARD_PLAYER = {
    roleId: number | null
    playerId: number
    weaponId: number
    platformId: number
}

export type BEHEMOTH = {
    id: number
    name: string
}

export type PLATFORM = {
    id: number
    name: string
}

export type ROLE = {
    id: number
    name: string
}

export type WEAPON = {
    id: number
    name: string
}

// PLAYER
export type PLAYER = {
    id: number
    phxId: string
    names: { platformId: number, name: string }[]
}

export type PLAYER_DATA = {
    playerId: number,
    iconFilename: string
}

// ALL DATA
export type ALL_DATA = {
    gauntlets: GAUNTLET_SEASON[]
    guilds: GUILD[]
    guildsData: GUILD_DATA[]
    trials: TRIAL[]
    behemoths: BEHEMOTH[]
    players: PLAYER[]
    platforms: PLATFORM[]
    roles: ROLE[]
    weapons: WEAPON[]
}