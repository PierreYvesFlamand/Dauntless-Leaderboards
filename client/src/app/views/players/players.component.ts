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
      allSlayersFormatted.push({
        id,
        ...databaseService.allSlayers[id]
      });
    }

    allSlayersFormatted.sort((a, b) => {
      return (a.SWT_Name ?? '').toLowerCase().localeCompare((b.SWT_Name || '').toLowerCase()) ||
        (a.XBL_Name ?? '').toLowerCase().localeCompare((b.XBL_Name || '').toLowerCase()) ||
        (a.PSN_Name ?? '').toLowerCase().localeCompare((b.PSN_Name || '').toLowerCase()) ||
        (a.WIN_Name ?? '').toLowerCase().localeCompare((b.WIN_Name || '').toLowerCase())
    });

    this.allSlayersFormatted = this.allSlayersFormattedForList = allSlayersFormatted;
  }

  public onPlayerSearch() {
    this.allSlayersFormattedForList = this.allSlayersFormatted.filter(s => {
      return (s.WIN_Name ?? '').toLowerCase().includes(this.playerSearchInput.toLowerCase()) ||
        (s.PSN_Name ?? '').toLowerCase().includes(this.playerSearchInput.toLowerCase()) ||
        (s.XBL_Name ?? '').toLowerCase().includes(this.playerSearchInput.toLowerCase()) ||
        (s.SWT_Name ?? '').toLowerCase().includes(this.playerSearchInput.toLowerCase())
    });
  }
}