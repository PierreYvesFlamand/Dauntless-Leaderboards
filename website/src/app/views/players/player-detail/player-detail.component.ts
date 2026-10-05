import { Component } from '@angular/core';
import { DatabaseService, PLAYER_TRIAL_ITEM, WEBSITE_PLAYER } from '../../../services/database.service';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'dl-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrl: './player-detail.component.scss'
})
export class PlayerDetailComponent {
  public playerData?: WEBSITE_PLAYER;
  public activeTab: PLAYER_TAB_KEY = 'all';
  public stats?: PLAYER_STATS;

  // typeId = trialLeaderboardItemTypeId
  public tabs: { key: PLAYER_TAB_KEY, typeId: number, label?: string, weaponId?: number }[] = [
    { key: 'all', typeId: 1, label: 'Solo' },
    { key: 'group', typeId: 2, label: 'Group' },
    { key: 'hammer', typeId: 5, weaponId: 1 },
    { key: 'axe', typeId: 4, weaponId: 2 },
    { key: 'sword', typeId: 3, weaponId: 3 },
    { key: 'chainblades', typeId: 6, weaponId: 4 },
    { key: 'pike', typeId: 7, weaponId: 5 },
    { key: 'repeaters', typeId: 8, weaponId: 6 },
    { key: 'strikers', typeId: 9, weaponId: 7 }
  ];

  public leaderboards: {
    all: PLAYER_TRIAL_ITEM[]
    group: PLAYER_TRIAL_ITEM_FOR_GROUP[]
    hammer: PLAYER_TRIAL_ITEM[]
    axe: PLAYER_TRIAL_ITEM[]
    sword: PLAYER_TRIAL_ITEM[]
    chainblades: PLAYER_TRIAL_ITEM[]
    pike: PLAYER_TRIAL_ITEM[]
    repeaters: PLAYER_TRIAL_ITEM[]
    strikers: PLAYER_TRIAL_ITEM[]
  } = {
      all: [],
      group: [],
      hammer: [],
      axe: [],
      sword: [],
      chainblades: [],
      pike: [],
      repeaters: [],
      strikers: []
    }

  constructor(
    private databaseService: DatabaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public sharedService: SharedService
  ) {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'] || -1;
      if (id < 0 || isNaN(id)) this.router.navigate(['players']);
      this.fetchData(id);
    });
  }

  public async fetchData(id: number) {
    const player = this.databaseService.data.players[id - 1];
    if (!player) {
      this.playerData = undefined;
      this.router.navigate(['players']);
      return;
    }
    this.playerData = JSON.parse(JSON.stringify(player)) as WEBSITE_PLAYER;

    this.playerData.playerTrials = this.playerData.playerTrials.filter(t => (this.sharedService.showPreAwakening && t.week < 282) || (this.sharedService.showPostAwakening && t.week >= 282));

    // Open the first leaderboard type (by type id) the player appears in
    this.activeTab = [...this.tabs].sort((a, b) => a.typeId - b.typeId).find(tab => this.getSoloRowsByTypeId(tab.typeId).length)?.key || 'all';

    this.leaderboards.all = this.getSoloRowsByTypeId(1);
    this.leaderboards.group = this.getGroupRows();
    this.leaderboards.hammer = this.getSoloRowsByTypeId(5);
    this.leaderboards.axe = this.getSoloRowsByTypeId(4);
    this.leaderboards.sword = this.getSoloRowsByTypeId(3);
    this.leaderboards.chainblades = this.getSoloRowsByTypeId(6);
    this.leaderboards.pike = this.getSoloRowsByTypeId(7);
    this.leaderboards.repeaters = this.getSoloRowsByTypeId(8);
    this.leaderboards.strikers = this.getSoloRowsByTypeId(9);

    this.stats = this.getStats(this.playerData);
  }

  // Summary of the (settings filtered) trials, for the stats strip
  private getStats(player: WEBSITE_PLAYER): PLAYER_STATS {
    const weeks = [...new Set(player.playerTrials.map(t => t.week))];
    const soloRanks = this.leaderboards.all.map(row => row.rank);
    const groupRanks = this.getSoloRowsByTypeId(2).map(row => row.rank);

    // Loadout counted on the overall solo & group boards only (weapon boards repeat solo runs)
    const weaponCounts = new Map<number, number>();
    const omnicellCounts = new Map<number, number>();
    const runs = [...this.leaderboards.all, ...this.getSoloRowsByTypeId(2)];
    for (const run of runs) {
      const me = run.players.find(p => p.playerId === player.id) || run.players[0];
      if (!me) continue;
      weaponCounts.set(me.weaponId, (weaponCounts.get(me.weaponId) || 0) + 1);
      if (me.roleId) omnicellCounts.set(me.roleId, (omnicellCounts.get(me.roleId) || 0) + 1);
    }
    const getMain = (counts: Map<number, number>) => {
      const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
      const [id, count] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0] || [];
      return id ? { id, share: count / total } : null;
    };

    return {
      trialsPlayed: weeks.length,
      firstWeek: weeks.length ? Math.min(...weeks) : null,
      lastWeek: weeks.length ? Math.max(...weeks) : null,
      soloWins: soloRanks.filter(rank => rank === 1).length,
      soloTop5: soloRanks.filter(rank => rank <= 5).length,
      bestSoloRank: soloRanks.length ? Math.min(...soloRanks) : null,
      groupWins: groupRanks.filter(rank => rank === 1).length,
      mainWeapon: getMain(weaponCounts),
      mainOmnicell: getMain(omnicellCounts)
    };
  }

  public get visibleTabs() {
    return this.tabs.filter(tab => this.leaderboards[tab.key].length > 0);
  }

  public get soloRows(): PLAYER_TRIAL_ITEM[] {
    return this.activeTab === 'group' ? [] : this.leaderboards[this.activeTab];
  }

  public Number: (str: string) => number = str => Number(str);

  public getSoloRowsByTypeId(id: number): PLAYER_TRIAL_ITEM[] {
    if (!this.playerData) return [];
    return this.playerData.playerTrials.filter(p => p.trialLeaderboardItemTypeId === id);
  }

  public getGroupRows(): PLAYER_TRIAL_ITEM_FOR_GROUP[] {
    if (!this.playerData) return [];
    const formatForGroup: PLAYER_TRIAL_ITEM_FOR_GROUP[] = [];

    for (const row of this.playerData.playerTrials.filter(p => p.trialLeaderboardItemTypeId === 2)) {
      let formatRow = formatForGroup.find(f => f.week === row.week);
      if (!formatRow) {
        formatForGroup.push({
          behemothName: row.behemothName,
          startAt: row.startAt,
          endAt: row.endAt,
          week: row.week,
          groups: [{
            rank: row.rank,
            completionTime: row.completionTime,
            players: row.players
          }]
        });
      } else {
        formatRow.groups.push({
          rank: row.rank,
          completionTime: row.completionTime,
          players: row.players
        });
      }
    }

    return formatForGroup;
  }
}

type PLAYER_STATS = {
  trialsPlayed: number
  firstWeek: number | null
  lastWeek: number | null
  soloWins: number
  soloTop5: number
  bestSoloRank: number | null
  groupWins: number
  mainWeapon: { id: number, share: number } | null
  mainOmnicell: { id: number, share: number } | null
}

type PLAYER_TAB_KEY ='all' | 'group' | 'hammer' | 'axe' | 'sword' | 'chainblades' | 'pike' | 'repeaters' | 'strikers';

type PLAYER_TRIAL_ITEM_FOR_GROUP = {
  startAt: Date
  endAt: Date
  behemothName: string
  week: number
  groups: {
    rank: number
    completionTime: number
    players: {
      playerId: number
      weaponId: number
      secondaryWeaponId: number
      roleId: number | null
      playerName: string
      platformId: number
    }[]
  }[]
}