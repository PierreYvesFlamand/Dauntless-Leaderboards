import { AfterViewInit, Component } from '@angular/core';
import { DatabaseService, WEBSITE_TRIAL } from '../../services/database.service';
import { SharedService } from '../../services/shared.service';
import { BEHEMOTH } from '../../../../../script/src/types/types';

@Component({
  selector: 'dl-trials',
  templateUrl: './trials.component.html',
  styleUrls: ['./trials.component.scss'],
  standalone: false
})
export class TrialsComponent implements AfterViewInit {
  constructor(
    public sharedService: SharedService,
    public databaseService: DatabaseService
  ) { }

  ngAfterViewInit(): void {
    this.applyFilter();
    this.loadBehemoths();
  }

  public behemoths: BEHEMOTH[] = [];
  public trials: WEBSITE_TRIAL[] = [];
  public total: number = 0;
  public isLoading: boolean = true;
  public filters: {
    behemothId: number
    page: number
  } = {
      behemothId: 0,
      page: 1
    };

  public applyFilter() {
    this.trials = [];
    this.isLoading = true;

    let response = {
      data: JSON.parse(JSON.stringify(this.databaseService.data.trials)) as WEBSITE_TRIAL[],
      total: 0
    };

    response.data = response.data.filter(t => (this.sharedService.showPreAwakening && t.week < 282) || (this.sharedService.showPostAwakening && t.week >= 282));

    if (this.filters.behemothId) {
      response.data = response.data.filter(r => r.behemothName === this.databaseService.data.behemoths[this.filters.behemothId - 1].name);
    }

    response.total = response.data.length;
    response.data = response.data.slice(0 + (this.filters.page - 1) * 20, 20 + (this.filters.page - 1) * 20);

    if (!response) return;
    this.isLoading = false;
    this.trials = response.data;
    this.total = response.total;
  }

  public loadBehemoths() {
    this.behemoths = this.databaseService.data.behemoths;
    this.behemoths.sort((a, b) => this.getNamePartToCompare(a.name.toLowerCase()).localeCompare(this.getNamePartToCompare(b.name.toLowerCase())));
  }

  public getNamePartToCompare(str: string): string {
    const splits = str.split(' ');
    if(splits.length === 2) return splits[1];
    return splits[0];
  }

  public Number: (str: string) => number = str => Number(str);

  public getNumberOfPages(): number {
    return Math.ceil(this.total / 20);
  }
}
