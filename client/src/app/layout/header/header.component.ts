import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private themeSubscription: Subscription;
  public theme: 'light' | 'dark' = 'light';

  constructor(
    public eventService: EventService
  ) {
    this.themeSubscription = this.eventService.themeObservable.subscribe(newTheme => this.theme = newTheme);
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}