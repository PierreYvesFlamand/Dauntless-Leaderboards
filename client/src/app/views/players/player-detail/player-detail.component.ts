import { Component } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TrialsService } from '../../../services/trials.service';
import { DatabaseService } from '../../../services/database.service';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.scss']
})
export class PlayerDetailComponent {
  public playerName: string = '';
  // TODO: Type this value correctly
  public playerDetails: any = {};
  public totalOfGroup: number = 0;
  public firstTabToOpen: string = 'all';

  constructor(
    private eventService: EventService,
    public databaseService: DatabaseService,
    public trialsService: TrialsService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    this.playerName = this.activatedRoute?.snapshot.params['name'];

    this.activatedRoute.params.subscribe(params => {
      this.playerName = params['name'];
      this.eventService.updateTitle(this.playerName);
      this.buildPlayerData();
    });

    this.eventService.updateActiveMenu('');
  }

  public buildPlayerData() {
    let playerId = null;

    for (const id in this.databaseService.allSlayers) {
      if (playerId) continue;

      this.databaseService.allSlayers[id] = this.databaseService.allSlayers[id].reverse();
      let player = this.databaseService.allSlayers[id].find(s => s.platform === 'WIN' && s.platformName.toLowerCase() === this.playerName.toLowerCase());
      if (player) { playerId = id }
      else {
        player = this.databaseService.allSlayers[id].find(s => s.platform === 'PSN' && s.platformName.toLowerCase() === this.playerName.toLowerCase());
        if (player) { playerId = id }
        else {
          player = this.databaseService.allSlayers[id].find(s => s.platform === 'XBL' && s.platformName.toLowerCase() === this.playerName.toLowerCase());
          if (player) { playerId = id }
          else {
            player = this.databaseService.allSlayers[id].find(s => s.platform === 'SWT' && s.platformName.toLowerCase() === this.playerName.toLowerCase());
            if (player) { playerId = id }
          }
        }
      }
    }

    if (!playerId) {
      this.router.navigate(['players']);
      return;
    }

    this.playerDetails = {
      'all': [],
      'hammer': [],
      'axe': [],
      'sword': [],
      'chainblades': [],
      'pike': [],
      'repeaters': [],
      'strikers': [],
      'group': []
    };

    const keys = Object.keys(this.databaseService.allTrials).reverse();

    for (const key of keys) {
      const week = Number(key.slice(5));

      for (const type of [
        'all',
        'hammer',
        'axe',
        'sword',
        'chainblades',
        'pike',
        'repeaters',
        'strikers'
      ]) {
        this.databaseService.allTrials[key].solo[type].forEach((entry, index) => {
          if (entry.phxAccountId === playerId) {
            this.playerDetails[type].push({
              week,
              rank: index + 1,
              behemothId: this.trialsService.getBehemothIdFromWeek(week),
              ...entry
            });
          }
        });
      }

      this.totalOfGroup = 0;
      const entries: any = [];

      this.databaseService.allTrials[key].group.forEach((group, index) => {

        for (const entry of group.entries) {
          if (entry.phxAccountId === playerId) {
            this.totalOfGroup++;
            entries.push({
              rank: index + 1,
              ...group
            });
          }
        }
      });

      if (entries.length) {
        this.playerDetails['group'].push({
          week,
          behemothId: this.trialsService.getBehemothIdFromWeek(week),
          entries
        });
      }
    }

    if (this.playerDetails['all'].length) this.firstTabToOpen = 'all';
    else if (this.playerDetails['group'].length) this.firstTabToOpen = 'group';
    else if (this.playerDetails['hammer'].length) this.firstTabToOpen = 'hammer';
    else if (this.playerDetails['axe'].length) this.firstTabToOpen = 'axe';
    else if (this.playerDetails['sword'].length) this.firstTabToOpen = 'sword';
    else if (this.playerDetails['chainblades'].length) this.firstTabToOpen = 'chainblades';
    else if (this.playerDetails['pike'].length) this.firstTabToOpen = 'pike';
    else if (this.playerDetails['repeaters'].length) this.firstTabToOpen = 'repeaters';
    else if (this.playerDetails['strikers'].length) this.firstTabToOpen = 'strikers';
  }

  public getNbrOfTop(type: string, nbr: number): number {
    return this.playerDetails[type].filter((w: any) => w.rank <= nbr).length
  }
}