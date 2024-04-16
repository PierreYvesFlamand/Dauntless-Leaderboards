import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ALL_TRIALS, TRIAL_DETAIL } from '../../imports';
import { Subscription } from 'rxjs';
import { TrialsService } from './trials.service';

export type TRIAL_DETAIL_FORMATED = {
  week: number,
  isNew: boolean,
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
  private allTrialsSubscription: Subscription;
  public filterBehemothName?: string = undefined;

  constructor(
    private eventService: EventService,
    public trialsService: TrialsService
  ) {
    this.eventService.updateTitle('Trials');
    this.eventService.updateActiveMenu('trials');
    this.allTrialsSubscription = this.eventService.allTrialsObservable.subscribe(this.onAllTrials.bind(this));
  }

  ngOnDestroy(): void {
    this.allTrialsSubscription.unsubscribe();
  }

  public onAllTrials(allTrials: ALL_TRIALS) {
    for (const key of Object.keys(allTrials)) {
      const week = Number(key.slice(5));

      this.allTrialsFormated.push({
        week,
        isNew: week > 185,
        behemothId: this.trialsService.getBehemothIdFromWeek(week),
        data: allTrials[key]
      });
    }

    this.allTrialsFormated = this.allTrialsFormated.reverse();
  }
}