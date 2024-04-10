import { Component, OnDestroy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs';
import { ALL_SEASONS, LEADERBOARD_ITEM } from '../../types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {
  public currentSeasonNumber?: string;
  public currentSeasonEndAt?: Date;
  public currentSeasonLeaderboard: Array<LEADERBOARD_ITEM> = [];

  private allSeasonsSubscription: Subscription;

  constructor(
    private eventService: EventService
  ) {
    this.eventService.updateTitle('Dashboard');
    this.eventService.updateActiveMenu('dashboard');
    this.allSeasonsSubscription = this.eventService.allSeasonsObservable.subscribe(this.onAllSeasonsDataUpdate.bind(this));
  }

  ngOnDestroy(): void {
    this.allSeasonsSubscription.unsubscribe();
  }

  private onAllSeasonsDataUpdate(allSeasonData: ALL_SEASONS): void {
    const currentSeasonKey = Object.keys(allSeasonData)[Object.keys(allSeasonData).length - 1];
    if (!currentSeasonKey) return;
    const currentSeason = allSeasonData[currentSeasonKey];
    this.currentSeasonNumber = String(this.getSeasonNumber(currentSeasonKey));
    this.currentSeasonEndAt = currentSeason.endAt;
    this.currentSeasonLeaderboard = currentSeason.leaderboard.slice(0, 5);
  }

  public convertRemainingSec(sec: number): string {
    return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
  }

  public getSeasonNumber(seasonId: string): number {
    return Number(seasonId.slice(15));
  }
}