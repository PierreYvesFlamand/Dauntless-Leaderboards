import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalstorageService } from './localstorage.service';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(
    private localstorageService: LocalstorageService
  ) { }

  public init() {
    this.initTheme();
    this.initLanguage();
    this.initPlayerName();
    this.initGuildTag();
    this.initTrialDecimals();
  }

  // Title
  private _titleObservable = new BehaviorSubject<string>('');
  public titleObservable = this._titleObservable.asObservable();

  public updateTitle(string: string): void {
    this._titleObservable.next(string);
  }

  // Theme
  private _themeObservable = new BehaviorSubject<Theme>('light');
  public themeObservable = this._themeObservable.asObservable();

  public updateTheme(theme: Theme): void {
    this._themeObservable.next(theme);
    this.localstorageService.setByKey('theme', theme);
  }

  public initTheme() {
    let theme = this.localstorageService.getByKey<string>('theme');
    if (theme !== 'light' && theme !== 'dark') theme = 'light';
    this.updateTheme(theme as Theme);
  }

  // Language
  private _languageObservable = new BehaviorSubject<string>('us');
  public languageObservable = this._languageObservable.asObservable();

  public updateLanguage(language: string): void {
    this._languageObservable.next(language);
    this.localstorageService.setByKey('language', language);
  }

  public initLanguage() {
    let language = this.localstorageService.getByKey<string>('language');
    this.updateLanguage(language);
  }

  // Player Name
  private _playerNameObservable = new BehaviorSubject<string>('');
  public playerNameObservable = this._playerNameObservable.asObservable();

  public updatePlayerName(playerName: string): void {
    this._playerNameObservable.next(playerName);
    this.localstorageService.setByKey('player-name', playerName);
  }

  public initPlayerName() {
    let playerName = this.localstorageService.getByKey<string>('player-name');
    this.updatePlayerName(playerName);
  }

  // Guild Tag
  private _guildTagObservable = new BehaviorSubject<string>('');
  public guildTagObservable = this._guildTagObservable.asObservable();

  public updateGuildTag(guildTag: string): void {
    this._guildTagObservable.next(guildTag);
    this.localstorageService.setByKey('guild-tag', guildTag);
  }

  public initGuildTag() {
    let guildTag = this.localstorageService.getByKey<string>('guild-tag');
    this.updateGuildTag(guildTag);
  }

  // Trial Decimals
  private _trialDecimalsObservable = new BehaviorSubject<1 | 2 | 3>(1);
  public trialDecimalsObservable = this._trialDecimalsObservable.asObservable();

  public updateTrialDecimals(trialDecimals: 1 | 2 | 3): void {
    if (!trialDecimals || isNaN(trialDecimals) || trialDecimals < 1 || trialDecimals > 3) trialDecimals = 1;

    this._trialDecimalsObservable.next(trialDecimals);
    this.localstorageService.setByKey('trial-decimals', trialDecimals);
  }

  public initTrialDecimals() {
    let trialDecimals = this.localstorageService.getByKey<1 | 2 | 3>('trial-decimals');
    this.updateTrialDecimals(trialDecimals);
  }

  // Active menu
  private _activeMenuObservable = new BehaviorSubject<string>('');
  public activeMenuObservable = this._activeMenuObservable.asObservable();

  public updateActiveMenu(string: string): void {
    this._activeMenuObservable.next(string);
  }
}
