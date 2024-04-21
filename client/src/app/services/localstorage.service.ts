import { Injectable } from '@angular/core';

const KEY_PREFIX = 'settings';
export type LOCALSTORAGE_KEYS = 'theme' | 'language' | 'player-name' | 'player-id' | 'guild-tag' | 'trial-decimals';

const defaultSettings = {
  'theme': 'dark',
  'language': 'us',
  'player-name': '',
  'player-id': '',
  'guild-tag': '',
  'trial-decimals': 1,
}

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  constructor() {
    this.getByKey('theme');
    this.getByKey('language');
    this.getByKey('player-name');
    this.getByKey('player-id');
    this.getByKey('guild-tag');
    this.getByKey('trial-decimals');
  }

  public getByKey<T>(key: LOCALSTORAGE_KEYS): T {
    let value: string | null = localStorage.getItem(`${KEY_PREFIX}-${key}`);
    if (value === null) {
      this.setByKey(key, defaultSettings[key]);
      value = JSON.stringify(defaultSettings[key]);
    }

    return <T>JSON.parse(value);
  }

  public setByKey(key: LOCALSTORAGE_KEYS, value: any) {
    localStorage.setItem(`${KEY_PREFIX}-${key}`, JSON.stringify(value));
  }
}
