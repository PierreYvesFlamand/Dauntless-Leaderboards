import { Component } from '@angular/core';
import { DatabaseService, WEBSITE_GUILD } from '../../../services/database.service';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'dl-guild-detail',
  templateUrl: './guild-detail.component.html',
  styleUrl: './guild-detail.component.scss',
  standalone: false
})
export class GuildDetailComponent {
  public guildData?: WEBSITE_GUILD;

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

  public fetchData(id: number) {
    this.guildData = this.databaseService.data.guilds[id - 1]
    if (!this.guildData) this.router.navigate(['guilds']);
  }

  public Number: (str: string) => number = str => Number(str);
}
