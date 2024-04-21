import { Component, OnDestroy } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TrialsService } from '../../../services/trials.service';
import { DatabaseService } from '../../../services/database.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.scss']
})
export class PlayerDetailComponent implements OnDestroy {
  public playerId: string = '';
  // TODO: Type this value correctly
  public playerDetails: any = {};
  public totalOfGroupEntry: number = 0;
  public firstTabToOpen: string = 'all';

  private trialDecimalsSubscription: Subscription;
  public trialDecimals: 1 | 2 | 3 = 1;

  constructor(
    private eventService: EventService,
    public databaseService: DatabaseService,
    public trialsService: TrialsService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    this.playerId = this.activatedRoute?.snapshot.params['id'];
    this.trialDecimalsSubscription = this.eventService.trialDecimalsObservable.subscribe(newValue => this.trialDecimals = newValue);

    this.activatedRoute.params.subscribe(params => {
      this.playerId = params['id'];
      this.eventService.updateTitle('');
      this.buildPlayerData();
    });

    this.eventService.updateActiveMenu('');
  }

  ngOnDestroy(): void {
    this.trialDecimalsSubscription.unsubscribe();
  }

  public buildPlayerData() {
    if (!this.playerId) {
      this.router.navigate(['players']);
      return;
    }

    this.playerDetails = {
      'all': [],
      'hammer': [],
      'axe': [],
      'sword': [],
      'chainblades': [],
      'pike': [],
      'repeaters': [],
      'strikers': [],
      'group': []
    };

    const keys = Object.keys(this.databaseService.allTrials).reverse();

    this.totalOfGroupEntry = 0;

    for (const key of keys) {
      const week = Number(key.slice(5));

      for (const type of [
        'all',
        'hammer',
        'axe',
        'sword',
        'chainblades',
        'pike',
        'repeaters',
        'strikers'
      ]) {
        this.databaseService.allTrials[key].solo[type].forEach((entry, index) => {
          if (entry.phxAccountId === this.playerId) {
            this.playerDetails[type].push({
              week,
              rank: index + 1,
              behemothId: this.trialsService.getBehemothIdFromWeek(week),
              ...entry
            });
          }
        });
      }

      const entries: any = [];

      this.databaseService.allTrials[key].group.forEach((group, index) => {
        for (const entry of group.entries) {
          if (entry.phxAccountId === this.playerId) {
            this.totalOfGroupEntry++;
            entries.push({
              rank: index + 1,
              ...group
            });
          }
        }
      });

      if (entries.length) {
        this.playerDetails['group'].push({
          week,
          behemothId: this.trialsService.getBehemothIdFromWeek(week),
          entries
        });
      }
    }

    if (this.playerDetails['all'].length) this.firstTabToOpen = 'all';
    else if (this.playerDetails['group'].length) this.firstTabToOpen = 'group';
    else if (this.playerDetails['hammer'].length) this.firstTabToOpen = 'hammer';
    else if (this.playerDetails['axe'].length) this.firstTabToOpen = 'axe';
    else if (this.playerDetails['sword'].length) this.firstTabToOpen = 'sword';
    else if (this.playerDetails['chainblades'].length) this.firstTabToOpen = 'chainblades';
    else if (this.playerDetails['pike'].length) this.firstTabToOpen = 'pike';
    else if (this.playerDetails['repeaters'].length) this.firstTabToOpen = 'repeaters';
    else if (this.playerDetails['strikers'].length) this.firstTabToOpen = 'strikers';
    else {
      this.router.navigate(['players']);
      return;
    }
  }

  public getNbrOfTop(type: string, nbr: number): number {
    return this.playerDetails[type].filter((w: any) => w.rank <= nbr).length
  }
}