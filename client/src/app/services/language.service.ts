import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  public allowedLanguages = ['us', 'fr', 'de', 'jp', 'es', 'it', 'br', 'ru'];
  public defaultLanguage = 'us';

  constructor(
    private translateService: TranslateService
  ) { }

  public init() {
    this.translateService.setDefaultLang(this.defaultLanguage);
    this.translateService.use(this.defaultLanguage)
  }
}
