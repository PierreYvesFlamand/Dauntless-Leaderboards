import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'dl-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  standalone: false
})
export class SettingsComponent {
  constructor(
    public sharedService: SharedService
  ) { }

  public async forceWebsiteRefresh() {
    if ('indexedDB' in window) {
      await new Promise<void>((resolve, reject) => {
        const deleteRequest = indexedDB.deleteDatabase('DauntlessLeaderbaordsDATA');

        deleteRequest.onsuccess = () => {
          resolve();
        };

        deleteRequest.onerror = event => {
          reject((event.target as any).error);
        };

        deleteRequest.onblocked = () => {
          reject(new Error('Suppression bloquée.'));
        };
      });
    }
    window.location.reload();
  }
}
