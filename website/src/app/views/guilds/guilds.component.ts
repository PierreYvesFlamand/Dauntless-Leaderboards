import { AfterViewInit, Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { DatabaseService, WEBSITE_GUILD } from '../../services/database.service';

@Component({
  selector: 'dl-guilds',
  templateUrl: './guilds.component.html',
  styleUrl: './guilds.component.scss',
  standalone: false
})
export class GuildsComponent implements AfterViewInit {
  constructor(
    public sharedService: SharedService,
    public databaseService: DatabaseService
  ) { }

  ngAfterViewInit(): void {
    this.applyFilter();
  }

  public guilds: WEBSITE_GUILD[] = [];
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

    let response = {
      data: this.databaseService.data.guilds,
      total: 0
    };

    response.data = response.data.filter(r => [r.name.toLowerCase(), r.tag.toLowerCase()].join('').toLowerCase().includes(this.filters.textSearch.toLowerCase()));

    response.data.sort((a, b) => {
      let val1, val2;
      switch (this.filters.orderByField) {
        case 'rating': val1 = a.rating; val2 = b.rating; break;
        case 'nbrTop1': val1 = a.nbrTop1; val2 = b.nbrTop1; break;
        case 'nbrTop5': val1 = a.nbrTop5; val2 = b.nbrTop5; break;
        case 'nbrTop100': val1 = a.nbrTop100; val2 = b.nbrTop100; break;
        case 'totalLevelCleared': val1 = a.totalLevelCleared; val2 = b.totalLevelCleared; break;
        default: val1 = a.rating; val2 = b.rating;
      }

      if (this.filters.orderByDirection === 'ASC' && this.filters.orderByField) return val1 - val2;
      else return val2 - val1;
    });

    response.total = response.data.length;
    response.data = response.data.slice(0 + (this.filters.page - 1) * 20, 20 + (this.filters.page - 1) * 20);

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
