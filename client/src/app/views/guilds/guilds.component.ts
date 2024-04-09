import { Component, OnDestroy } from '@angular/core';
import { TitleService } from '../../services/title.service';
import { ActiveMenuService } from '../../services/active-menu.service';
import { Subscription } from 'rxjs';
import { AllSeasonsService } from '../../services/all-seasons.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DomSanitizer } from '@angular/platform-browser';
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
    private titleService: TitleService,
    private activeMenuService: ActiveMenuService,
    private allSeasonsService: AllSeasonsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

    this.titleService.updateTitle('Guilds');
    this.activeMenuService.updateActiveMenu('guilds');
    this.allGuildsSubscription = this.allSeasonsService.allGuildsObservable.subscribe(data => this.allGuilds = data);

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