import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { DatabaseService, WEBSITE_ME } from '../../services/database.service';
import { LANGUAGE_CODE, LANGUAGES, HELP_TRANSLATE_URL, TranslationService } from '../../services/translation.service';

@Component({
  selector: 'dl-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent {
  @Output() public toggleSidebar = new EventEmitter<void>();

  public menuOpen: boolean = false;
  public languageMenuOpen: boolean = false;
  public readonly languages = LANGUAGES;
  public readonly helpTranslateUrl = HELP_TRANSLATE_URL;
  public readonly browserLanguage: LANGUAGE_CODE;
  public readonly lockIcon = '<i class="fa-solid fa-lock-open"></i>';
  public playerId: number = -1;
  public guildId: number = -1;
  public me?: WEBSITE_ME;

  constructor(
    public sharedService: SharedService,
    public databaseService: DatabaseService,
    public translationService: TranslationService,
    private elementRef: ElementRef<HTMLElement>
  ) {
    this.browserLanguage = this.translationService.detectBrowserLanguage();
    this.sharedService.guildId$.subscribe(value => {
      this.guildId = value;
      this.onGuildIdOrPlayerIdUpdate();
    });
    this.sharedService.playerId$.subscribe(value => {
      this.playerId = value;
      this.onGuildIdOrPlayerIdUpdate();
    });
  }

  public async onGuildIdOrPlayerIdUpdate() {
    this.me = {
      player: {
        id: this.playerId,
        name: this.databaseService.data.players[this.playerId - 1]?.playerNames.sort((a, b) => a.platformId - b.platformId)[0]?.name || ''
      },
      guild: {
        id: this.guildId,
        tag: this.databaseService.data.guilds[this.guildId - 1]?.tag || '',
        iconFilename: this.databaseService.data.guilds[this.guildId - 1]?.iconFilename || '',
      }
    }
  }

  public toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.languageMenuOpen = false;
  }

  public toggleLanguageMenu() {
    this.languageMenuOpen = !this.languageMenuOpen;
    this.menuOpen = false;
    if (this.languageMenuOpen) this.translationService.loadShares();
  }

  public async selectLanguage(code: LANGUAGE_CODE | null) {
    this.languageMenuOpen = false;
    await this.translationService.setLanguage(code);
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) this.onEscape();
  }

  @HostListener('document:keydown.escape')
  public onEscape() {
    this.menuOpen = false;
    this.languageMenuOpen = false;
  }
}
