import { AfterViewInit, Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { DatabaseService, PLAYER_COUNT_KEY, WEBSITE_PLAYER } from '../../services/database.service';
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

  public readonly starIcon = '<i class="fa-regular fa-star"></i>';

  // group & label are translation keys
  public sortColumns: { key: string, group: string, label: string }[] = [
    { key: 'nbrSoloTop1', group: 'common.solo', label: 'players.top1s' },
    { key: 'nbrSoloTop5', group: 'common.solo', label: 'players.top5s' },
    { key: 'nbrSoloTop100', group: 'common.solo', label: 'players.top100s' },
    { key: 'nbrGroupTop1', group: 'common.group', label: 'players.top1s' },
    { key: 'nbrGroupTop5', group: 'common.group', label: 'players.top5s' },
    { key: 'nbrGroupTop100', group: 'common.group', label: 'players.top100s' }
  ];

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

    response.data = response.data.filter(r => r.playerNames.map(n => n.name).join('').toLowerCase().includes(this.filters.textSearch.toLowerCase()));
    if (this.sharedService.favoritesOnly) response.data = response.data.filter(r => this.sharedService.hasFavoritePlayer(r.id));
    // Only players ranked in the eras shown (top 100 counts every top 1 and top 5 too)
    response.data = response.data.filter(r => this.getStat(r, 'nbrSoloTop100') + this.getStat(r, 'nbrGroupTop100') > 0);

    // No sort column: default order (Solo top 1s)
    const key = this.filters.orderByField || 'nbrSoloTop1';
    const direction = this.filters.orderByDirection === 'ASC' && this.filters.orderByField ? 1 : -1;
    response.data.sort((a, b) => direction * (this.getStat(a, key) - this.getStat(b, key)));

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

  // Stat shown in the table: sum of the eras shown (era selector / settings)
  public getStat(player: WEBSITE_PLAYER, key: string): number {
    return this.sharedService.shownEras.reduce((sum, era) => sum + player.eraCounts[era][key as PLAYER_COUNT_KEY], 0);
  }

  public Number: (str: string) => number = str => Number(str);

  public getNumberOfPages(): number {
    return Math.ceil(this.total / 20);
  }
}
