import { Component } from '@angular/core';
import { DatabaseService, WEBSITE_GUILD } from '../../../services/database.service';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RANK_CHART_POINT } from '../../../components/rank-chart/rank-chart.component';

type SEASON_HISTORY_ITEM = {
  season: number
  rank: number
  level: number | null
}

type GUILD_STATS = {
  scoreRank: number
  totalGuilds: number
  bestRank: number
  bestRankCount: number
  averageRank: number
  longestTop10Streak: number
  firstSeason: number
  lastSeason: number
}

@Component({
  selector: 'dl-guild-detail',
  templateUrl: './guild-detail.component.html',
  styleUrl: './guild-detail.component.scss',
  standalone: false
})
export class GuildDetailComponent {
  public guildData?: WEBSITE_GUILD;
  public seasonHistory: SEASON_HISTORY_ITEM[] = [];
  public chartPoints: RANK_CHART_POINT[] = [];
  public stats?: GUILD_STATS;

  constructor(
    private databaseService: DatabaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public sharedService: SharedService
  ) {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'] || -1;
      if (id < 0 || isNaN(id)) this.router.navigate(['guilds']);
      this.fetchData(id);
    });
  }

  public fetchData(id: number) {
    this.guildData = this.databaseService.data.guilds[id - 1]
    if (!this.guildData) {
      this.router.navigate(['guilds']);
      return;
    }
    const guild = this.guildData;
    const { gauntlets, guilds } = this.databaseService.data;

    const getLevel = (season: number) => gauntlets[season - 1]?.gauntletLeaderboard.find(item => item.guildId === guild.id)?.level ?? null;
    this.seasonHistory = [...guild.guildGauntletStats]
      .sort((a, b) => b.season - a.season)
      .map(stat => ({ ...stat, level: getLevel(stat.season) }));

    // Every season, ranked or not, so gaps show on the chart
    this.chartPoints = gauntlets.map(gauntlet => {
      const season = gauntlet.gauntletInfo.season;
      const history = this.seasonHistory.find(h => h.season === season);
      return { season, rank: history?.rank ?? null, level: history?.level ?? undefined };
    });

    this.stats = this.getStats(guild, guilds);
  }

  private getStats(guild: WEBSITE_GUILD, guilds: WEBSITE_GUILD[]): GUILD_STATS | undefined {
    const ranks = this.seasonHistory.map(h => h.rank);
    if (!ranks.length) return undefined;

    const bestRank = Math.min(...ranks);
    const seasons = this.seasonHistory.map(h => h.season);

    // Longest run of consecutive seasons finished in the top 10
    let longestTop10Streak = 0;
    let streak = 0;
    for (const point of this.chartPoints) {
      streak = point.rank !== null && point.rank <= 10 ? streak + 1 : 0;
      longestTop10Streak = Math.max(longestTop10Streak, streak);
    }

    return {
      scoreRank: 1 + guilds.filter(g => g.rating > guild.rating).length,
      totalGuilds: guilds.length,
      bestRank,
      bestRankCount: ranks.filter(rank => rank === bestRank).length,
      averageRank: ranks.reduce((sum, rank) => sum + rank, 0) / ranks.length,
      longestTop10Streak,
      firstSeason: Math.min(...seasons),
      lastSeason: Math.max(...seasons)
    };
  }

  public Number: (str: string) => number = str => Number(str);
}
