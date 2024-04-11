import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-404',
  templateUrl: './404.component.html',
  styleUrls: ['./404.component.scss']
})
export class NotFoundComponent {
  constructor(
    private eventService: EventService
  ) {
    this.eventService.updateTitle('404 Page not found');
    this.eventService.updateActiveMenu('');
  }
}