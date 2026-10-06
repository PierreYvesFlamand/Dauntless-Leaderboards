import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { DatabaseService, WEBSITE_GUILD, WEBSITE_PLAYER } from '../../services/database.service';

@Component({
  selector: 'dl-favorites',
  templateUrl: './favorites.component.html',
  standalone: false
})
export class FavoritesComponent {
  public readonly starIcon = '<i class="fa-regular fa-star"></i>';

  constructor(
    public sharedService: SharedService,
    private databaseService: DatabaseService
  ) { }

  // Yours first, then alphabetical
  public get players(): WEBSITE_PLAYER[] {
    return this.sharedService.favoritePlayers
      .map(id => this.databaseService.data.players[id - 1])
      .filter((player): player is WEBSITE_PLAYER => !!player)
      .sort((a, b) => Number(b.id === this.sharedService.playerId) - Number(a.id === this.sharedService.playerId) || this.playerName(a).localeCompare(this.playerName(b)));
  }

  public get guilds(): WEBSITE_GUILD[] {
    return this.sharedService.favoriteGuilds
      .map(id => this.databaseService.data.guilds[id - 1])
      .filter((guild): guild is WEBSITE_GUILD => !!guild)
      .sort((a, b) => Number(b.id === this.sharedService.guildId) - Number(a.id === this.sharedService.guildId) || a.name.localeCompare(b.name));
  }

  private playerName(player: WEBSITE_PLAYER): string {
    return [...player.playerNames].sort((a, b) => a.platformId - b.platformId)[0]?.name || '';
  }
}
