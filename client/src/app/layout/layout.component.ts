import { Component, OnDestroy } from '@angular/core';
import { EventService } from '../services/event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnDestroy {
  private titleSubscription: Subscription;
  public title: string = '';

  constructor(
    private eventService: EventService
  ) {
    this.titleSubscription = this.eventService.titleObservable.subscribe(newTitle => this.title = newTitle);
  }

  ngOnDestroy(): void {
    this.titleSubscription.unsubscribe();
  }
}
