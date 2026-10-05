import { Component } from '@angular/core';
import { DatabaseService, WEBSITE_TRIAL } from '../../../services/database.service';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';

type TRIAL_TAB_KEY = 'all' | 'group' | 'hammer' | 'axe' | 'sword' | 'chainblades' | 'pike' | 'repeaters' | 'strikers';

type TRIAL_TAB = {
  key: TRIAL_TAB_KEY
  label?: string
  weaponId?: number
}

@Component({
  selector: 'dl-trial-detail',
  templateUrl: './trial-detail.component.html',
  styleUrl: './trial-detail.component.scss',
  standalone: false
})
export class TrialDetailComponent {
  public trial?: WEBSITE_TRIAL;
  public activeTab: TRIAL_TAB_KEY = 'all';

  public tabs: TRIAL_TAB[] = [
    { key: 'all', label: 'Solo' },
    { key: 'group', label: 'Group' },
    { key: 'hammer', weaponId: 1 },
    { key: 'axe', weaponId: 2 },
    { key: 'sword', weaponId: 3 },
    { key: 'chainblades', weaponId: 4 },
    { key: 'pike', weaponId: 5 },
    { key: 'repeaters', weaponId: 6 },
    { key: 'strikers', weaponId: 7 }
  ];

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
    this.trial = [...this.databaseService.data.trials].reverse()[id - 1];
    if (!this.trial) {
      this.router.navigate(['trials']);
      return;
    }
    this.activeTab = this.visibleTabs[0]?.key || 'all';
  }

  // Weapon specific leaderboards only exist before the Awakening update (week 282)
  public get visibleTabs(): TRIAL_TAB[] {
    const trial = this.trial;
    if (!trial) return [];
    return this.tabs.filter(tab => trial[tab.key].length > 0 && (!tab.weaponId || trial.week < 282));
  }
}
