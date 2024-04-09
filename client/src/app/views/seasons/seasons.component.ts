import { Component, OnDestroy } from '@angular/core';
import { TitleService } from '../../services/title.service';
import { ActiveMenuService } from '../../services/active-menu.service';
import { Subscription } from 'rxjs';
import { AllSeasonsService } from '../../services/all-seasons.service';
import { ALL_SEASONS, SEASON_DETAIL } from '../../types';
import { ActivatedRoute } from '@angular/router';
import { LocalstorageService } from '../../services/localstorage.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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
    private localstorageService: LocalstorageService,
    private ngxUiLoaderService: NgxUiLoaderService
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

  public getSeasonNumber(seasonId?: string): number {
    if (!seasonId) return 69;
    return Number(seasonId.slice(15));
  }

  public onCurrentSeasonIdChange(seasonId: string) {
    if (!this.allSeasonData) return;
    if (!this.allSeasonData[seasonId]) return;
    this.currentSeason = undefined;

    this.currentSeasonId = seasonId;
    this.currentSeason = this.allSeasonData[this.currentSeasonId];
    this.titleService.updateTitle(`Season ${this.getSeasonNumber(this.currentSeasonId)}`);

    let newUrl = '/seasons';
    if (this.getSeasonNumber(this.currentSeasonId) !== Object.keys(this.allSeasonData).length) {
      newUrl = `/seasons?gauntletId=${this.getSeasonNumber(this.currentSeasonId)}`;
    }
    window.history.replaceState({}, '', newUrl);
  }

  public shouldShowLastUpdated(): boolean {
    if (!this.currentSeason?.endAt) return false;
    if (!this.currentSeason?.lastUpdated) return false;
    return this.currentSeason.lastUpdated < this.currentSeason.endAt;
  }

  // Bar chart
  public showSeasonDetail: boolean = false;
  public showBigFileLoadWarning: boolean = false;
  public alwaysAcceptBigFile: boolean = false;
  public allRawHeaders: Array<string> = [];
  public allRawLines: Array<Array<any>> = [];

  public onBarChartRaceBtnClick() {
    this.alwaysAcceptBigFile = false;

    const allowBigFileLoadSettings = this.localstorageService.getByKey('allow-big-file-load');
    if (allowBigFileLoadSettings) {
      return;
    }

    this.showBigFileLoadWarning = true;
  }

  public async onBarChartRaceConfirm() {
    if (!this.currentSeason) return;

    this.ngxUiLoaderService.start();
    this.localstorageService.setByKey('allow-big-file-load', this.alwaysAcceptBigFile);

    const res = await fetch(`http://localhost/data/${this.currentSeasonId}/all-raw.json`);
    const data: ALL_SEASONS = await res.json();

    this.allRawHeaders = ['Date', ...this.currentSeason.leaderboard.map(l => l.guildName)];

    for (const key of Object.keys(data).reverse()) {
      const line = [];
      line.push(new Date(Date.UTC(
        Number(key.split('--')[0].split('-')[0]),
        Number(key.split('--')[0].split('-')[1]),
        Number(key.split('--')[0].split('-')[2]),
        Number(key.split('--')[1].split('-')[0]),
        Number(key.split('--')[1].split('-')[1])
      )));

      const seasonAtDate = data[key];

      for (const l of seasonAtDate.leaderboard) {
        if (!this.allRawHeaders.includes(l.guildName)) {
          this.allRawHeaders.push(l.guildName);
        }
      }

      for (const headers of this.allRawHeaders.slice(1)) {
        const l = seasonAtDate.leaderboard.find(l => l.guildName === headers);
        line.push(l ? l.level : '');
      }
      this.allRawLines.push(line);
    }

    for (const line of this.allRawLines) {
      for (let i = 0; i < this.allRawHeaders.length - line.length; i++) {
        line.push('');
      }
    }

    this.titleService.updateTitle(`Season ${this.getSeasonNumber(this.currentSeasonId)} - Detail`);
    this.showSeasonDetail = true;
    this.ngxUiLoaderService.stop();
  }
}