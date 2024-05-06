import { AfterViewInit, Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { DatabaseService } from '../../services/database.service';
import { API_GUILD_LIST, GUILD_LIST_ITEM } from '../../../../../backend/src/types/types';

@Component({
  selector: 'dl-guilds',
  templateUrl: './guilds.component.html',
  styleUrl: './guilds.component.scss'
})
export class GuildsComponent implements AfterViewInit {
  constructor(
    public sharedService: SharedService,
    public databaseService: DatabaseService
  ) { }

  ngAfterViewInit(): void {
    this.applyFilter();
  }

  public guilds: GUILD_LIST_ITEM[] = [];
  public total: number = 0;
  public isLoading: boolean = true;
  public filters: {
    textSearch: string
    orderByField: string | null
    orderByDirection: 'ASC' | 'DESC'
    page: number
  } = {
      textSearch: '',
      orderByField: 'rating',
      orderByDirection: 'DESC',
      page: 1
    };

  public async applyFilter() {
    this.guilds = [];
    this.isLoading = true;
    const paramsAsString = Object.keys(this.filters).reduce<string[]>((p, k) => { return [...p, `${k}=${(<any>this.filters)[k] || ''}`] }, []).join('&');
    const response = await this.databaseService.fetch<API_GUILD_LIST>(`guilds?${paramsAsString}`);
    if (!response) return;
    this.isLoading = false;
    this.guilds = response.data;
    this.total = response.total;
  }

  public changeFilter(key: string) {
    if (this.filters.orderByField !== key) {
      this.filters.orderByField = key;
      this.filters.orderByDirection = 'DESC';
    } else {
      if (this.filters.orderByDirection === 'DESC') {
        this.filters.orderByDirection = 'ASC';
      } else {
        this.filters.orderByField = null;
      }
    }

    this.applyFilter();
  }

  public getArrowIcon(key: string): string {
    if (this.filters.orderByField !== key) return 'fa-arrows-up-down';
    else if (this.filters.orderByDirection === 'ASC') return 'fa-arrow-up-long';
    return 'fa-arrow-down-long';
  }

  public Number: (str: string) => number = str => Number(str);

  public getNumberOfPages(): number {
    return Math.ceil(this.total / 20);
  }
}
