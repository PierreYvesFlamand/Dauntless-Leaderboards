import { AfterViewInit, Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { DatabaseService, WEBSITE_PLAYER } from '../../services/database.service';
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
    this.textSearchUpdate.pipe(debounceTime(0), distinctUntilChanged()).subscribe(this.applyFilter.bind(this));
  }

  ngAfterViewInit(): void {
    this.applyFilter();
  }

  public players: WEBSITE_PLAYER[] = [];
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

    let response = {
      data: this.databaseService.data.players,
      total: 0
    };

    response.data = response.data.filter(r => r.playerNames.map(n=>n.name).join('').toLowerCase().includes(this.filters.textSearch.toLowerCase()));

    response.data.sort((a, b) => {
      let val1, val2;
      switch (this.filters.orderByField) {
        case 'nbrSoloTop1': val1 = a.nbrSoloTop1; val2 = b.nbrSoloTop1; break;
        case 'nbrSoloTop5': val1 = a.nbrSoloTop5; val2 = b.nbrSoloTop5; break;
        case 'nbrSoloTop100': val1 = a.nbrSoloTop100; val2 = b.nbrSoloTop100; break;
        case 'nbrGroupTop1': val1 = a.nbrGroupTop1; val2 = b.nbrGroupTop1; break;
        case 'nbrGroupTop5': val1 = a.nbrGroupTop5; val2 = b.nbrGroupTop5; break;
        case 'nbrGroupTop100': val1 = a.nbrGroupTop100; val2 = b.nbrGroupTop100; break;
        default: val1 = a.nbrSoloTop1; val2 = b.nbrSoloTop1;
      }

      if (this.filters.orderByDirection === 'ASC' && this.filters.orderByField) return val1 - val2;
      else return val2 - val1;
    });

    response.total = response.data.length;
    response.data = response.data.slice(0 + (this.filters.page - 1) * 20, 20 + (this.filters.page - 1) * 20);

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
