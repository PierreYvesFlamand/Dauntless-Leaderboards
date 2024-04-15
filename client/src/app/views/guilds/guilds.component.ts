import { Component, OnDestroy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs';
import { ALL_GUILDS, GUILD_DETAIL } from '../../../../../scripts/src/types';

@Component({
  selector: 'app-guilds',
  templateUrl: './guilds.component.html',
  styleUrls: ['./guilds.component.scss']
})
export class GuildsComponent implements OnDestroy {
  public allGuilds: ALL_GUILDS = [];
  public allGuildsFiltered: ALL_GUILDS = [];
  private allGuildsSubscription: Subscription;
  public guildSearchInput: string = '';
  public guild?: GUILD_DETAIL;
  public filters: {
    textSearch: string
    sortCol: string | null,
    sortAsc: boolean
  } = {
      textSearch: '',
      sortCol: 'rating',
      sortAsc: false
    };

  constructor(
    private eventService: EventService
  ) {
    this.eventService.updateTitle('Guilds');
    this.eventService.updateActiveMenu('guilds');
    this.allGuildsSubscription = this.eventService.allGuildsObservable.subscribe(data => this.allGuilds = data.sort((a, b) => b.rating - a.rating));
    this.applyFilter();
  }

  ngOnDestroy(): void {
    this.allGuildsSubscription.unsubscribe();
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
    this.allGuildsFiltered = this.allGuilds.filter(g => g.guildName.toLowerCase().includes(this.filters.textSearch) || g.guildNameplate.toLowerCase().includes(this.filters.textSearch))

    if (this.filters.sortCol && Object.keys(this.allGuilds[0]).includes(this.filters.sortCol)) {
      this.allGuildsFiltered = this.allGuildsFiltered.sort((a, b) => (<any>b)[this.filters.sortCol as string] - (<any>a)[this.filters.sortCol as string]);
      if (this.filters.sortAsc === true) this.allGuildsFiltered = this.allGuildsFiltered.reverse();
    }
  }

  public getArrowIcon(key: string): string {
    if (this.filters.sortCol !== key) return 'fa-arrows-up-down';
    else if (this.filters.sortAsc) return 'fa-arrow-up-long';
    return 'fa-arrow-down-long';
  }
}