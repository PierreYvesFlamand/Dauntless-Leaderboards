import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { GUILD_DETAIL } from '../../../../../../server/src/types';
import { DatabaseService } from '../../../services/database.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-guild-detail',
  templateUrl: './guild-detail.component.html',
  styleUrls: ['./guild-detail.component.scss']
})
export class GuildDetailComponent {
  public guild?: GUILD_DETAIL;
  public numberOfSeasons: number = 0;
  public environment = environment;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    public databaseService: DatabaseService,
    private router: Router
  ) {
    this.eventService.updateActiveMenu('');

    this.numberOfSeasons = Object.keys(this.databaseService.allSeasons).length;

    this.activatedRoute.params.subscribe(params => {
      this.guild = this.databaseService.allGuilds.find(g => g.guildNameplate.toLowerCase() === (params['guildTag'] || '').toLowerCase());
      if (!this.guild) {
        this.router.navigate(['guilds']);
      } else {
        this.eventService.updateTitle('');
      }
    });
  }

  public getSeasonNumber(seasonId?: string): number {
    if (!seasonId) return 69;
    return Number(seasonId.slice(15));
  }
}