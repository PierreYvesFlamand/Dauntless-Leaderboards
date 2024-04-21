import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ALL_GUILDS, ALL_PLAYERS_PERKS, ALL_SEASONS, ALL_SLAYERS, ALL_TRIALS, TRIAL_DETAIL, ALL_GUILDS_PERKS, ALL_GUILDS_DETAILS } from '../../../../server/src/types';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public allSeasons: ALL_SEASONS = {};
  public allGuilds: ALL_GUILDS = [];
  public currentTrial?: TRIAL_DETAIL;
  public allSlayers: ALL_SLAYERS = {};
  public allTrials: ALL_TRIALS = {};
  public allPlayersPerks: ALL_PLAYERS_PERKS = {};
  public allGuildsPerks: ALL_GUILDS_PERKS = {};
  public allGuildsDetails: ALL_GUILDS_DETAILS = {};

  public async init() {
    await Promise.all([
      this.initAllSeasons(),
      this.initCurrentTrial(),
      this.initAllSlayers(),
      this.initAllTrials(),
      this.initAllPlayersPerks(),
      this.initAllGuildsPerks(),
      this.initAllGuildsDetails()
    ]);
  }

  // All seasons
  public async initAllSeasons(): Promise<void> {
    const res = await fetch(`${environment.backendUrl}/data/all-seasons.json`);
    this.allSeasons = await res.json();

    // Guild rating
    const maxRawRating = this.getMaxGuildRawRating(Object.keys(this.allSeasons).length);

    for (const gauntletId of Object.keys(this.allSeasons).reverse()) {
      this.allSeasons[gauntletId].leaderboard.forEach((leaderboardItem, index) => {
        let guild = this.allGuilds.find(g => g.guildNameplate === leaderboardItem.guildNameplate);

        if (!guild) {
          guild = {
            guildName: leaderboardItem.guildName,
            guildNameplate: leaderboardItem.guildNameplate,
            leaderboardPositions: [],
            totalLevelCompleted: 0,
            nbrOfTop1: 0,
            nbrOfTop5: 0,
            nbrOfTop100: 0,
            rawRating: 0,
            rating: 0
          };

          this.allGuilds.push(guild);
        }

        guild.leaderboardPositions.push({
          [gauntletId]: index + 1
        });
        guild.totalLevelCompleted += leaderboardItem.level;
        if (index + 1 === 1) { guild.nbrOfTop1++; }
        if (index + 1 <= 5) { guild.nbrOfTop5++; }
        guild.nbrOfTop100++;
        guild.rawRating += Math.floor((100 - index) * (Number(gauntletId.slice(15)) / Object.keys(this.allSeasons).length));
      });
    }

    this.allGuilds = this.allGuilds.map(g => ({ ...g, rating: (100 / maxRawRating) * g.rawRating }));
  }

  public getSeasonNumber(seasonId: string): number {
    return Number(seasonId.slice(15));
  }

  // All guilds
  public getMaxGuildRawRating(nbrOfSeason: number): number {
    let maxRawRating = 0;
    for (let i = 1; i <= nbrOfSeason; i++) {
      maxRawRating += Math.floor(100 * (i / nbrOfSeason));
    }
    return maxRawRating;
  }

  // Current trial
  public async initCurrentTrial(): Promise<void> {
    const res = await fetch(`${environment.backendUrl}/data/current-trial.json`);
    this.currentTrial = await res.json();
  }

  // All Slayers
  public async initAllSlayers(): Promise<void> {
    const res = await fetch(`${environment.backendUrl}/data/all-slayers.json`);
    this.allSlayers = await res.json();
  }

  // All Trials
  public async initAllTrials(): Promise<void> {
    const res = await fetch(`${environment.backendUrl}/data/all-trials.json`);
    this.allTrials = await res.json();
  }

  // Patreon
  public async initAllPlayersPerks(): Promise<void> {
    const res = await fetch(`${environment.backendUrl}/data/players-perks.json`);
    this.allPlayersPerks = await res.json();
  }
  public async initAllGuildsPerks(): Promise<void> {
    const res = await fetch(`${environment.backendUrl}/data/guilds-perks.json`);
    this.allGuildsPerks = await res.json();
  }
  public async initAllGuildsDetails(): Promise<void> {
    const res = await fetch(`${environment.backendUrl}/data/guilds-details.json`);
    this.allGuildsDetails = await res.json();
  }
}
