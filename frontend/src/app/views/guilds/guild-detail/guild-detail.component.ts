import { Component } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { API_GUILD } from '../../../../../../backend/src/types/types';

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
    public sharedService: SharedService
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
  }

  public Number: (str: string) => number = str => Number(str);
}
