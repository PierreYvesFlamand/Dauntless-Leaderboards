import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _themeObservable = new BehaviorSubject<'light' | 'dark'>('light');
  public themeObservable = this._themeObservable.asObservable();

  constructor(
    private localstorageService: LocalstorageService
  ) { }

  public init() {
    let theme = this.localstorageService.getByKey<string>('theme');
    if (theme !== 'light' && theme !== 'dark') theme = 'light';
    this.updateTheme(theme as 'light' | 'dark');
  }

  public updateTheme(theme: 'light' | 'dark'): void {
    this._themeObservable.next(theme);
    this.localstorageService.setByKey('theme', theme);
  }
}
