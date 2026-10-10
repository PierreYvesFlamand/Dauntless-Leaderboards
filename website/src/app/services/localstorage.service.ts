import { Injectable } from '@angular/core';

const KEY_PREFIX = 'settings';
export type LOCALSTORAGE_KEYS = 'theme' | 'lang' | 'player-id' | 'guild-id' | 'trial-decimals' | 'fav-guilds' | 'fav-players' | 'shownEras' | 'favoritesOnly' | 'themero';

// Replaced by 'shownEras' (Pre-Awakening = Pre-Reforged + Reforged, Post-Awakening = Awakening)
const OLD_ERA_KEYS = { preAwakening: 'showPreAwakening', postAwakening: 'showPostAwakening2' };

const defaultSettings = {
    'theme': 'dark',
    'lang': '', // '' = browser language
    'player-id': -1,
    'guild-id': -1,
    'trial-decimals': 1,
    'fav-guilds': [],
    'fav-players': [],
    'shownEras': ['pre-reforged', 'reforged', 'awakening'],
    'favoritesOnly': false,
    'themero': false
}

@Injectable({
    providedIn: 'root'
})
export class LocalstorageService {
    constructor() {
        this.migrateEraSettings();
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

    // Keep the eras chosen with the old Pre/Post Awakening switches
    private migrateEraSettings() {
        const pre = localStorage.getItem(`${KEY_PREFIX}-${OLD_ERA_KEYS.preAwakening}`);
        const post = localStorage.getItem(`${KEY_PREFIX}-${OLD_ERA_KEYS.postAwakening}`);
        if (pre === null && post === null) return;

        if (localStorage.getItem(`${KEY_PREFIX}-shownEras`) === null) {
            const eras = [...(pre !== 'false' ? ['pre-reforged', 'reforged'] : []), ...(post !== 'false' ? ['awakening'] : [])];
            this.setByKey('shownEras', eras.length ? eras : defaultSettings['shownEras']);
        }
        localStorage.removeItem(`${KEY_PREFIX}-${OLD_ERA_KEYS.preAwakening}`);
        localStorage.removeItem(`${KEY_PREFIX}-${OLD_ERA_KEYS.postAwakening}`);
    }
}