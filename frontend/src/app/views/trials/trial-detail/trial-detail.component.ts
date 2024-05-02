import { Component } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TRIAL_DETAIL, TRIAL_LEADERBOARD_ITEM_PLAYER_DATA } from '../../../../../../backend/src/types/types';

@Component({
  selector: 'dl-trial-detail',
  templateUrl: './trial-detail.component.html',
  styleUrl: './trial-detail.component.scss'
})
export class TrialDetailComponent {
  public trial?: TRIAL_DETAIL;
  public currentType: string = 'all';
  public currentLeaderboard: TRIAL_LEADERBOARD_ITEM_PLAYER_DATA[] = [];

  constructor(
    private databaseService: DatabaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public sharedService: SharedService
  ) {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'] || -1;
      if (id < 0 || isNaN(id)) this.router.navigate(['trials']);
      this.fetchData(id);
    });
  }

  public async fetchData(id: number) {
    this.trial = await this.databaseService.fetch<TRIAL_DETAIL>(`trials/${id}`);
    if (!this.trial) this.router.navigate(['trials']);
    this.changeType(this.currentType);
  }

  public changeType(type: string) {
    if (!this.trial) return;
    this.currentType = type;
    switch (type) {
      case 'all': this.currentLeaderboard = this.trial.allLeaderboard; break;
      case 'group': this.currentLeaderboard = this.trial.groupLeaderboard; break;
      case 'hammer': this.currentLeaderboard = this.trial.hammerLeaderboard; break;
      case 'axe': this.currentLeaderboard = this.trial.axeLeaderboard; break;
      case 'sword': this.currentLeaderboard = this.trial.swordLeaderboard; break;
      case 'chainblades': this.currentLeaderboard = this.trial.chainbladesLeaderboard; break;
      case 'pike': this.currentLeaderboard = this.trial.pikeLeaderboard; break;
      case 'repeaters': this.currentLeaderboard = this.trial.repeatersLeaderboard; break;
      case 'strikers': this.currentLeaderboard = this.trial.strikersLeaderboard; break;
      default: this.currentLeaderboard = this.trial.allLeaderboard; break;
    }
  }
}
