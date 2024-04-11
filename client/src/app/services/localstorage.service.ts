import { Injectable } from '@angular/core';

const KEY_PREFIX = 'settings';
export type LOCALSTORAGE_KEYS = 'theme';

const defaultSettings = {
  'theme': 'light'
}

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  constructor() {
    this.getByKey('theme');
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
