import { AfterViewInit, Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { SharedService } from '../../services/shared.service';
import { API_TRIAL_LIST, BEHEMOTH, TRIAL_LIST_ITEM } from '../../../../../backend/src/types/types';

@Component({
  selector: 'dl-trials',
  templateUrl: './trials.component.html',
  styleUrls: ['./trials.component.scss']
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
  public trials: TRIAL_LIST_ITEM[] = [];
  public total: number = 0;
  public isLoading: boolean = true;
  public filters: {
    behemothId: number
    page: number
  } = {
      behemothId: 0,
      page: 1
    };

  public async applyFilter() {
    this.trials = [];
    this.isLoading = true;
    const paramsAsString = Object.keys(this.filters).reduce<string[]>((p, k) => { return [...p, `${k}=${(<any>this.filters)[k] || ''}`] }, []).join('&');
    const response = await this.databaseService.fetch<API_TRIAL_LIST>(`trials?${paramsAsString}`);
    if (!response) return;
    this.isLoading = false;
    this.trials = response.data;
    this.total = response.total;
  }

  public async loadBehemoths() {
    this.behemoths = (await this.databaseService.fetch<BEHEMOTH[]>(`behemoths`)) || [];
  }

  public Number: (str: string) => number = str => Number(str);

  public getNumberOfPages(): number {
    return Math.ceil(this.total / 20);
  }
}
