import { Component, OnDestroy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs';
import { ALL_SLAYERS, ALL_TRIALS, SLAYER_DETAIL } from '../../imports';
import { TrialsService } from '../trials/trials.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnDestroy {
  public playerSearchInput: string = '';

  private allSlayersSubscription: Subscription;
  public allSlayers: ALL_SLAYERS = {};
  public allSlayersFormatted: Array<SLAYER_DETAIL> = [];
  public allSlayersFormattedForList: Array<SLAYER_DETAIL> = [];

  constructor(
    private eventService: EventService,
    public trialsService: TrialsService
  ) {
    this.eventService.updateTitle('Players');
    this.eventService.updateActiveMenu('players');

    this.allSlayersSubscription = this.eventService.allSlayersObservable.subscribe(data => {
      this.allSlayers = data;
      const allSlayersFormatted: Array<SLAYER_DETAIL> = [];

      for (const id in this.allSlayers) {
        const slayerDetails = this.allSlayers[id].reverse();
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
    });
  }

  ngOnDestroy(): void {
    this.allSlayersSubscription.unsubscribe();
  }

  public onPlayerSearch() {
    this.allSlayersFormattedForList = this.allSlayersFormatted.filter(s => s.platformName.toLowerCase().includes(this.playerSearchInput.toLowerCase()));
  }
}