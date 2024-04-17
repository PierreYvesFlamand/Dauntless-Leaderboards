import { Component, OnDestroy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs';
import { ALL_SEASONS, ALL_SLAYERS, TRIAL_DETAIL, SEASON_DETAIL } from '../../imports';
import { Router } from '@angular/router';
import { TrialsService } from '../trials/trials.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {
  private allSeasonsSubscription: Subscription;
  public currentSeasonId: string = '';
  public currentSeason?: SEASON_DETAIL;

  private allSlayersSubscription: Subscription;
  public allSlayers: ALL_SLAYERS = {};

  private guildTagSubscription: Subscription;
  public userGuildTag: string = '';

  public currentTrial?: TRIAL_DETAIL;

  constructor(
    private eventService: EventService,
    private trialsService: TrialsService,
    private router: Router
  ) {
    this.eventService.updateTitle('Dashboard');
    this.eventService.updateActiveMenu('dashboard');

    this.allSeasonsSubscription = this.eventService.allSeasonsObservable.subscribe(this.onAllSeasonsDataUpdate.bind(this));
    this.allSlayersSubscription = this.eventService.allSlayersObservable.subscribe(data => this.allSlayers = data);
    this.guildTagSubscription = this.eventService.guildTagObservable.subscribe(newValue => this.userGuildTag = newValue);
    // fetch(`${environment.backendUrl}/data/trials/current-leaderboard.json`).then(res => res.json()).then(data => {
    //   this.currentTrial = data;
    // });
  }

  ngOnDestroy(): void {
    this.allSeasonsSubscription.unsubscribe();
    this.allSlayersSubscription.unsubscribe();
    this.guildTagSubscription.unsubscribe();
  }

  private onAllSeasonsDataUpdate(allSeasonData: ALL_SEASONS): void {
    this.currentSeasonId = Object.keys(allSeasonData)[Object.keys(allSeasonData).length - 1];
    this.currentSeason = allSeasonData[this.currentSeasonId];
  }

  public convertRemainingSec(sec: number): string {
    return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
  }

  public getSeasonNumber(seasonId: string): number {
    return Number(seasonId.slice(15));
  }

  public openGuildDetail(guildNameplate: string) {
    this.router.navigate(['guilds', guildNameplate]);
  }
}