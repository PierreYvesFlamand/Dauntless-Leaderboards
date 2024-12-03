import { Component } from '@angular/core';
import { DatabaseService, WEBSITE_TRIAL } from '../../../services/database.service';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'dl-trial-detail',
  templateUrl: './trial-detail.component.html',
  styleUrl: './trial-detail.component.scss',
  standalone: false
})
export class TrialDetailComponent {
  public trial?: WEBSITE_TRIAL;

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

  public fetchData(id: number) {
    this.trial = this.databaseService.data.trials[id - 1];
    if (!this.trial) this.router.navigate(['trials']);
  }
}
