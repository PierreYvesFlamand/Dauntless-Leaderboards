import { Component, OnDestroy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ALL_GUILDS, GUILD_DETAIL } from '../../../../../scripts/src/types';

@Component({
  selector: 'app-guilds',
  templateUrl: './guilds.component.html',
  styleUrls: ['./guilds.component.scss']
})
export class GuildsComponent implements OnDestroy {
  public allGuilds: ALL_GUILDS = [];
  private allGuildsSubscription: Subscription;
  public guildSearchInput: string = '';
  public guild?: GUILD_DETAIL;

  constructor(
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

    this.eventService.updateTitle('Guilds');
    this.eventService.updateActiveMenu('guilds');
    this.allGuildsSubscription = this.eventService.allGuildsObservable.subscribe(data => this.allGuilds = data.sort((a, b) => a.guildName.toLowerCase().localeCompare(b.guildName.toLowerCase())));

    const guildTag = this.activatedRoute.firstChild?.snapshot.params['guildTag'];
    if (guildTag) {
      this.guildSearchInput = guildTag;
    }
    this.onGuildSearch(`[${this.guildSearchInput}]`);
  }

  ngOnDestroy(): void {
    this.allGuildsSubscription.unsubscribe();
  }

  public onGuildSearch(searchInput: string) {
    const realSearchInput = this.getNameplateFromString(searchInput);

    const guild = this.allGuilds.find(g => g.guildNameplate === realSearchInput);
    this.guild = guild;

    if (this.guild) {
      this.guildSearchInput = `${this.guild.guildName} [${this.guild.guildNameplate}]`
      this.router.navigate([this.guild.guildNameplate], { relativeTo: this.activatedRoute });
    } else {
      this.router.navigate([], { relativeTo: this.activatedRoute });
    }
  }

  public getNameplateFromString(string: string): string {
    return string.split('[')[1].split(']')[0];
  }
}