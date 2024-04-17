import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventService } from '../../../services/event.service';
import { ALL_SLAYERS, ALL_TRIALS } from '../../../imports';
import { TrialsService } from '../../trials/trials.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.scss']
})
export class PlayerDetailComponent implements OnDestroy {
  public playerName: string = '';

  private allSlayersSubscription: Subscription;
  public allSlayers: ALL_SLAYERS = {};
  private allSlayerLoaded: boolean = false;

  private allTrialsSubscription: Subscription;
  public allTrials: ALL_TRIALS = {};
  private allTrialsLoaded: boolean = false;

  public playerDetails: any = {};

  constructor(
    private eventService: EventService,
    public trialsService: TrialsService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    this.playerName = this.activatedRoute?.snapshot.params['name'];
    this.eventService.updateTitle(this.playerName);
    this.eventService.updateActiveMenu('');

    this.allTrialsSubscription = this.eventService.allTrialsObservable.subscribe(this.onAllTrials.bind(this));
    this.allSlayersSubscription = this.eventService.allSlayersObservable.subscribe(this.onAllSlayers.bind(this));
  }

  ngOnDestroy(): void {
    this.allSlayersSubscription.unsubscribe();
    this.allTrialsSubscription.unsubscribe();
  }

  public buildPlayerData() {
    let playerId = null;

    for (const id in this.allSlayers) {
      if (playerId) continue;

      this.allSlayers[id] = this.allSlayers[id].reverse();
      let player = this.allSlayers[id].find(s => s.platform === 'WIN' && s.platformName.toLowerCase() === this.playerName.toLowerCase());
      if (player) { playerId = id }
      else {
        player = this.allSlayers[id].find(s => s.platform === 'PSN' && s.platformName.toLowerCase() === this.playerName.toLowerCase());
        if (player) { playerId = id }
        else {
          player = this.allSlayers[id].find(s => s.platform === 'XBL' && s.platformName.toLowerCase() === this.playerName.toLowerCase());
          if (player) { playerId = id }
          else {
            player = this.allSlayers[id].find(s => s.platform === 'SWT' && s.platformName.toLowerCase() === this.playerName.toLowerCase());
            if (player) { playerId = id }
          }
        }
      }
    }

    if (!playerId) {
      this.router.navigate(['../'], { relativeTo: this.activatedRoute });
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

    const keys = Object.keys(this.allTrials).reverse()

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
        this.allTrials[key].solo[type].forEach((entry, index) => {
          if (entry.phxAccountId === playerId) {
            this.playerDetails[type].push({
              week,
              rank: index + 1,
              behemothId: this.trialsService.getBehemothIdFromWeek(week),
              ...entry
            });
          }
        });
      }

      this.allTrials[key].group.forEach((group, index) => {
        for (const entry of group.entries) {
          if (entry.phxAccountId === playerId) {
            this.playerDetails['group'].push({
              week,
              rank: index + 1,
              behemothId: this.trialsService.getBehemothIdFromWeek(week),
              ...group
            });
          }
        }
      });
    }
  }

  public getNbrOfTop(type: string, nbr: number): number {
    return this.playerDetails[type].filter((w: any) => w.rank <= nbr).length
  }

  public onAllSlayers(allSlayers: ALL_SLAYERS) {
    this.allSlayers = allSlayers;
    this.allSlayerLoaded = true;
    if (this.allSlayerLoaded && this.allTrialsLoaded) {
      this.buildPlayerData();
    }
  }

  public onAllTrials(allTrials: ALL_TRIALS) {
    this.allTrials = allTrials;
    this.allTrialsLoaded = true;
    if (this.allSlayerLoaded && this.allTrialsLoaded) {
      this.buildPlayerData();
    }
  }
}