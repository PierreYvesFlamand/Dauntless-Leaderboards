import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ALL_SEASONS } from '../types';
import { environment } from '../../environments/environment';
import { ALL_GUILDS } from '../../../../scripts/src/types';

@Injectable({
  providedIn: 'root'
})
export class AllSeasonsService {
  private _allSeasonsObservable = new BehaviorSubject<ALL_SEASONS>({});
  public allSeasonsObservable = this._allSeasonsObservable.asObservable();

  private _allGuildsObservable = new BehaviorSubject<ALL_GUILDS>([]);
  public allGuildsObservable = this._allGuildsObservable.asObservable();

  public async fetch(): Promise<void> {
    const res = await fetch(`${environment.backendUrl}/data/all-seasons.json`);
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
}
