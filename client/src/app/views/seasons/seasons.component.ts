import { Component, OnDestroy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs';
import { ALL_SEASONS } from '../../imports';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.scss']
})
export class SeasonsComponent implements OnDestroy {
  private allSeasonsSubscription: Subscription;
  public allSeasonData: ALL_SEASONS = {};
  public currentSeasonId: string = '';
  public showChart: boolean = false;

  constructor(
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.eventService.updateTitle('Seasons');
    this.eventService.updateActiveMenu('seasons');

    this.currentSeasonId = 'gauntlet-season' + String(this.activatedRoute.firstChild?.snapshot.params['gauntletId'] || 69).padStart(2, '0');
    this.showChart = this.activatedRoute.firstChild?.firstChild?.snapshot.data['showChart'] ? true : false;

    this.allSeasonsSubscription = this.eventService.allSeasonsObservable.subscribe(this.onAllSeasonsDataUpdate.bind(this));
  }

  ngOnDestroy(): void {
    this.allSeasonsSubscription.unsubscribe();
  }

  private onAllSeasonsDataUpdate(allSeasonData: ALL_SEASONS): void {
    this.allSeasonData = allSeasonData;
    this.onFilterChange();
  }

  public onFilterChange() {
    if (!this.allSeasonData) return;
    if (!this.allSeasonData[this.currentSeasonId]) {
      this.currentSeasonId = Object.keys(this.allSeasonData)[Object.keys(this.allSeasonData).length - 1];
    }

    this.eventService.updateTitle(`Season ${this.getSeasonNumber(this.currentSeasonId)}`);

    this.showChart = this.showChart && (this.getSeasonFlourishId() ? true : false);
    const routes: Array<any> = [this.getSeasonNumber(this.currentSeasonId)];
    if (this.showChart) routes.push('chart');
    this.router.navigate(routes, { relativeTo: this.activatedRoute });
  }

  public shouldShowLastUpdated(): boolean {
    return this.allSeasonData ? Object.keys(this.allSeasonData)[Object.keys(this.allSeasonData).length - 1] === this.currentSeasonId : false;
  }

  public getSeasonFlourishId() {
    if (!this.currentSeasonId) return undefined;
    return {
      'gauntlet-season11': 17314108,
      'gauntlet-season12': 17498903
    }[this.currentSeasonId] || undefined;
  }

  public getFlourishUrl() {
    return `https://flo.uri.sh/visualisation/${this.getSeasonFlourishId()}/embed`;
  }

  public getSeasonNumber(seasonId?: string): number {
    if (!seasonId) return 69;
    return Number(seasonId.slice(15));
  }
}