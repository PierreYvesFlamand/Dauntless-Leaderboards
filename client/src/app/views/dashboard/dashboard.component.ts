import { Component, OnDestroy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { TrialsService } from '../../services/trials.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {
  public currentSeasonId: string = '';

  private guildTagSubscription: Subscription;
  public userGuildTag: string = '';

  private playerNameSubscription: Subscription;
  public userPlayerName: string = '';

  private trialDecimalsSubscription: Subscription;
  public trialDecimals: 1 | 2 | 3 = 1;

  constructor(
    private eventService: EventService,
    public databaseService: DatabaseService,
    public trialsService: TrialsService
  ) {
    this.eventService.updateTitle('Dashboard');
    this.eventService.updateActiveMenu('dashboard');

    this.guildTagSubscription = this.eventService.guildTagObservable.subscribe(newValue => this.userGuildTag = newValue);
    this.playerNameSubscription = this.eventService.playerNameObservable.subscribe(newValue => this.userPlayerName = newValue);
    this.trialDecimalsSubscription = this.eventService.trialDecimalsObservable.subscribe(newValue => this.trialDecimals = newValue);
    this.currentSeasonId = Object.keys(databaseService.allSeasons)[Object.keys(databaseService.allSeasons).length - 1];
  }

  ngOnDestroy(): void {
    this.guildTagSubscription.unsubscribe();
    this.playerNameSubscription.unsubscribe();
    this.trialDecimalsSubscription.unsubscribe();
  }

  public convertRemainingSec(sec: number): string {
    return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
  }

  public getSeasonNumber(seasonId: string): number {
    return Number(seasonId.slice(15));
  }

  public souldHighlightGroupLine(group: any): boolean {
    return group.entries.map((p: any) => p.playerName === this.userPlayerName).includes(true);
  }
}