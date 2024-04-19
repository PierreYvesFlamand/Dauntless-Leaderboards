import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../../services/database.service';
import { ALL_GUILDS } from '../../../../../server/src/types';

@Component({
  selector: 'app-guilds',
  templateUrl: './guilds.component.html',
  styleUrls: ['./guilds.component.scss']
})
export class GuildsComponent implements AfterViewInit, OnDestroy {
  public allGuildsFiltered: ALL_GUILDS = [];
  // Test purpose when will work on pagination
  // public itemPerPage: number = 20;
  // public totalItems: number = 0;

  public filters: {
    textSearch: string
    sortCol: string | null,
    sortAsc: boolean
    // Test purpose when will work on pagination
    // page: number
  } = {
      textSearch: '',
      sortCol: 'rating',
      sortAsc: false,
      // Test purpose when will work on pagination
      // page: 10
    };

  private guildTagSubscription: Subscription;
  public userGuildTag: string = '';

  constructor(
    private eventService: EventService,
    private databaseService: DatabaseService
  ) {
    this.eventService.updateTitle('Guilds');
    this.eventService.updateActiveMenu('guilds');
    this.guildTagSubscription = this.eventService.guildTagObservable.subscribe(newValue => this.userGuildTag = newValue);
  }

  ngAfterViewInit(): void {
    this.applyFilter();
  }

  ngOnDestroy(): void {
    this.guildTagSubscription.unsubscribe();
  }

  public onGuildSearch(searchInput: string) {
    this.filters.textSearch = searchInput;
    this.applyFilter();
  }

  public changeFilter(key: string) {
    if (this.filters.sortCol !== key) {
      this.filters.sortCol = key;
      this.filters.sortAsc = false;
    } else {
      if (this.filters.sortAsc === false) {
        this.filters.sortAsc = true
      } else {
        this.filters.sortCol = null;
      }
    }

    this.applyFilter();
  }

  public applyFilter() {
    this.allGuildsFiltered = this.databaseService.allGuilds
      .sort((a, b) => b.rating - a.rating)
      .filter(g => g.guildName.toLowerCase().includes(this.filters.textSearch) || g.guildNameplate.toLowerCase().includes(this.filters.textSearch));

    if (this.filters.sortCol && Object.keys(this.databaseService.allGuilds[0]).includes(this.filters.sortCol)) {
      this.allGuildsFiltered = this.allGuildsFiltered.sort((a, b) => (<any>b)[this.filters.sortCol as string] - (<any>a)[this.filters.sortCol as string]);
      if (this.filters.sortAsc === true) this.allGuildsFiltered = this.allGuildsFiltered.reverse();
    }

    // Test purpose when will work on pagination
    // this.totalItems = this.allGuildsFiltered.length;
    // this.allGuildsFiltered = this.allGuildsFiltered.slice(this.itemPerPage * (this.filters.page - 1), this.itemPerPage * this.filters.page);
  }

  public getArrowIcon(key: string): string {
    if (this.filters.sortCol !== key) return 'fa-arrows-up-down';
    else if (this.filters.sortAsc) return 'fa-arrow-up-long';
    return 'fa-arrow-down-long';
  }

  // Test purpose when will work on pagination
  // public getNumberOfPages(): number {
  //   return Math.ceil(this.totalItems / this.itemPerPage);
  // }
}