import { Component } from '@angular/core';
import { DatabaseService, WEBSITE_GAUNTLET } from '../../services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'dl-seasons',
  templateUrl: './seasons.component.html',
  styleUrl: './seasons.component.scss',
  standalone: false
})
export class SeasonsComponent {
  public seasonData?: WEBSITE_GAUNTLET;
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

  private fetchData(seasonId: number, shouldReplaceUrl: boolean = true) {
    if (seasonId !== this.selectedSeasonId) {
      this.seasonData = undefined;
      this.seasonData = this.databaseService.data.gauntlets[seasonId - 1];
    }
    if (!this.seasonData) {
      this.seasonData = this.databaseService.data.gauntlets[this.databaseService.data.gauntlets.length - 1];
    }    
    this.seasonData.allGauntletsInfo = this.seasonData.allGauntletsInfo.sort((a, b) => b.season - a.season);

    const segments: (string | number)[] = ['seasons', this.seasonData.gauntletInfo.season];

    if (this.showChart && this.seasonData.gauntletInfo.flourishId) segments.push('chart');
    else this.showChart = false;

    setTimeout(() => {
      this.router.navigate(segments, { replaceUrl: shouldReplaceUrl });
    }, 50);
    this.selectedSeasonId = this.seasonData.gauntletInfo.season;
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
    return `https://flo.uri.sh/visualisation/${this.seasonData.gauntletInfo.flourishId}/embed`;
  }
}
