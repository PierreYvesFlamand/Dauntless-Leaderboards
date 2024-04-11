import { Component, Input } from '@angular/core';
import { GUILD_DETAIL } from '../../../../../../scripts/src/types';

@Component({
  selector: 'app-guild-detail',
  templateUrl: './guild-detail.component.html',
  styleUrls: ['./guild-detail.component.scss']
})
export class GuildDetailComponent {
  @Input() public guild?: GUILD_DETAIL;

  public getSeasonNumber(seasonId?: string): number {
    if (!seasonId) return 69;
    return Number(seasonId.slice(15));
  }
}