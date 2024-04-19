import { Component, OnDestroy } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { Subscription } from 'rxjs';
import { TRIAL_DETAIL_FORMATED } from '../trials.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TrialsService } from '../../../services/trials.service';
import { DatabaseService } from '../../../services/database.service';

@Component({
  selector: 'app-trial-detail',
  templateUrl: './trial-detail.component.html',
  styleUrls: ['./trial-detail.component.scss']
})
export class TrialDetailComponent implements OnDestroy {
  public week: number = 0;
  public trial?: TRIAL_DETAIL_FORMATED;

  private playerNameSubscription: Subscription;
  public userPlayerName: string = '';

  private trialDecimalsSubscription: Subscription;
  public trialDecimals: 1 | 2 | 3 = 1;

  constructor(
    private eventService: EventService,
    public trialsService: TrialsService,
    public databaseService: DatabaseService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    this.eventService.updateTitle('Trial');
    this.eventService.updateActiveMenu('');

    this.week = Number(this.activatedRoute?.snapshot.params['week']);

    this.playerNameSubscription = this.eventService.playerNameObservable.subscribe(newValue => this.userPlayerName = newValue);
    this.trialDecimalsSubscription = this.eventService.trialDecimalsObservable.subscribe(newValue => this.trialDecimals = newValue);

    const trial = this.databaseService.allTrials[`week_${String(this.week).padStart(4, '0')}`];
    if (!trial) {
      this.router.navigate(['trials']);
    } else {
      this.trial = {
        week: this.week,
        behemothId: this.trialsService.getBehemothIdFromWeek(this.week),
        data: trial
      }

      if (this.week <= 90) {
        this.trial.data.solo['hammer'] = this.trial.data.solo['all'].filter(e => e.weapon === 1);
        this.trial.data.solo['axe'] = this.trial.data.solo['all'].filter(e => e.weapon === 2);
        this.trial.data.solo['sword'] = this.trial.data.solo['all'].filter(e => e.weapon === 3);
        this.trial.data.solo['chainblades'] = this.trial.data.solo['all'].filter(e => e.weapon === 4);
        this.trial.data.solo['pike'] = this.trial.data.solo['all'].filter(e => e.weapon === 5);
        this.trial.data.solo['repeaters'] = this.trial.data.solo['all'].filter(e => e.weapon === 6);
        this.trial.data.solo['strikers'] = this.trial.data.solo['all'].filter(e => e.weapon === 7);
      }
    }
  }

  ngOnDestroy(): void {
    this.playerNameSubscription.unsubscribe();
    this.trialDecimalsSubscription.unsubscribe();
  }

  public souldHighlightGroupLine(group: any): boolean {
    return group.entries.map((p: any) => this.trialsService.getPlayerNames(this.databaseService.allSlayers, p.phxAccountId).includes(this.userPlayerName)).includes(true);
  }
}