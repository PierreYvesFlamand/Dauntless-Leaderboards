import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SEASON_DATA } from '../../../../../backend/src/types/types';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'dl-seasons',
  templateUrl: './seasons.component.html',
  styleUrl: './seasons.component.scss'
})
export class SeasonsComponent {
  public seasonData?: SEASON_DATA;
  public selectedSeasonId: number = 0;
  public showChart: boolean = false;

  constructor(
    private databaseService: DatabaseService,
    private router: Router,
    public sharedService: SharedService,
    private activatedRoute: ActivatedRoute
  ) {

    this.activatedRoute.params.subscribe(params => {
      let seasonId: number | string = Number(params['id']) ?? -1;
      if (isNaN(seasonId) || seasonId === 0 || seasonId < -1) seasonId = -1;
      this.showChart = this.activatedRoute.snapshot.data['showChart'] === true ? true : false;

      this.fetchData(seasonId);
    });
  }

  private async fetchData(seasonId: number, shouldReplaceUrl: boolean = true) {
    if (seasonId !== this.selectedSeasonId) {
      this.seasonData = undefined;
      this.seasonData = await this.databaseService.fetch<SEASON_DATA>(`season/${seasonId}`);
    }
    if (!this.seasonData) return;

    const segments: (string | number)[] = ['seasons', this.seasonData.seasonInfo.season];

    if (this.showChart && this.seasonData.seasonInfo.flourish_id) segments.push('chart');
    else this.showChart = false;

    this.router.navigate(segments, { replaceUrl: shouldReplaceUrl });
    this.selectedSeasonId = this.seasonData.seasonInfo.season;
  }

  public async onSeasonChange(seasonId: number) {
    await this.fetchData(seasonId, false);
  }

  public toggleShowChart() {
    this.showChart = !this.showChart;
    this.fetchData(this.selectedSeasonId, false);
  }

  public getFlourishUrl(flourishId: string = ''): string {
    return `https://flo.uri.sh/visualisation/${flourishId}/embed`;
  }
}
