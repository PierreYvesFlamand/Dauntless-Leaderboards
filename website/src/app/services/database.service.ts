import { Injectable } from '@angular/core';
import pako from 'pako'

import { ALL_DATA, BEHEMOTH, DAUNTLESS_GAUNTLET_SEASON, GAUNTLET_SEASON_LEADERBOARD_ITEM, GUILD_DATA } from '../../../../script/src/types/types';

export type WEBSITE_GAUNTLET = {
    allGauntletsInfo: GAUNTLET_INFO[]
    gauntletInfo: GAUNTLET_INFO
    gauntletLeaderboard: GAUNTLET_LEADERBOARD[]
}

type GAUNTLET_INFO = {
    season: number
    startAt: Date
    endAt: Date
    lastUpdated: Date
    flourishId?: number
}

type GAUNTLET_LEADERBOARD = {
    rank: number
    guildId: number
    guildIconFilename: string | null
    guildName: string
    guildTag: string
    level: number
    remainingSec: number
}

export type WEBSITE_GUILD = {
    id: number
    iconFilename: string | null
    name: string
    tag: string
    rating: number
    nbrTop1: number
    nbrTop5: number
    nbrTop20: number
    nbrTop100: number
    totalLevelCleared: number
    discordLink: string | null
    detailHtml: string | null
    guildGauntletStats: GUILD_GAUNTLET_STAT_ITEM[]
}

type GUILD_GAUNTLET_STAT_ITEM = {
    season: number
    rank: number
}

export type WEBSITE_DASHBOARD = {
    currentGauntletInfo: GAUNTLET_INFO
    currentGauntletLeaderboard: GAUNTLET_LEADERBOARD[]
    lastTrials: WEBSITE_TRIAL[]
}

export type WEBSITE_TRIAL = {
    week: number
    behemothName: string
    startAt: Date
    endAt: Date
    lastUpdated: Date

    soloPlayer: { roleId: number | null, weaponId: number, secondaryWeaponId: number }[]
    soloCompletionTime: number
    groupPlayers: { roleId: number | null, weaponId: number, secondaryWeaponId: number }[]
    groupCompletionTime: number

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

type TRIAL_LEADERBOARD = {
    rank: number
    completionTime: number
    objectivesCompleted: number
    players: TRIAL_LEADERBOARD_PLAYER[]
}

type TRIAL_LEADERBOARD_PLAYER = {
    roleId: number | null
    playerId: number
    weaponId: number
    secondaryWeaponId: number
    platformId: number
    playerName: string
}

export type WEBSITE_PLAYER = {
    id: number
    nbrSoloTop1: number
    nbrSoloTop5: number
    nbrSoloTop100: number
    nbrSoloTop1PreAwakening: number
    nbrSoloTop5PreAwakening: number
    nbrSoloTop100PreAwakening: number
    nbrSoloTop1PostAwakening: number
    nbrSoloTop5PostAwakening: number
    nbrSoloTop100PostAwakening: number
    nbrGroupTop1: number
    nbrGroupTop5: number
    nbrGroupTop100: number
    nbrGroupTop1PreAwakening: number
    nbrGroupTop5PreAwakening: number
    nbrGroupTop100PreAwakening: number
    nbrGroupTop1PostAwakening: number
    nbrGroupTop5PostAwakening: number
    nbrGroupTop100PostAwakening: number
    playerNames: { name: string, platformId: number }[]
    playerTrials: PLAYER_TRIAL_ITEM[]
}

export type PLAYER_TRIAL_ITEM = {
    trialLeaderboardItemTypeId: number
    week: number
    behemothName: string
    rank: number
    players: TRIAL_LEADERBOARD_PLAYER[],
    completionTime: number
    objectivesCompleted: number
    startAt: Date
    endAt: Date
}

export type WEBSITE_ME = {
    player: {
        id: number
        name: string
    }
    guild: {
        id: number
        tag: string
        iconFilename: string
    }
}

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    public data = {
        loaded: false,
        timestamp: 0,
        gauntlets: [],
        guilds: [],
        behemoths: [],
        trials: [],
        players: []
    } as {
        loaded: boolean
        timestamp: number
        dashboard?: WEBSITE_DASHBOARD
        gauntlets: WEBSITE_GAUNTLET[]
        guilds: WEBSITE_GUILD[]
        behemoths: BEHEMOTH[]
        trials: WEBSITE_TRIAL[]
        players: WEBSITE_PLAYER[]
    };

    public async loadData() {
        let db: any;
        let shouldFetch = false;

        if ('indexedDB' in window) {
            db = await new Promise((resolve, reject) => {
                const request = indexedDB.open('DauntlessLeaderbaordsDATA', 1);

                request.onupgradeneeded = event => {
                    const db = (event.target as any).result;
                    db.createObjectStore('DauntlessLeaderbaordsDATA', { keyPath: 'key' });
                };

                request.onsuccess = event => resolve((event.target as any).result);
                request.onerror = event => reject((event.target as any).error);
            });

            const cachedData: any = await new Promise((resolve, reject) => {
                const transaction = db.transaction('DauntlessLeaderbaordsDATA', 'readonly');
                const store = transaction.objectStore('DauntlessLeaderbaordsDATA');
                const request = store.get('DauntlessLeaderbaordsDATA');

                request.onsuccess = (event: any) => resolve(event.target.result?.data || null);
                request.onerror = (event: any) => reject(event.target.error);
            });

            let timestamp = 9999999999999;
            try {
                const res = await fetch('data/allDataVersion.json');
                timestamp = (await res.json()).timestamp;
            } catch (error) { }

            if (cachedData && timestamp < cachedData.timestamp) { cachedData.loaded = false; this.data = cachedData; db.close(); } else { shouldFetch = true; }
        } else { shouldFetch = true; }

        const res = await fetch('data/allData.json.compressed');
        const arrayBuffer = await res.arrayBuffer();
        const allData = JSON.parse(pako.inflate(new Uint8Array(arrayBuffer), { to: 'string' })) as ALL_DATA;

        // try {
        //     const res = await fetch(`https://storage.googleapis.com/dauntless-gauntlet-leaderboard/production-gauntlet-season${String(allData.gauntlets.length).padStart(2, '0')}.json?_=${new Date()}`);
        //     const dauntlessData = await res.json() as DAUNTLESS_GAUNTLET_SEASON;

        //     // // Bärtiger Bär :)
        //     // // ---------------
        //     // dauntlessData.leaderboard = [...dauntlessData.leaderboard.slice(0, 2), {
        //     //     guild_name: 'ThraxEnjoyers',
        //     //     guild_nameplate: 'THRAAX',
        //     //     level: 800,
        //     //     remaining_sec: 264
        //     // }, ...dauntlessData.leaderboard.slice(2, 99)];
        //     // // ---------------
        //     // // Bärtiger Bär :)

        //     allData.gauntlets[allData.gauntlets.length - 1].lastUpdated = dauntlessData.last_updated;
        //     allData.gauntlets[allData.gauntlets.length - 1].leaderboard = dauntlessData.leaderboard.reduce((arr: GAUNTLET_SEASON_LEADERBOARD_ITEM[], item, index): GAUNTLET_SEASON_LEADERBOARD_ITEM[] => {
        //         return [
        //             ...arr,
        //             {
        //                 guildId: allData.guilds.find(g => g.tag === item.guild_nameplate)?.id || 0,
        //                 guildNameTag: `${item.guild_name}|||${item.guild_nameplate}`,
        //                 rank: index + 1,
        //                 level: item.level,
        //                 remainingSec: item.remaining_sec
        //             }
        //         ]
        //     }, []);

        // } catch (error) { }

        // Guilds
        this.data.guilds = allData.guilds.reduce((arr: WEBSITE_GUILD[], item): WEBSITE_GUILD[] => {
            return [
                ...arr,
                {
                    id: item.id,
                    iconFilename: null,
                    name: item.name,
                    tag: item.tag,
                    rating: 0,
                    nbrTop1: 0,
                    nbrTop5: 0,
                    nbrTop20: 0,
                    nbrTop100: 0,
                    totalLevelCleared: 0,
                    discordLink: null,
                    detailHtml: null,
                    guildGauntletStats: []
                }
            ]
        }, []);

        // // Disable by version V4.2.0
        // try {
        //     const guildsData = await (await fetch('data/guildsData.json')).json() as GUILD_DATA[];

        //     for (const guildData of guildsData) {
        //         this.data.guilds[guildData.guildId - 1].iconFilename = guildData.iconFilename
        //         this.data.guilds[guildData.guildId - 1].discordLink = guildData.discordLink
        //         this.data.guilds[guildData.guildId - 1].detailHtml = guildData.detailHtml
        //     }
        // } catch (error) { }

        // Gauntlets
        const flourishIds = [
            { season: 11, id: 17314108 },
            { season: 12, id: 17498903 },
            { season: 13, id: 18089327 },
            { season: 14, id: 18645276 },
            { season: 15, id: 19083127 },
            { season: 16, id: 19579613 },
            { season: 17, id: 20593913 }
        ]

        this.data.gauntlets = allData.gauntlets.reduce((arr: WEBSITE_GAUNTLET[], item, index): WEBSITE_GAUNTLET[] => {
            return [
                ...arr,
                {
                    allGauntletsInfo: allData.gauntlets.reduce((arr: GAUNTLET_INFO[], item, index): GAUNTLET_INFO[] => {
                        return [
                            ...arr,
                            {
                                season: index + 1,
                                startAt: item.startAt,
                                endAt: item.endAt,
                                lastUpdated: item.lastUpdated
                            }
                        ]
                    }, []),
                    gauntletInfo: {
                        season: index + 1,
                        startAt: item.startAt,
                        endAt: item.endAt,
                        lastUpdated: item.lastUpdated,
                        flourishId: flourishIds.find(f => f.season === index + 1)?.id || undefined
                    },
                    gauntletLeaderboard: item.leaderboard.reduce((arr: GAUNTLET_LEADERBOARD[], item): GAUNTLET_LEADERBOARD[] => {
                        if (item.guildId) {
                            this.data.guilds[item.guildId - 1].totalLevelCleared += item.level;
                            this.data.guilds[item.guildId - 1].guildGauntletStats.push({
                                season: index + 1,
                                rank: item.rank
                            });
                        }

                        return [
                            ...arr,
                            {
                                rank: item.rank,
                                guildId: item.guildId,
                                guildIconFilename: item.guildId ? this.data.guilds[item.guildId - 1].iconFilename : null,
                                guildName: item.guildId ? this.data.guilds[item.guildId - 1].name : (item.guildNameTag?.split('|||')[0] || ''),
                                guildTag: item.guildId ? this.data.guilds[item.guildId - 1].tag : (item.guildNameTag?.split('|||')[1] || ''),
                                level: item.level,
                                remainingSec: item.remainingSec
                            }
                        ]
                    }, [])
                }
            ]
        }, []);

        // Guilds rating
        const alpha = 1.1; // Rapid decay factor to focus on the last two seasons
        const inactivityPenalty = 30; // Penalty for recent inactivity

        let perfectRawRating = 0;
        for (let i = 1; i <= allData.gauntlets.length; i++) {
            const weight = Math.exp(-alpha * (allData.gauntlets.length - i));
            perfectRawRating += Math.floor(100 * weight);
        }

        for (const guild of this.data.guilds) {
            guild.nbrTop1 = guild.guildGauntletStats.filter(gs => gs.rank <= 1).length;
            guild.nbrTop5 = guild.guildGauntletStats.filter(gs => gs.rank <= 5).length;
            guild.nbrTop20 = guild.guildGauntletStats.filter(gs => gs.rank <= 20).length;
            guild.nbrTop100 = guild.guildGauntletStats.filter(gs => gs.rank <= 100).length;

            let guildRawRating = 0;
            let recentSeasons = [false, false]; // Track participation in the last two seasons

            for (const gs of guild.guildGauntletStats) {
                const weight = Math.exp(-alpha * (allData.gauntlets.length - gs.season));
                guildRawRating += Math.floor((100 - gs.rank + 1) * weight);

                // Check participation in the last two seasons
                if (gs.season === allData.gauntlets.length) recentSeasons[0] = true;
                if (gs.season === allData.gauntlets.length - 1) recentSeasons[1] = true;
            }

            // Apply penalty if the guild did not participate in one or both of the last two seasons
            const penalty = recentSeasons.includes(false) ? inactivityPenalty : 0;

            // Final rating calculation, ensuring it doesn't go below zero
            guild.rating = Math.max(0, (100 / perfectRawRating * guildRawRating) - penalty);
        }

        if (!shouldFetch) {
            if (this.data.dashboard) {
                this.data.dashboard.currentGauntletInfo = this.data.gauntlets[this.data.gauntlets.length - 1].gauntletInfo;
                this.data.dashboard.currentGauntletLeaderboard = this.data.gauntlets[this.data.gauntlets.length - 1].gauntletLeaderboard.slice(0, 10);
            }
            this.data.loaded = true;
            return;
        }

        // Behemoths
        this.data.behemoths = allData.behemoths;

        // Players
        this.data.players = allData.players.reduce((arr: WEBSITE_PLAYER[], item): WEBSITE_PLAYER[] => {
            return [
                ...arr,
                {
                    id: item.id,
                    nbrSoloTop1: 0,
                    nbrSoloTop5: 0,
                    nbrSoloTop100: 0,
                    nbrSoloTop1PreAwakening: 0,
                    nbrSoloTop5PreAwakening: 0,
                    nbrSoloTop100PreAwakening: 0,
                    nbrSoloTop1PostAwakening: 0,
                    nbrSoloTop5PostAwakening: 0,
                    nbrSoloTop100PostAwakening: 0,
                    nbrGroupTop1: 0,
                    nbrGroupTop5: 0,
                    nbrGroupTop100: 0,
                    nbrGroupTop1PreAwakening: 0,
                    nbrGroupTop5PreAwakening: 0,
                    nbrGroupTop100PreAwakening: 0,
                    nbrGroupTop1PostAwakening: 0,
                    nbrGroupTop5PostAwakening: 0,
                    nbrGroupTop100PostAwakening: 0,
                    playerNames: item.names,
                    playerTrials: []
                }
            ]
        }, []);

        // trials
        this.data.trials = allData.trials.reverse().reduce((arr: WEBSITE_TRIAL[], trial): WEBSITE_TRIAL[] => {
            return [
                ...arr,
                trial.info.week === 282 || trial.info.week === 283 ?
                    {
                        week: trial.info.week,
                        behemothName: allData.behemoths[trial.info.behemothId - 1].name,
                        startAt: trial.info.startAt,
                        endAt: trial.info.endAt,
                        lastUpdated: trial.info.lastUpdated,
                        soloPlayer: [],
                        soloCompletionTime: 0,
                        groupPlayers: [],
                        groupCompletionTime: 0,
                        all: [],
                        group: [],
                        axe: [],
                        sword: [],
                        chainblades: [],
                        repeaters: [],
                        strikers: [],
                        hammer: [],
                        pike: []
                    } :
                    {
                        week: trial.info.week,
                        behemothName: allData.behemoths[trial.info.behemothId - 1].name,
                        startAt: trial.info.startAt,
                        endAt: trial.info.endAt,
                        lastUpdated: trial.info.lastUpdated,

                        soloPlayer: [{ roleId: trial.all[0].players[0].roleId, weaponId: trial.all[0].players[0].weaponId, secondaryWeaponId: trial.all[0].players[0].secondaryWeaponId }],
                        soloCompletionTime: trial.all[0].completionTime,
                        groupPlayers: trial.group[0].players.reduce((arr: { roleId: number | null, weaponId: number, secondaryWeaponId: number }[], item): { roleId: number | null, weaponId: number, secondaryWeaponId: number }[] => {
                            return [...arr, { roleId: item.roleId, weaponId: item.weaponId, secondaryWeaponId: item.secondaryWeaponId }];
                        }, []),
                        groupCompletionTime: trial.group[0].completionTime,

                        all: trial.all.reduce((arr: TRIAL_LEADERBOARD[], item): TRIAL_LEADERBOARD[] => {
                            return [
                                ...arr,
                                {
                                    rank: item.rank,
                                    completionTime: item.completionTime,
                                    objectivesCompleted: item.objectivesCompleted,
                                    players: item.players.reduce((arr: TRIAL_LEADERBOARD_PLAYER[], player): TRIAL_LEADERBOARD_PLAYER[] => {
                                        if (item.rank <= 1) this.data.players[player.playerId - 1].nbrSoloTop1++;
                                        if (item.rank <= 5) this.data.players[player.playerId - 1].nbrSoloTop5++;
                                        if (item.rank <= 100) this.data.players[player.playerId - 1].nbrSoloTop100++;
                                        if (trial.info.week < 282 && item.rank <= 1) this.data.players[player.playerId - 1].nbrSoloTop1PreAwakening++;
                                        if (trial.info.week < 282 && item.rank <= 5) this.data.players[player.playerId - 1].nbrSoloTop5PreAwakening++;
                                        if (trial.info.week < 282 && item.rank <= 100) this.data.players[player.playerId - 1].nbrSoloTop100PreAwakening++;
                                        if (trial.info.week >= 282 && item.rank <= 1) this.data.players[player.playerId - 1].nbrSoloTop1PostAwakening++;
                                        if (trial.info.week >= 282 && item.rank <= 5) this.data.players[player.playerId - 1].nbrSoloTop5PostAwakening++;
                                        if (trial.info.week >= 282 && item.rank <= 100) this.data.players[player.playerId - 1].nbrSoloTop100PostAwakening++;

                                        this.data.players[player.playerId - 1].playerTrials.push({
                                            trialLeaderboardItemTypeId: 1,
                                            week: trial.info.week,
                                            behemothName: allData.behemoths[trial.info.behemothId - 1].name,
                                            rank: item.rank,
                                            players: item.players.reduce((arr: TRIAL_LEADERBOARD_PLAYER[], item): TRIAL_LEADERBOARD_PLAYER[] => {
                                                return [...arr, {
                                                    platformId: item.platformId,
                                                    playerId: item.playerId,
                                                    roleId: item.roleId,
                                                    weaponId: item.weaponId,
                                                    secondaryWeaponId: item.secondaryWeaponId,
                                                    playerName: allData.players[item.playerId - 1].names.find(n => n.platformId === item.platformId)?.name || ''
                                                }];
                                            }, []),
                                            completionTime: item.completionTime,
                                            objectivesCompleted: item.objectivesCompleted,
                                            startAt: trial.info.startAt,
                                            endAt: trial.info.endAt
                                        });

                                        return [
                                            ...arr,
                                            {
                                                platformId: player.platformId,
                                                playerId: player.playerId,
                                                roleId: player.roleId,
                                                weaponId: player.weaponId,
                                                secondaryWeaponId: player.secondaryWeaponId,
                                                playerName: allData.players[player.playerId - 1].names.find(n => n.platformId === player.platformId)?.name || ''
                                            }
                                        ]
                                    }, []),
                                }
                            ]
                        }, []),
                        group: trial.group.reduce((arr: TRIAL_LEADERBOARD[], item): TRIAL_LEADERBOARD[] => {
                            return [
                                ...arr,
                                {
                                    rank: item.rank,
                                    completionTime: item.completionTime,
                                    objectivesCompleted: item.objectivesCompleted,
                                    players: item.players.reduce((arr: TRIAL_LEADERBOARD_PLAYER[], player): TRIAL_LEADERBOARD_PLAYER[] => {
                                        if (item.rank <= 1) this.data.players[player.playerId - 1].nbrGroupTop1++;
                                        if (item.rank <= 5) this.data.players[player.playerId - 1].nbrGroupTop5++;
                                        if (item.rank <= 100) this.data.players[player.playerId - 1].nbrGroupTop100++;
                                        if (trial.info.week < 282 && item.rank <= 1) this.data.players[player.playerId - 1].nbrGroupTop1PreAwakening++;
                                        if (trial.info.week < 282 && item.rank <= 5) this.data.players[player.playerId - 1].nbrGroupTop5PreAwakening++;
                                        if (trial.info.week < 282 && item.rank <= 100) this.data.players[player.playerId - 1].nbrGroupTop100PreAwakening++;
                                        if (trial.info.week >= 282 && item.rank <= 1) this.data.players[player.playerId - 1].nbrGroupTop1PostAwakening++;
                                        if (trial.info.week >= 282 && item.rank <= 5) this.data.players[player.playerId - 1].nbrGroupTop5PostAwakening++;
                                        if (trial.info.week >= 282 && item.rank <= 100) this.data.players[player.playerId - 1].nbrGroupTop100PostAwakening++;

                                        this.data.players[player.playerId - 1].playerTrials.push({
                                            trialLeaderboardItemTypeId: 2,
                                            week: trial.info.week,
                                            behemothName: allData.behemoths[trial.info.behemothId - 1].name,
                                            rank: item.rank,
                                            players: item.players.reduce((arr: TRIAL_LEADERBOARD_PLAYER[], item): TRIAL_LEADERBOARD_PLAYER[] => {
                                                return [...arr, {
                                                    platformId: item.platformId,
                                                    playerId: item.playerId,
                                                    roleId: item.roleId,
                                                    weaponId: item.weaponId,
                                                    secondaryWeaponId: item.secondaryWeaponId,
                                                    playerName: allData.players[item.playerId - 1].names.find(n => n.platformId === item.platformId)?.name || ''
                                                }];
                                            }, []),
                                            completionTime: item.completionTime,
                                            objectivesCompleted: item.objectivesCompleted,
                                            startAt: trial.info.startAt,
                                            endAt: trial.info.endAt
                                        });

                                        return [
                                            ...arr,
                                            {
                                                platformId: player.platformId,
                                                playerId: player.playerId,
                                                roleId: player.roleId,
                                                weaponId: player.weaponId,
                                                secondaryWeaponId: player.secondaryWeaponId,
                                                playerName: allData.players[player.playerId - 1].names.find(n => n.platformId === player.platformId)?.name || ''
                                            }
                                        ]
                                    }, []),
                                }
                            ]
                        }, []),
                        hammer: trial.hammer.reduce((arr: TRIAL_LEADERBOARD[], item): TRIAL_LEADERBOARD[] => {
                            return [
                                ...arr,
                                {
                                    rank: item.rank,
                                    completionTime: item.completionTime,
                                    objectivesCompleted: item.objectivesCompleted,
                                    players: item.players.reduce((arr: TRIAL_LEADERBOARD_PLAYER[], player): TRIAL_LEADERBOARD_PLAYER[] => {

                                        this.data.players[player.playerId - 1].playerTrials.push({
                                            trialLeaderboardItemTypeId: 5,
                                            week: trial.info.week,
                                            behemothName: allData.behemoths[trial.info.behemothId - 1].name,
                                            rank: item.rank,
                                            players: item.players.reduce((arr: TRIAL_LEADERBOARD_PLAYER[], item): TRIAL_LEADERBOARD_PLAYER[] => {
                                                return [...arr, {
                                                    platformId: item.platformId,
                                                    playerId: item.playerId,
                                                    roleId: item.roleId,
                                                    weaponId: item.weaponId,
                                                    secondaryWeaponId: item.secondaryWeaponId,
                                                    playerName: allData.players[item.playerId - 1].names.find(n => n.platformId === item.platformId)?.name || ''
                                                }];
                                            }, []),
                                            completionTime: item.completionTime,
                                            objectivesCompleted: item.objectivesCompleted,
                                            startAt: trial.info.startAt,
                                            endAt: trial.info.endAt
                                        });

                                        return [
                                            ...arr,
                                            {
                                                platformId: player.platformId,
                                                playerId: player.playerId,
                                                roleId: player.roleId,
                                                weaponId: player.weaponId,
                                                secondaryWeaponId: player.secondaryWeaponId,
                                                playerName: allData.players[player.playerId - 1].names.find(n => n.platformId === player.platformId)?.name || ''
                                            }
                                        ]
                                    }, []),
                                }
                            ]
                        }, []),
                        axe: trial.axe.reduce((arr: TRIAL_LEADERBOARD[], item): TRIAL_LEADERBOARD[] => {
                            return [
                                ...arr,
                                {
                                    rank: item.rank,
                                    completionTime: item.completionTime,
                                    objectivesCompleted: item.objectivesCompleted,
                                    players: item.players.reduce((arr: TRIAL_LEADERBOARD_PLAYER[], player): TRIAL_LEADERBOARD_PLAYER[] => {

                                        this.data.players[player.playerId - 1].playerTrials.push({
                                            trialLeaderboardItemTypeId: 4,
                                            week: trial.info.week,
                                            behemothName: allData.behemoths[trial.info.behemothId - 1].name,
                                            rank: item.rank,
                                            players: item.players.reduce((arr: TRIAL_LEADERBOARD_PLAYER[], item): TRIAL_LEADERBOARD_PLAYER[] => {
                                                return [...arr, {
                                                    platformId: item.platformId,
                                                    playerId: item.playerId,
                                                    roleId: item.roleId,
                                                    weaponId: item.weaponId,
                                                    secondaryWeaponId: item.secondaryWeaponId,
                                                    playerName: allData.players[item.playerId - 1].names.find(n => n.platformId === item.platformId)?.name || ''
                                                }];
                                            }, []),
                                            completionTime: item.completionTime,
                                            objectivesCompleted: item.objectivesCompleted,
                                            startAt: trial.info.startAt,
                                            endAt: trial.info.endAt
                                        });

                                        return [
                                            ...arr,
                                            {
                                                platformId: player.platformId,
                                                playerId: player.playerId,
                                                roleId: player.roleId,
                                                weaponId: player.weaponId,
                                                secondaryWeaponId: player.secondaryWeaponId,
                                                playerName: allData.players[player.playerId - 1].names.find(n => n.platformId === player.platformId)?.name || ''
                                            }
                                        ]
                                    }, []),
                                }
                            ]
                        }, []),
                        sword: trial.sword.reduce((arr: TRIAL_LEADERBOARD[], item): TRIAL_LEADERBOARD[] => {
                            return [
                                ...arr,
                                {
                                    rank: item.rank,
                                    completionTime: item.completionTime,
                                    objectivesCompleted: item.objectivesCompleted,
                                    players: item.players.reduce((arr: TRIAL_LEADERBOARD_PLAYER[], player): TRIAL_LEADERBOARD_PLAYER[] => {

                                        this.data.players[player.playerId - 1].playerTrials.push({
                                            trialLeaderboardItemTypeId: 3,
                                            week: trial.info.week,
                                            behemothName: allData.behemoths[trial.info.behemothId - 1].name,
                                            rank: item.rank,
                                            players: item.players.reduce((arr: TRIAL_LEADERBOARD_PLAYER[], item): TRIAL_LEADERBOARD_PLAYER[] => {
                                                return [...arr, {
                                                    platformId: item.platformId,
                                                    playerId: item.playerId,
                                                    roleId: item.roleId,
                                                    weaponId: item.weaponId,
                                                    secondaryWeaponId: item.secondaryWeaponId,
                                                    playerName: allData.players[item.playerId - 1].names.find(n => n.platformId === item.platformId)?.name || ''
                                                }];
                                            }, []),
                                            completionTime: item.completionTime,
                                            objectivesCompleted: item.objectivesCompleted,
                                            startAt: trial.info.startAt,
                                            endAt: trial.info.endAt
                                        });

                                        return [
                                            ...arr,
                                            {
                                                platformId: player.platformId,
                                                playerId: player.playerId,
                                                roleId: player.roleId,
                                                weaponId: player.weaponId,
                                                secondaryWeaponId: player.secondaryWeaponId,
                                                playerName: allData.players[player.playerId - 1].names.find(n => n.platformId === player.platformId)?.name || ''
                                            }
                                        ]
                                    }, []),
                                }
                            ]
                        }, []),
                        chainblades: trial.chainblades.reduce((arr: TRIAL_LEADERBOARD[], item): TRIAL_LEADERBOARD[] => {
                            return [
                                ...arr,
                                {
                                    rank: item.rank,
                                    completionTime: item.completionTime,
                                    objectivesCompleted: item.objectivesCompleted,
                                    players: item.players.reduce((arr: TRIAL_LEADERBOARD_PLAYER[], player): TRIAL_LEADERBOARD_PLAYER[] => {

                                        this.data.players[player.playerId - 1].playerTrials.push({
                                            trialLeaderboardItemTypeId: 6,
                                            week: trial.info.week,
                                            behemothName: allData.behemoths[trial.info.behemothId - 1].name,
                                            rank: item.rank,
                                            players: item.players.reduce((arr: TRIAL_LEADERBOARD_PLAYER[], item): TRIAL_LEADERBOARD_PLAYER[] => {
                                                return [...arr, {
                                                    platformId: item.platformId,
                                                    playerId: item.playerId,
                                                    roleId: item.roleId,
                                                    weaponId: item.weaponId,
                                                    secondaryWeaponId: item.secondaryWeaponId,
                                                    playerName: allData.players[item.playerId - 1].names.find(n => n.platformId === item.platformId)?.name || ''
                                                }];
                                            }, []),
                                            completionTime: item.completionTime,
                                            objectivesCompleted: item.objectivesCompleted,
                                            startAt: trial.info.startAt,
                                            endAt: trial.info.endAt
                                        });

                                        return [
                                            ...arr,
                                            {
                                                platformId: player.platformId,
                                                playerId: player.playerId,
                                                roleId: player.roleId,
                                                weaponId: player.weaponId,
                                                secondaryWeaponId: player.secondaryWeaponId,
                                                playerName: allData.players[player.playerId - 1].names.find(n => n.platformId === player.platformId)?.name || ''
                                            }
                                        ]
                                    }, []),
                                }
                            ]
                        }, []),
                        repeaters: trial.repeaters.reduce((arr: TRIAL_LEADERBOARD[], item): TRIAL_LEADERBOARD[] => {
                            return [
                                ...arr,
                                {
                                    rank: item.rank,
                                    completionTime: item.completionTime,
                                    objectivesCompleted: item.objectivesCompleted,
                                    players: item.players.reduce((arr: TRIAL_LEADERBOARD_PLAYER[], player): TRIAL_LEADERBOARD_PLAYER[] => {

                                        this.data.players[player.playerId - 1].playerTrials.push({
                                            trialLeaderboardItemTypeId: 8,
                                            week: trial.info.week,
                                            behemothName: allData.behemoths[trial.info.behemothId - 1].name,
                                            rank: item.rank,
                                            players: item.players.reduce((arr: TRIAL_LEADERBOARD_PLAYER[], item): TRIAL_LEADERBOARD_PLAYER[] => {
                                                return [...arr, {
                                                    platformId: item.platformId,
                                                    playerId: item.playerId,
                                                    roleId: item.roleId,
                                                    weaponId: item.weaponId,
                                                    secondaryWeaponId: item.secondaryWeaponId,
                                                    playerName: allData.players[item.playerId - 1].names.find(n => n.platformId === item.platformId)?.name || ''
                                                }];
                                            }, []),
                                            completionTime: item.completionTime,
                                            objectivesCompleted: item.objectivesCompleted,
                                            startAt: trial.info.startAt,
                                            endAt: trial.info.endAt
                                        });

                                        return [
                                            ...arr,
                                            {
                                                platformId: player.platformId,
                                                playerId: player.playerId,
                                                roleId: player.roleId,
                                                weaponId: player.weaponId,
                                                secondaryWeaponId: player.secondaryWeaponId,
                                                playerName: allData.players[player.playerId - 1].names.find(n => n.platformId === player.platformId)?.name || ''
                                            }
                                        ]
                                    }, []),
                                }
                            ]
                        }, []),
                        pike: trial.pike.reduce((arr: TRIAL_LEADERBOARD[], item): TRIAL_LEADERBOARD[] => {
                            return [
                                ...arr,
                                {
                                    rank: item.rank,
                                    completionTime: item.completionTime,
                                    objectivesCompleted: item.objectivesCompleted,
                                    players: item.players.reduce((arr: TRIAL_LEADERBOARD_PLAYER[], player): TRIAL_LEADERBOARD_PLAYER[] => {

                                        this.data.players[player.playerId - 1].playerTrials.push({
                                            trialLeaderboardItemTypeId: 7,
                                            week: trial.info.week,
                                            behemothName: allData.behemoths[trial.info.behemothId - 1].name,
                                            rank: item.rank,
                                            players: item.players.reduce((arr: TRIAL_LEADERBOARD_PLAYER[], item): TRIAL_LEADERBOARD_PLAYER[] => {
                                                return [...arr, {
                                                    platformId: item.platformId,
                                                    playerId: item.playerId,
                                                    roleId: item.roleId,
                                                    weaponId: item.weaponId,
                                                    secondaryWeaponId: item.secondaryWeaponId,
                                                    playerName: allData.players[item.playerId - 1].names.find(n => n.platformId === item.platformId)?.name || ''
                                                }];
                                            }, []),
                                            completionTime: item.completionTime,
                                            objectivesCompleted: item.objectivesCompleted,
                                            startAt: trial.info.startAt,
                                            endAt: trial.info.endAt
                                        });

                                        return [
                                            ...arr,
                                            {
                                                platformId: player.platformId,
                                                playerId: player.playerId,
                                                roleId: player.roleId,
                                                weaponId: player.weaponId,
                                                secondaryWeaponId: player.secondaryWeaponId,
                                                playerName: allData.players[player.playerId - 1].names.find(n => n.platformId === player.platformId)?.name || ''
                                            }
                                        ]
                                    }, []),
                                }
                            ]
                        }, []),
                        strikers: trial.strikers.reduce((arr: TRIAL_LEADERBOARD[], item): TRIAL_LEADERBOARD[] => {
                            return [
                                ...arr,
                                {
                                    rank: item.rank,
                                    completionTime: item.completionTime,
                                    objectivesCompleted: item.objectivesCompleted,
                                    players: item.players.reduce((arr: TRIAL_LEADERBOARD_PLAYER[], player): TRIAL_LEADERBOARD_PLAYER[] => {

                                        this.data.players[player.playerId - 1].playerTrials.push({
                                            trialLeaderboardItemTypeId: 9,
                                            week: trial.info.week,
                                            behemothName: allData.behemoths[trial.info.behemothId - 1].name,
                                            rank: item.rank,
                                            players: item.players.reduce((arr: TRIAL_LEADERBOARD_PLAYER[], item): TRIAL_LEADERBOARD_PLAYER[] => {
                                                return [...arr, {
                                                    platformId: item.platformId,
                                                    playerId: item.playerId,
                                                    roleId: item.roleId,
                                                    weaponId: item.weaponId,
                                                    secondaryWeaponId: item.secondaryWeaponId,
                                                    playerName: allData.players[item.playerId - 1].names.find(n => n.platformId === item.platformId)?.name || ''
                                                }];
                                            }, []),
                                            completionTime: item.completionTime,
                                            objectivesCompleted: item.objectivesCompleted,
                                            startAt: trial.info.startAt,
                                            endAt: trial.info.endAt
                                        });

                                        return [
                                            ...arr,
                                            {
                                                platformId: player.platformId,
                                                playerId: player.playerId,
                                                roleId: player.roleId,
                                                weaponId: player.weaponId,
                                                secondaryWeaponId: player.secondaryWeaponId,
                                                playerName: allData.players[player.playerId - 1].names.find(n => n.platformId === player.platformId)?.name || ''
                                            }
                                        ]
                                    }, []),
                                }
                            ]
                        }, [])
                    }
            ]
        }, []);

        // Dashboard
        this.data.dashboard = {
            currentGauntletInfo: this.data.gauntlets[this.data.gauntlets.length - 1].gauntletInfo,
            currentGauntletLeaderboard: this.data.gauntlets[this.data.gauntlets.length - 1].gauntletLeaderboard.slice(0, 10),
            lastTrials: this.data.trials.slice(0, 10)
        }

        // Done
        this.data.timestamp = new Date().getTime();
        this.data.loaded = true;

        if ('indexedDB' in window) {
            const transaction = db.transaction('DauntlessLeaderbaordsDATA', 'readwrite');
            const store = transaction.objectStore('DauntlessLeaderbaordsDATA');
            store.put({ key: 'DauntlessLeaderbaordsDATA', data: this.data });
            db.close();
        }
    }
}