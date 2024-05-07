import { Component } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { API_PLAYER, PLAYER_TRIAL_ITEM } from '../../../../../../backend/src/types/types';

@Component({
  selector: 'dl-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrl: './player-detail.component.scss'
})
export class PlayerDetailComponent {
  public playerData?: API_PLAYER;
  public firstActive: number = 0;
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
    this.playerData = await this.databaseService.fetch<API_PLAYER>(`players/${id}`);
    if (!this.playerData) this.router.navigate(['players']);

    for (const id of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      if (this.firstActive) continue;
      if (this.getSoloRowsByTypeId(id).length) this.firstActive = id;
    }

    this.leaderboards.all = this.getSoloRowsByTypeId(1);
    this.leaderboards.group = this.getGroupRows();
    this.leaderboards.hammer = this.getSoloRowsByTypeId(5);
    this.leaderboards.axe = this.getSoloRowsByTypeId(4);
    this.leaderboards.sword = this.getSoloRowsByTypeId(3);
    this.leaderboards.chainblades = this.getSoloRowsByTypeId(6);
    this.leaderboards.pike = this.getSoloRowsByTypeId(7);
    this.leaderboards.repeaters = this.getSoloRowsByTypeId(8);
    this.leaderboards.strikers = this.getSoloRowsByTypeId(9);
  }

  public Number: (str: string) => number = str => Number(str);

  public getSoloRowsByTypeId(id: number): PLAYER_TRIAL_ITEM[] {
    if (!this.playerData) return [];
    return this.playerData.player_trials.filter(p => p.trial_leaderboard_item_type_id === id);
  }

  public getGroupRows(): PLAYER_TRIAL_ITEM_FOR_GROUP[] {
    if (!this.playerData) return [];
    const formatForGroup: PLAYER_TRIAL_ITEM_FOR_GROUP[] = [];

    for (const row of this.playerData.player_trials.filter(p => p.trial_leaderboard_item_type_id === 2)) {
      let formatRow = formatForGroup.find(f => f.week === row.week);
      if (!formatRow) {
        formatForGroup.push({
          behemoth_name: row.behemoth_name,
          start_at: row.start_at,
          end_at: row.end_at,
          week: row.week,
          groups: [{
            rank: row.rank,
            completion_time: row.completion_time,
            players: row.players
          }]
        });
      } else {
        formatRow.groups.push({
          rank: row.rank,
          completion_time: row.completion_time,
          players: row.players
        });
      }
    }

    return formatForGroup;
  }
}

type PLAYER_TRIAL_ITEM_FOR_GROUP = {
  start_at: Date
  end_at: Date
  behemoth_name: string
  week: number
  groups: {
    rank: number
    completion_time: number
    players: {
      player_id: number
      weapon_id: number
      role_id: string
      player_name: string
      platform_id: number
      player_icon_filename: string
    }[]
  }[]
}