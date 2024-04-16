import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
    constructor(
      private eventService: EventService
    ) {
      this.eventService.updateTitle('Settings');
      this.eventService.updateActiveMenu('settings');
    }
}