import { Component } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { API_TRIAL, TRIAL_LEADERBOARD } from '../../../../../../backend/src/types/types';

@Component({
  selector: 'dl-trial-detail',
  templateUrl: './trial-detail.component.html',
  styleUrl: './trial-detail.component.scss'
})
export class TrialDetailComponent {
  public trial?: API_TRIAL;

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
    this.trial = await this.databaseService.fetch<API_TRIAL>(`trials/${id}`);
    if (!this.trial) this.router.navigate(['trials']);
  }
}
