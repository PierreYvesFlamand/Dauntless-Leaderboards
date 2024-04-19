import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { TRIAL_DETAIL } from '../../../../../server/src/types';
import { TrialsService } from '../../services/trials.service';
import { DatabaseService } from '../../services/database.service';
import { Subscription } from 'rxjs';

export type TRIAL_DETAIL_FORMATED = {
  week: number,
  behemothId: number,
  data: TRIAL_DETAIL
};

@Component({
  selector: 'app-trials',
  templateUrl: './trials.component.html',
  styleUrls: ['./trials.component.scss']
})
export class TrialsComponent {
  public allTrialsFormated: Array<TRIAL_DETAIL_FORMATED> = [];
  public filterBehemothName?: string = undefined;

  private trialDecimalsSubscription: Subscription;
  public trialDecimals: 1 | 2 | 3 = 1;

  constructor(
    private eventService: EventService,
    public trialsService: TrialsService,
    public databaseService: DatabaseService
  ) {
    this.eventService.updateTitle('Trials');
    this.eventService.updateActiveMenu('trials');

    this.trialDecimalsSubscription = this.eventService.trialDecimalsObservable.subscribe(newValue => this.trialDecimals = newValue);

    for (const key in this.databaseService.allTrials) {
      const week = Number(key.slice(5));

      this.allTrialsFormated.push({
        week,
        behemothId: this.trialsService.getBehemothIdFromWeek(week),
        data: this.databaseService.allTrials[key]
      });
    }

    this.allTrialsFormated = this.allTrialsFormated.reverse();
  }

  ngOnDestroy(): void {
    this.trialDecimalsSubscription.unsubscribe();
  }
}