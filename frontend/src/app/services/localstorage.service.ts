import { Injectable } from '@angular/core';

const KEY_PREFIX = 'settings';
export type LOCALSTORAGE_KEYS = 'theme' | 'language' | 'player-id' | 'guild-id' | 'trial-decimals' | 'favorite-guilds' | 'favorite-players';

const defaultSettings = {
    'theme': 'dark',
    'language': 'us',
    'player-id': -1,
    'guild-id': -1,
    'trial-decimals': 1,
    'favorite-guilds': [],
    'favorite-players': []
}

@Injectable({
    providedIn: 'root'
})
export class LocalstorageService {
    constructor() {
        for (const key in defaultSettings) {
            this.getByKey(key as LOCALSTORAGE_KEYS);
        }
    }

    public getByKey<T>(key: LOCALSTORAGE_KEYS): T {
        let value: string | null = localStorage.getItem(`${KEY_PREFIX}-${key}`);
        if (value === null) {
            this.setByKey(key, defaultSettings[key]);
            value = JSON.stringify(defaultSettings[key]);
        }

        let parsedValue: T;
        try {
            parsedValue = <T>JSON.parse(value);
        } catch (error) {
            this.setByKey(key, defaultSettings[key]);
            parsedValue = <T>JSON.parse(JSON.stringify(defaultSettings[key]));
        }

        return parsedValue;
    }

    public setByKey(key: LOCALSTORAGE_KEYS, value: any) {
        localStorage.setItem(`${KEY_PREFIX}-${key}`, JSON.stringify(value));
    }
}