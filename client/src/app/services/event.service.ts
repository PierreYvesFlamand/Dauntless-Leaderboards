import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalstorageService } from './localstorage.service';
import { ALL_SEASONS } from '../types';
import { ALL_GUILDS } from '../../../../scripts/src/types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(
    private localstorageService: LocalstorageService
  ) { }

  public async init() {
    await this.initAllSeasons();
    setInterval(this.initAllSeasons.bind(this), 1000 * 30);
    this.initTheme();
  }

  // Title
  private _titleObservable = new BehaviorSubject<string>('');
  public titleObservable = this._titleObservable.asObservable();

  public updateTitle(string: string): void {
    this._titleObservable.next(string);
  }

  // Theme
  private _themeObservable = new BehaviorSubject<'light' | 'dark'>('light');
  public themeObservable = this._themeObservable.asObservable();

  public updateTheme(theme: 'light' | 'dark'): void {
    this._themeObservable.next(theme);
    this.localstorageService.setByKey('theme', theme);
  }

  // Active menu
  private _activeMenuObservable = new BehaviorSubject<string>('');
  public activeMenuObservable = this._activeMenuObservable.asObservable();

  public initTheme() {
    let theme = this.localstorageService.getByKey<string>('theme');
    if (theme !== 'light' && theme !== 'dark') theme = 'light';
    this.updateTheme(theme as 'light' | 'dark');
  }

  public updateActiveMenu(string: string): void {
    this._activeMenuObservable.next(string);
  }

  // All seasons
  private _allSeasonsObservable = new BehaviorSubject<ALL_SEASONS>({});
  public allSeasonsObservable = this._allSeasonsObservable.asObservable();

  public async initAllSeasons(): Promise<void> {
    const res = await fetch(`${environment.backendUrl}/data/gauntlets/all-seasons.json`);
    const allSeasons: ALL_SEASONS = await res.json();

    const allGuilds: ALL_GUILDS = [];

    for (const gauntletId of Object.keys(allSeasons).reverse()) {
      allSeasons[gauntletId].leaderboard.forEach((leaderboardItem, index) => {
        let guild = allGuilds.find(g => g.guildNameplate === leaderboardItem.guildNameplate);

        if (!guild) {
          guild = {
            guildName: leaderboardItem.guildName,
            guildNameplate: leaderboardItem.guildNameplate,
            leaderboardPositions: []
          };

          allGuilds.push(guild);
        }

        guild.leaderboardPositions.push({
          [gauntletId]: index + 1
        });
      });
    }

    this._allSeasonsObservable.next(allSeasons);
    this._allGuildsObservable.next(allGuilds);
  }

  // All guilds
  private _allGuildsObservable = new BehaviorSubject<ALL_GUILDS>([]);
  public allGuildsObservable = this._allGuildsObservable.asObservable();
}
