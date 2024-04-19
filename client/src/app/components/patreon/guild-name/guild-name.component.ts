import { Component, Input, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-guild-name',
  templateUrl: './guild-name.component.html',
  styleUrls: ['./guild-name.component.scss']
})
export class GuildNameComponent implements OnInit {
  @Input() public guildName?: string;
  @Input() public guildNameplate?: string;
  @Input() public useBig?: boolean = false;
  @Input() public notCustomTagStyle?: boolean = false;
  public environment = environment;

  public mode: 'img' | null = null;
  public content: string = '';

  constructor(
    private databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    if (this.guildNameplate && this.databaseService.allGuildsPerks[this.guildNameplate] !== undefined) {
      const perksString = this.databaseService.allGuildsPerks[this.guildNameplate];

      if (perksString === '') {
        this.mode = 'img';
        this.content = `${environment.backendUrl}/data/img/guilds/${this.guildNameplate}/icon.png`;
      } else if (perksString.split('.').length === 2) {
        this.mode = 'img';
        this.content = `${environment.backendUrl}/data/img/guilds/${this.guildNameplate}/${perksString}`;
      }
    }
  }
}