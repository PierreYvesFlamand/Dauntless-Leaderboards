import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
    constructor(
      private eventService: EventService
    ) {
      this.eventService.updateTitle('About');
      this.eventService.updateActiveMenu('about');
    }
}