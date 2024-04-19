import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.scss']
})
export class SeasonsComponent implements AfterViewInit, OnDestroy {
  public selectedSeasonId?: string = '';
  public showChart: boolean = false;

  private guildTagSubscription: Subscription;
  public userGuildTag: string = '';

  constructor(
    private eventService: EventService,
    public databaseService: DatabaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.eventService.updateTitle('Seasons');
    this.eventService.updateActiveMenu('seasons');

    this.activatedRoute.params.subscribe(params => {
      this.selectedSeasonId = 'gauntlet-season' + String(params['gauntletId'] || 69).padStart(2, '0');
      this.onFilterChange();
    });

    this.activatedRoute.data.subscribe(data => {
      this.showChart = data['showChart'] ? true : false;
      this.onFilterChange();
    });

    this.guildTagSubscription = this.eventService.guildTagObservable.subscribe(newValue => this.userGuildTag = newValue);
  }

  ngAfterViewInit(): void {
    this.onFilterChange();
  }

  ngOnDestroy(): void {
    this.guildTagSubscription.unsubscribe();
  }

  public onFilterChange() {
    if (!Object.keys(this.databaseService.allSeasons).length || !this.selectedSeasonId) return;

    let replaceUrl = false;

    if (this.databaseService.allSeasons[this.selectedSeasonId] === undefined) {
      this.selectedSeasonId = Object.keys(this.databaseService.allSeasons)[Object.keys(this.databaseService.allSeasons).length - 1];
      replaceUrl = true;
    }

    this.eventService.updateTitle(`Season ${this.getSeasonNumber(this.selectedSeasonId)}`);

    this.showChart = this.showChart && (this.getSeasonFlourishId() ? true : false);

    const routes: Array<any> = ['seasons', this.getSeasonNumber(this.selectedSeasonId)];
    if (this.showChart) routes.push('chart');
    this.router.navigate(routes, { replaceUrl });
  }

  public shouldShowLastUpdated(): boolean {
    return this.databaseService.allSeasons ? Object.keys(this.databaseService.allSeasons)[Object.keys(this.databaseService.allSeasons).length - 1] === this.selectedSeasonId : false;
  }

  public getSeasonFlourishId() {
    if (!this.selectedSeasonId) return undefined;
    return {
      'gauntlet-season11': 17314108,
      'gauntlet-season12': 17498903
    }[this.selectedSeasonId] || undefined;
  }

  public getFlourishUrl() {
    return `https://flo.uri.sh/visualisation/${this.getSeasonFlourishId()}/embed`;
  }

  public getSeasonNumber(seasonId?: string): number {
    if (!seasonId) return 69;
    return Number(seasonId.slice(15));
  }

  public convertRemainingSec(sec: number): string {
    return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
  }
}