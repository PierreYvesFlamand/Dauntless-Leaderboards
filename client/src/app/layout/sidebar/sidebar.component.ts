import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  private activeMenuSubscription: Subscription;
  public activeMenu: string = '';

  constructor(
    private eventService: EventService
  ) {
    this.activeMenuSubscription = this.eventService.activeMenuObservable.subscribe(newActiveMenu => this.activeMenu = newActiveMenu);
  }

  ngOnDestroy(): void {
    this.activeMenuSubscription.unsubscribe();
  }
}