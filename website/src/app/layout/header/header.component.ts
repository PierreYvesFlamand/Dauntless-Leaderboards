import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { DatabaseService, WEBSITE_ME } from '../../services/database.service';

@Component({
  selector: 'dl-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent {
  public theme: string = '';
  public playerId: number = -1;
  public guildId: number = -1;
  public me?: WEBSITE_ME;

  constructor(
    public sharedService: SharedService,
    public databaseService: DatabaseService
  ) {
    this.sharedService.theme$.subscribe(value => this.theme = value);
    this.sharedService.guildId$.subscribe(value => {
      this.guildId = value;
      this.onGuildIdOrPlayerIdUpdate();
    });
    this.sharedService.playerId$.subscribe(value => {
      this.playerId = value;
      this.onGuildIdOrPlayerIdUpdate();
    });
  }

  public async onGuildIdOrPlayerIdUpdate() {    
    this.me = {
      player: {
        id: this.playerId,
        name: this.databaseService.data.players[this.playerId - 1]?.playerNames.sort((a, b) => a.platformId - b.platformId)[0]?.name || ''
      },
      guild: {
        id: this.guildId,
        tag: this.databaseService.data.guilds[this.guildId - 1]?.tag || '',
        iconFilename: this.databaseService.data.guilds[this.guildId - 1]?.iconFilename || '',
      }
    }
  }
}