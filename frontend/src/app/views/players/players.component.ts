import { AfterViewInit, Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { DatabaseService } from '../../services/database.service';
import { API_PLAYER_LIST, PLAYER_LIST_ITEM } from '../../../../../backend/src/types/types';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'dl-players',
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss'
})
export class PlayersComponent implements AfterViewInit {
  public textSearchUpdate = new Subject<string>();

  constructor(
    public sharedService: SharedService,
    public databaseService: DatabaseService
  ) {
    this.textSearchUpdate.pipe(debounceTime(1250), distinctUntilChanged()).subscribe(this.applyFilter.bind(this));
  }

  ngAfterViewInit(): void {
    this.applyFilter();
  }

  public players: PLAYER_LIST_ITEM[] = [];
  public total: number = 0;
  public isLoading: boolean = true;
  public filters: {
    textSearch: string
    orderByField: string | null
    orderByDirection: 'ASC' | 'DESC'
    page: number
  } = {
      textSearch: '',
      orderByField: 'nbrSoloTop1',
      orderByDirection: 'DESC',
      page: 1
    };

  public async applyFilter() {
    this.players = [];
    this.isLoading = true;
    const paramsAsString = Object.keys(this.filters).reduce<string[]>((p, k) => { return [...p, `${k}=${(<any>this.filters)[k] || ''}`] }, []).join('&');
    const response = await this.databaseService.fetch<API_PLAYER_LIST>(`players?${paramsAsString}`);
    if (!response) return;
    this.isLoading = false;
    this.players = response.data;
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
