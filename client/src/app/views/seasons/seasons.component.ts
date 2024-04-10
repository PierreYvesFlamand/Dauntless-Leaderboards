import { Component, OnDestroy } from '@angular/core';
import { TitleService } from '../../services/title.service';
import { ActiveMenuService } from '../../services/active-menu.service';
import { Subscription } from 'rxjs';
import { AllSeasonsService } from '../../services/all-seasons.service';
import { ALL_SEASONS, SEASON_DETAIL } from '../../types';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

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
  public showBarChartRaceModal: boolean = false;

  private allSeasonsSubscription: Subscription;

  constructor(
    private titleService: TitleService,
    private activeMenuService: ActiveMenuService,
    private allSeasonsService: AllSeasonsService,
    private activatedRoute: ActivatedRoute,
    private ngxUiLoaderService: NgxUiLoaderService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.titleService.updateTitle('Seasons');
    this.activeMenuService.updateActiveMenu('seasons');
    this.allSeasonsSubscription = this.allSeasonsService.allSeasonsObservable.subscribe(this.onAllSeasonsDataUpdate.bind(this));

    const gauntletId = this.activatedRoute.firstChild?.snapshot.params['gauntletId'];
    if (gauntletId) {
      this.onCurrentSeasonIdChange(`gauntlet-season${String(gauntletId).padStart(2, '0')}`);
    }
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

    this.router.navigate([this.getSeasonNumber(this.currentSeasonId)], { relativeTo: this.activatedRoute });
  }

  public shouldShowLastUpdated(): boolean {
    return this.allSeasonData ? Object.keys(this.allSeasonData)[Object.keys(this.allSeasonData).length - 1] === this.currentSeasonId : false;
  }

  public getSeasonFlourishId() {
    if (!this.currentSeasonId) return undefined;
    return {
      'gauntlet-season11': 17314108
    }[this.currentSeasonId] || undefined;
  }

  public getFlourishUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://flo.uri.sh/visualisation/${this.getSeasonFlourishId()}/embed`)
  }

  public async onExport(type: 'csv' | 'flourish') {
    if (!this.currentSeason) return;
    this.ngxUiLoaderService.start();

    const res = await fetch(`${environment.backendUrl}/data/${this.currentSeasonId}/all-raw.json`);
    const data: ALL_SEASONS = await res.json();

    const headers: Array<string> = ['Full date'];
    let lines: any = [];

    for (const key of Object.keys(data)) {
      const line = [];
      const seasonAtDate = data[key];
      const date = new Date(Date.UTC(
        Number(key.split('--')[0].split('-')[0]),
        Number(key.split('--')[0].split('-')[1]) - 1,
        Number(key.split('--')[0].split('-')[2]),
        Number(key.split('--')[1].split('-')[0]),
        Number(key.split('--')[1].split('-')[1])
      ));

      line.push(`${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${String(date.getUTCDate()).padStart(2, '0')} ${date.getUTCHours()}:${String(date.getUTCMinutes()).padStart(2, '0')}`);


      for (const l of seasonAtDate.leaderboard) {
        if (!headers.includes(`${l.guildName} [${l.guildNameplate}]`)) {
          headers.push(`${l.guildName} [${l.guildNameplate}]`);
        }

        if (type === 'flourish') {
          const guildsToOrder = seasonAtDate.leaderboard.filter(g => g.level === l.level);
          if (guildsToOrder.length < 2) continue;
          guildsToOrder.forEach((guildToOrder, index) => {
            guildToOrder.level += (0.001 * (guildsToOrder.length - index));
          });
        }
      }

      for (const header of headers.slice(1)) {
        const l = seasonAtDate.leaderboard.find(l => `${l.guildName} [${l.guildNameplate}]` === header);

        line.push(l ? l.level : '');
      }
      lines.push(line);
    }

    lines.unshift(headers);

    if (type === 'flourish') {
      lines = lines[0].map((_: any, colIndex: any) => lines.map((row: any) => row[colIndex]));
    }

    const linesToText = [];
    for (const line of lines) {
      linesToText.push(line.join(','));
    }

    const link = document.createElement('a');
    const file = new Blob([linesToText.join('\n')], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = 'export.csv';
    link.click();
    URL.revokeObjectURL(link.href);

    this.ngxUiLoaderService.stop();
  }
}