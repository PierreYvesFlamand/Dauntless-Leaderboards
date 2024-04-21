import { Component, OnDestroy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs';
import { TrialsService } from '../../services/trials.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnDestroy {
  private themeSubscription: Subscription;
  public theme: 'light' | 'dark' = 'dark';

  private languageSubscription: Subscription;
  public language: string = 'us';

  private playerIdSubscription: Subscription;
  public playerId: string = '';

  private playerNameSubscription: Subscription;
  public playerName: string = '';

  private guildTagSubscription: Subscription;
  public guildTag: string = '';

  private trialDecimalsSubscription: Subscription;
  public trialDecimals: number = 1;

  constructor(
    public eventService: EventService,
    public trialsService: TrialsService,
    public databaseService: DatabaseService
  ) {
    this.eventService.updateTitle('Settings');
    this.eventService.updateActiveMenu('settings');

    this.themeSubscription = this.eventService.themeObservable.subscribe(newValue => this.theme = newValue);
    this.languageSubscription = this.eventService.languageObservable.subscribe(newValue => this.language = newValue);
    this.playerIdSubscription = this.eventService.playerIdObservable.subscribe(newValue => this.playerId = newValue);
    this.playerNameSubscription = this.eventService.playerNameObservable.subscribe(newValue => this.playerName = newValue);
    this.guildTagSubscription = this.eventService.guildTagObservable.subscribe(newValue => this.guildTag = newValue);
    this.trialDecimalsSubscription = this.eventService.trialDecimalsObservable.subscribe(newValue => this.trialDecimals = newValue);
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
    this.languageSubscription.unsubscribe();
    this.playerIdSubscription.unsubscribe();
    this.playerNameSubscription.unsubscribe();
    this.guildTagSubscription.unsubscribe();
    this.trialDecimalsSubscription.unsubscribe();
  }

  public onUpdatePlayerName(name: string) {
    const playerId = this.trialsService.getFirstPlayerIdByName(this.databaseService.allSlayers, name);
    this.eventService.updatePlayerId(playerId);
    this.eventService.updatePlayerName(name);
  }
}