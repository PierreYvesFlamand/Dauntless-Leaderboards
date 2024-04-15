import { Component, Input, OnDestroy } from '@angular/core';
import { ALL_GUILDS, GUILD_DETAIL } from '../../../../../../scripts/src/types';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-guild-detail',
  templateUrl: './guild-detail.component.html',
  styleUrls: ['./guild-detail.component.scss']
})
export class GuildDetailComponent implements OnDestroy {
  private allGuildsSubscription: Subscription;
  public guild?: GUILD_DETAIL;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {
    this.eventService.updateActiveMenu('');

    const guildTag = this.activatedRoute?.snapshot.params['guildTag'];

    this.allGuildsSubscription = this.eventService.allGuildsObservable.subscribe(data => {
      this.guild = data.find(g => g.guildNameplate.toLowerCase() === guildTag.toLowerCase());
      if (!this.guild) {
        this.router.navigate(['guilds']);
      } else {
        this.eventService.updateTitle(`${this.guild.guildName} [${this.guild.guildNameplate}]`);
      }
    });
  }

  ngOnDestroy(): void {
    this.allGuildsSubscription.unsubscribe();
  }

  public getSeasonNumber(seasonId?: string): number {
    if (!seasonId) return 69;
    return Number(seasonId.slice(15));
  }
}