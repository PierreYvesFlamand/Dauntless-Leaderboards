import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'dl-seasons',
  templateUrl: './seasons.component.html',
  styleUrl: './seasons.component.scss'
})
export class SeasonsComponent {
  public seasonData?: any;

  constructor(
    private databaseService: DatabaseService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      let seasonId: number | string = Number(params['id']) ?? -1;
      if (isNaN(seasonId) || seasonId === 0 || seasonId < -1) seasonId = -1;
      this.fetchData(seasonId);
    });
  }

  private async fetchData(seasonId: number) {
    this.seasonData = await this.databaseService.fetch<any>(`season/${seasonId}`);
    this.router.navigate(['seasons', this.seasonData.seasonInfo.season], { replaceUrl: true });
  }

  public test(a: any) {
    console.log(a);
  }
}
