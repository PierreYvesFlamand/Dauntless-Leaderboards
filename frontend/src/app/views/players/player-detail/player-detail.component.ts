import { Component } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { API_PLAYER } from '../../../../../../backend/src/types/types';

@Component({
  selector: 'dl-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrl: './player-detail.component.scss'
})
export class PlayerDetailComponent {
  public playerData?: API_PLAYER;
  public firstActive: number = 0;

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
      if (this.getRowByTypeId(id).length) this.firstActive = id;
    }
  }

  public Number: (str: string) => number = str => Number(str);

  public getRowByTypeId(id: number) {
    if (!this.playerData) return [];
    return this.playerData.player_trials.filter(p => p.trial_leaderboard_item_type_id === id);
  }
}
