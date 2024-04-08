import { Component, OnDestroy } from '@angular/core';
import { TitleService } from '../../services/title.service';
import { ActiveMenuService } from '../../services/active-menu.service';
import { Subscription } from 'rxjs';
import { AllSeasonsService } from '../../services/all-seasons.service';
import { ALL_SEASONS, SEASON_DETAIL } from '../../types';
import { ActivatedRoute } from '@angular/router';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.scss']
})
export class SeasonsComponent implements OnDestroy {
  public allSeasonData?: ALL_SEASONS;
  public allSeasonId: Array<string> = [];
  public currentSeasonId?: string;
  public currentSeason?: SEASON_DETAIL;

  private allSeasonsSubscription: Subscription;

  constructor(
    private titleService: TitleService,
    private activeMenuService: ActiveMenuService,
    private allSeasonsService: AllSeasonsService,
    private activatedRoute: ActivatedRoute,
    private localstorageService: LocalstorageService
  ) {
    this.titleService.updateTitle('Seasons');
    this.activeMenuService.updateActiveMenu('seasons');
    this.allSeasonsSubscription = this.allSeasonsService.allSeasonsObservable.subscribe(this.onAllSeasonsDataUpdate.bind(this));

    this.activatedRoute.queryParams.subscribe(params => {
      const gauntletId = params['gauntletId'];
      if (gauntletId) {
        this.onCurrentSeasonIdChange(`gauntlet-season${String(gauntletId).padStart(2, '0')}`);
      }
    });
  }

  ngOnDestroy(): void {
    this.allSeasonsSubscription.unsubscribe();
  }

  private onAllSeasonsDataUpdate(allSeasonData: ALL_SEASONS): void {
    const currentSeasonKey = Object.keys(allSeasonData)[Object.keys(allSeasonData).length - 1];
    if (!currentSeasonKey) return;
    this.allSeasonId = Object.keys(allSeasonData).reverse();
    this.allSeasonData = allSeasonData;
    this.onCurrentSeasonIdChange(currentSeasonKey);
  }

  public convertRemainingSec(sec: number): string {
    return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
  }

  public getSeasonNumber(seasonId: string): number {
    return Number(seasonId.slice(15));
  }

  public onCurrentSeasonIdChange(seasonId: string) {
    if (!this.allSeasonData) return;
    if (!this.allSeasonData[seasonId]) return;
    this.currentSeason = undefined;

    this.currentSeasonId = seasonId;
    this.currentSeason = this.allSeasonData[this.currentSeasonId];
    this.titleService.updateTitle(`Season ${this.getSeasonNumber(this.currentSeasonId)}`);
    window.history.replaceState({}, '', `/seasons?gauntletId=${this.getSeasonNumber(this.currentSeasonId)}`);
  }

  public shouldShowLastUpdated(): boolean {
    if (!this.currentSeason?.endAt) return false;
    if (!this.currentSeason?.lastUpdated) return false;
    return this.currentSeason.lastUpdated < this.currentSeason.endAt;
  }

  public showBigFileLoadWarning: boolean = false;
  public alwaysAcceptBigFile: boolean = false;

  public onBarChartRaceBtnClick() {
    this.alwaysAcceptBigFile = false;

    const allowBigFileLoadSettings = this.localstorageService.getByKey('allow-big-file-load');
    if(allowBigFileLoadSettings){
      return;
    }

    this.showBigFileLoadWarning = true;
  }

  public onBarChartRaceConfirm(){
    this.localstorageService.setByKey('allow-big-file-load', this.alwaysAcceptBigFile);
  }
}