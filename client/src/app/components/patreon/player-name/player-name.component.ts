import { Component, Input, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-player-name',
  templateUrl: './player-name.component.html',
  styleUrls: ['./player-name.component.scss']
})
export class PlayerNameComponent implements OnInit {
  @Input() public playerName?: string;
  @Input() public useBig?: boolean = false;
  public environment = environment;

  public mode: 'img' | 'emoji' | null = null;
  public content: string = '';

  constructor(
    private databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    if (this.playerName && this.databaseService.allPlayersPerks[this.playerName] !== undefined) {
      const perksString = this.databaseService.allPlayersPerks[this.playerName];

      if (perksString === '') {
        this.mode = 'img';
        this.content = `${environment.backendUrl}/data/img/players_icons/${this.playerName}.png`;
      } else if (perksString.split('.').length === 2) {
        this.mode = 'img';
        this.content = `${environment.backendUrl}/data/img/players_icons/${perksString}`;
      } else {
        this.mode = 'emoji';
        this.content = perksString;
      }
    }
  }
}