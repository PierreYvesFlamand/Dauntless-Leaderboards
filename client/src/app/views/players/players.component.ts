import { Component, OnDestroy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs';
import { TrialsService } from '../../services/trials.service';
import { DatabaseService } from '../../services/database.service';
import { SLAYER_DETAIL } from '../../../../../server/src/types';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent {
  public playerSearchInput: string = '';

  public allSlayersFormatted: Array<SLAYER_DETAIL> = [];
  public allSlayersFormattedForList: Array<SLAYER_DETAIL> = [];

  public showAll: boolean = false;

  constructor(
    private eventService: EventService,
    public trialsService: TrialsService,
    public databaseService: DatabaseService
  ) {
    this.eventService.updateTitle('Players');
    this.eventService.updateActiveMenu('players');

    const allSlayersFormatted: Array<SLAYER_DETAIL> = [];

    for (const id in this.databaseService.allSlayers) {
      const slayerDetails = this.databaseService.allSlayers[id].reverse();
      let player = null;

      player = slayerDetails.find(s => s.platform === 'WIN');
      if (player) { allSlayersFormatted.push(player) }
      else {
        player = slayerDetails.find(s => s.platform === 'PSN');
        if (player) { allSlayersFormatted.push(player) }
        else {
          player = slayerDetails.find(s => s.platform === 'XBL');
          if (player) { allSlayersFormatted.push(player) }
          else {
            player = slayerDetails.find(s => s.platform === 'SWT');
            if (player) { allSlayersFormatted.push(player) }
            else {
              allSlayersFormatted.push({
                platformName: 'XXXX',
                platform: 'XXXX'
              });
            }
          }
        }
      }
    }

    allSlayersFormatted.sort((a, b) => a.platformName.toLowerCase().localeCompare(b.platformName.toLowerCase()));
    this.allSlayersFormatted = this.allSlayersFormattedForList = allSlayersFormatted;
  }

  public onPlayerSearch() {
    this.allSlayersFormattedForList = this.allSlayersFormatted.filter(s => s.platformName.toLowerCase().includes(this.playerSearchInput.toLowerCase()));
  }
}