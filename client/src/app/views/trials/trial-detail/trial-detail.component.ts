import { Component, OnDestroy } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { TrialsService } from '../trials.service';
import { Subscription } from 'rxjs';
import { TRIAL_DETAIL_FORMATED } from '../trials.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ALL_SLAYERS } from '../../../imports';

@Component({
  selector: 'app-trial-detail',
  templateUrl: './trial-detail.component.html',
  styleUrls: ['./trial-detail.component.scss']
})
export class TrialDetailComponent implements OnDestroy {
  public week: number = 0;
  public trial?: TRIAL_DETAIL_FORMATED;
  private allTrialsSubscription: Subscription;

  private playerNameSubscription: Subscription;
  public userPlayerName: string = '';

  private allSlayersSubscription: Subscription;
  public allSlayers: ALL_SLAYERS = {};

  constructor(
    private eventService: EventService,
    public trialsService: TrialsService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    this.eventService.updateTitle('Trial');
    this.eventService.updateActiveMenu('');

    this.week = Number(this.activatedRoute?.snapshot.params['week']);

    this.allTrialsSubscription = this.eventService.allTrialsObservable.subscribe(allTrials => {
      const trial = allTrials[`week_${String(this.week).padStart(4, '0')}`];
      if (!trial) {
        this.router.navigate(['trials']);
      } else {
        console.log(trial);

        this.trial = {
          week: this.week,
          isNew: this.week > 185,
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
    });
    this.playerNameSubscription = this.eventService.playerNameObservable.subscribe(newValue => this.userPlayerName = newValue);
    this.allSlayersSubscription = this.eventService.allSlayersObservable.subscribe(data => this.allSlayers = data);
  }

  ngOnDestroy(): void {
    this.allTrialsSubscription.unsubscribe();
    this.playerNameSubscription.unsubscribe();
    this.allSlayersSubscription.unsubscribe();
  }

  public souldHighlightGroupLine(group: any): boolean {
    return group.entries.map((p: any) => this.trialsService.getPlayerNames(this.allSlayers, p.phxAccountId).includes(this.userPlayerName)).includes(true);
  }
}