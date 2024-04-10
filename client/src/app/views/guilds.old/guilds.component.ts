import { Component, OnDestroy } from '@angular/core';
import { TitleService } from '../../services/title.service';
import { ActiveMenuService } from '../../services/active-menu.service';
import { Subscription } from 'rxjs';
import { AllSeasonsService } from '../../services/all-seasons.service';
import { ALL_SEASONS, SEASON_DETAIL } from '../../types';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
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
    private ngxUiLoaderService: NgxUiLoaderService,
    private sanitizer: DomSanitizer
  ) {
    this.titleService.updateTitle('Guilds');
    this.activeMenuService.updateActiveMenu('guilds');
    this.allGuildsSubscription = this.allSeasonsService.allGuildsObservable.subscribe(data => this.allGuilds = data);

    this.activatedRoute.queryParams.subscribe(params => {
      const search = params['search'];
      if (search) {
        this.guildSearchInput = search;
      }
      this.onGuildSearch(this.guildSearchInput);
    });
  }

  ngOnDestroy(): void {
    this.allGuildsSubscription.unsubscribe();
  }

  public onGuildSearch(searchInput: string) {
    const guild = this.allGuilds.find(g => `${g.guildName} [${g.guildNameplate}]` === searchInput);
    this.guild = guild;
    window.history.replaceState({}, '', `/guilds${searchInput.length ? `?search=${searchInput}` : ``}`);
  }
}