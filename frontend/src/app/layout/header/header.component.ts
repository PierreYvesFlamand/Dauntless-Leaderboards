import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { DatabaseService } from '../../services/database.service';
import { API_ME } from '../../../../../backend/src/types/types';

@Component({
  selector: 'dl-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public theme: string = '';
  public playerId: number = -1;
  public guildId: number = -1;
  public me?: API_ME;

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
    this.me = await this.databaseService.fetch<API_ME>(`me?playerId=${this.playerId}&guildId=${this.guildId}`);
  }
}