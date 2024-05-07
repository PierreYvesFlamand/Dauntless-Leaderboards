import { Component } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { API_GUILD } from '../../../../../../backend/src/types/types';
import { HtmlTagsService } from '../../../services/html-tags.service';

@Component({
  selector: 'dl-guild-detail',
  templateUrl: './guild-detail.component.html',
  styleUrl: './guild-detail.component.scss'
})
export class GuildDetailComponent {
  public guildData?: API_GUILD;

  constructor(
    private databaseService: DatabaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public sharedService: SharedService,
    public htmlTagsService: HtmlTagsService
  ) {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'] || -1;
      if (id < 0 || isNaN(id)) this.router.navigate(['guilds']);
      this.fetchData(id);
    });
  }

  public async fetchData(id: number) {
    this.guildData = await this.databaseService.fetch<API_GUILD>(`guilds/${id}`);
    if (!this.guildData) this.router.navigate(['guilds']);

    this.htmlTagsService.set({
      title: `Dauntless Leaderboards - ${this.guildData?.guild_info.name} [${this.guildData?.guild_info.tag}]`,
      description: this.guildData?.guild_info.detail_html.length ? this.guildData.guild_info.detail_html : undefined,
      image: this.guildData?.guild_info.icon_filename ? this.sharedService.getImgPath(this.guildData.guild_info.icon_filename, 'guilds') : undefined
    });
  }

  public Number: (str: string) => number = str => Number(str);
}
