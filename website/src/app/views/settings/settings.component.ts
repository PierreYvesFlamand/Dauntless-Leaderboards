import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { LANGUAGE_CODE, LANGUAGES, HELP_TRANSLATE_URL, TranslationService } from '../../services/translation.service';

@Component({
  selector: 'dl-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  standalone: false
})
export class SettingsComponent {
  public readonly languages = LANGUAGES;
  public readonly helpTranslateUrl = HELP_TRANSLATE_URL;
  public readonly browserLanguage: LANGUAGE_CODE;
  // Awakening update released on week 282
  public readonly awakeningWeek = 282;

  constructor(
    public sharedService: SharedService,
    public translationService: TranslationService
  ) {
    this.browserLanguage = this.translationService.detectBrowserLanguage();
    this.translationService.loadShares();
  }

  // '' = browser language
  public onLanguageChange(code: LANGUAGE_CODE | '') {
    this.translationService.setLanguage(code || null);
  }

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

  public themero = 0;
  public onThemeroClick() {
    this.themero++;
    if (this.themero > 4) {
      this.sharedService.updateThemero(!this.sharedService.themero);
      this.themero = 0;
    }
  }
}
