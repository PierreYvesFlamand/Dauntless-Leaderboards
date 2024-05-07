import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { API_SEASON } from '../../../../../backend/src/types/types';

@Component({
  selector: 'dl-seasons',
  templateUrl: './seasons.component.html',
  styleUrl: './seasons.component.scss'
})
export class SeasonsComponent {
  public seasonData?: API_SEASON;
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
      this.seasonData = await this.databaseService.fetch<API_SEASON>(`season/${seasonId}`);
    }
    if (!this.seasonData) return;
    this.seasonData.all_seasons_info = this.seasonData.all_seasons_info.sort((a, b) => b.season - a.season);

    const segments: (string | number)[] = ['seasons', this.seasonData.season_info.season];

    if (this.showChart && this.seasonData.season_info.flourish_id) segments.push('chart');
    else this.showChart = false;

    this.router.navigate(segments, { replaceUrl: shouldReplaceUrl });
    this.selectedSeasonId = this.seasonData.season_info.season;
  }

  public async onSeasonChange(seasonId: number) {
    await this.fetchData(seasonId, false);
  }

  public toggleShowChart() {
    this.showChart = !this.showChart;
    this.fetchData(this.selectedSeasonId, false);
  }

  public getFlourishUrl(): string {
    if (!this.seasonData) return '';
    return `https://flo.uri.sh/visualisation/${this.seasonData.season_info.flourish_id}/embed`;
  }
}
