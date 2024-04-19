import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventService, Theme } from '../../services/event.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private themeSubscription: Subscription;
  public theme: Theme = 'light';

  private playerNameSubscription: Subscription;
  public playerName: string = '';

  private guildTagSubscription: Subscription;
  public guildTag: string = '';

  constructor(
    public eventService: EventService
  ) {
    this.themeSubscription = this.eventService.themeObservable.subscribe(newValue => this.theme = newValue);
    this.playerNameSubscription = this.eventService.playerNameObservable.subscribe(newValue => this.playerName = newValue);
    this.guildTagSubscription = this.eventService.guildTagObservable.subscribe(newValue => this.guildTag = newValue);
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
    this.playerNameSubscription.unsubscribe();
    this.guildTagSubscription.unsubscribe();
  }

  public reload() {
    window.location.reload();
  }
}