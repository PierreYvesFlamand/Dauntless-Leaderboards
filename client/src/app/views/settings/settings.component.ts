import { Component, OnDestroy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs';

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

  private playerNameSubscription: Subscription;
  public playerName: string = '';

  private guildTagSubscription: Subscription;
  public guildTag: string = '';

  constructor(
    public eventService: EventService
  ) {
    this.eventService.updateTitle('Settings');
    this.eventService.updateActiveMenu('settings');

    this.themeSubscription = this.eventService.themeObservable.subscribe(newValue => this.theme = newValue);
    this.languageSubscription = this.eventService.languageObservable.subscribe(newValue => this.language = newValue);
    this.playerNameSubscription = this.eventService.playerNameObservable.subscribe(newValue => this.playerName = newValue);
    this.guildTagSubscription = this.eventService.guildTagObservable.subscribe(newValue => this.guildTag = newValue);
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
    this.languageSubscription.unsubscribe();
    this.playerNameSubscription.unsubscribe();
    this.guildTagSubscription.unsubscribe();
  }
}