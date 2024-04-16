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
  public currentSeasonId?: string = '';
  public showChart: boolean = false;

  constructor(
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.eventService.updateTitle('Seasons');
    this.eventService.updateActiveMenu('seasons');

    this.activatedRoute.params.subscribe(params => {
      this.currentSeasonId = 'gauntlet-season' + String(params['gauntletId'] || 69).padStart(2, '0');
      this.onFilterChange();
    });

    this.activatedRoute.data.subscribe(data => {
      this.showChart = data['showChart'] ? true : false;
      this.onFilterChange();
    });

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
    if (!Object.keys(this.allSeasonData).length || !this.currentSeasonId) return;

    let replaceUrl = false;

    if (this.allSeasonData[this.currentSeasonId] === undefined) {
      this.currentSeasonId = Object.keys(this.allSeasonData)[Object.keys(this.allSeasonData).length - 1];
      replaceUrl = true;
    }

    this.eventService.updateTitle(`Season ${this.getSeasonNumber(this.currentSeasonId)}`);

    this.showChart = this.showChart && (this.getSeasonFlourishId() ? true : false);
    
    const routes: Array<any> = ['seasons', this.getSeasonNumber(this.currentSeasonId)];
    if (this.showChart) routes.push('chart');
    this.router.navigate(routes, { replaceUrl });
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

  public convertRemainingSec(sec: number): string {
    return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
  }

  public openGuildDetail(guildNameplate: string) {
    window.open(`/guilds/${guildNameplate}`, '_blank');
  }
}