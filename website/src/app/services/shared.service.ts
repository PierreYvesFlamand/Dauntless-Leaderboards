import { Injectable } from '@angular/core';
import { formatNumber } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { LocalstorageService } from './localstorage.service';
import { TranslationService } from './translation.service';

export type ERA = 'pre-reforged' | 'reforged' | 'awakening';

// Game eras by trial week: Reforged released on week 73 (2020/12/03), Awakening on week 282
// label, short and weeks are translation keys
export const REFORGED_WEEK = 73;
export const AWAKENING_WEEK = 282;
export const ERAS: { id: ERA, label: string, short: string, icon: string, from: number, to: number | null, weeks: string }[] = [
    { id: 'pre-reforged', label: 'common.preReforged', short: 'components.eraSelector.preReforgedShort', icon: 'fa-hourglass-start', from: 1, to: REFORGED_WEEK - 1, weeks: 'common.eraWeeks.before' },
    { id: 'reforged', label: 'common.reforged', short: 'components.eraSelector.reforgedShort', icon: 'fa-hourglass-half', from: REFORGED_WEEK, to: AWAKENING_WEEK - 1, weeks: 'common.eraWeeks.between' },
    { id: 'awakening', label: 'common.awakening', short: 'components.eraSelector.awakeningShort', icon: 'fa-hourglass-end', from: AWAKENING_WEEK, to: null, weeks: 'common.eraWeeks.after' }
];
export const ERA_IDS = ERAS.map(era => era.id);

export function getEra(week: number): ERA {
    return [...ERAS].reverse().find(era => week >= era.from)?.id || ERAS[0].id;
}

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    constructor(
        private localstorageService: LocalstorageService,
        private translationService: TranslationService
    ) { }

    init() {
        this.updateTheme(this.localstorageService.getByKey<string>('theme'));
        // Favorites first: setting player/guild id adds it to them
        this.updateFavoriteGuilds(this.localstorageService.getByKey<number[]>('fav-guilds'));
        this.updateFavoritePlayers(this.localstorageService.getByKey<number[]>('fav-players'));
        this.updatePlayerId(this.localstorageService.getByKey<number>('player-id'));
        this.updateGuildId(this.localstorageService.getByKey<number>('guild-id'));
        this.updateTrialDecimals(this.localstorageService.getByKey<number>('trial-decimals'));
        this.updateShownEras(this.localstorageService.getByKey<ERA[]>('shownEras'));
        this.updateFavoritesOnly(this.localstorageService.getByKey<boolean>('favoritesOnly'));
        this.updateThemero(this.localstorageService.getByKey<boolean>('themero'));
    }

    // Theme
    private allowedThemes = ['dark', 'light'];
    private themeSubject = new BehaviorSubject<string>(this.allowedThemes[0]);
    theme$ = this.themeSubject.asObservable();
    updateTheme(value: string) {
        if (!this.allowedThemes.includes(value)) value = this.allowedThemes[0];
        this.localstorageService.setByKey('theme', value);
        this.themeSubject.next(value);
    }
    public get theme(): string { return this.themeSubject.value; }

    // Player id
    private playerIdSubject = new BehaviorSubject<number>(-1);
    playerId$ = this.playerIdSubject.asObservable();
    updatePlayerId(value: number) {
        this.localstorageService.setByKey('player-id', value);
        this.playerIdSubject.next(value);
        if (value > 0 && !this.favoritePlayers.includes(value)) this.addFavoritePlayers(value);
    }
    public get playerId(): number { return this.playerIdSubject.value; }

    // Guild id
    private guildIdSubject = new BehaviorSubject<number>(-1);
    guildId$ = this.guildIdSubject.asObservable();
    updateGuildId(value: number) {
        this.localstorageService.setByKey('guild-id', value);
        this.guildIdSubject.next(value);
        if (value > 0 && !this.favoriteGuilds.includes(value)) this.addFavoriteGuilds(value);
    }
    public get guildId(): number { return this.guildIdSubject.value; }

    // Trial time number of decimals
    private allowedTrialDecimals = [2, 1, 3];
    private trialDecimalsSubject = new BehaviorSubject<number>(this.allowedTrialDecimals[0]);
    trialDecimals$ = this.trialDecimalsSubject.asObservable();
    updateTrialDecimals(value: number) {
        if (!this.allowedTrialDecimals.includes(value)) value = this.allowedTrialDecimals[0];
        this.localstorageService.setByKey('trial-decimals', value);
        this.trialDecimalsSubject.next(value);
    }
    public get trialDecimals(): number { return this.trialDecimalsSubject.value; }

    // Favorite Guilds
    private favoriteGuildsSubject = new BehaviorSubject<number[]>([]);
    favoriteGuilds$ = this.favoriteGuildsSubject.asObservable();
    updateFavoriteGuilds(value: number[]) {
        this.localstorageService.setByKey('fav-guilds', value);
        this.favoriteGuildsSubject.next(value);
    }
    addFavoriteGuilds(value: number) {
        const newArray = [...this.favoriteGuilds, value];
        this.localstorageService.setByKey('fav-guilds', newArray);
        this.favoriteGuildsSubject.next(newArray);
    }
    removeFavoriteGuilds(value: number) {
        // Your own guild stays a favorite until unset
        if (value === this.guildId) return;
        const newArray = this.favoriteGuilds.filter(v => v !== value);
        this.localstorageService.setByKey('fav-guilds', newArray);
        this.favoriteGuildsSubject.next(newArray);
    }
    hasFavoriteGuild(value: number): boolean {
        return this.favoriteGuilds.includes(value);
    }
    toggleFavoriteGuild(value: number) {
        if (this.hasFavoriteGuild(value)) {
            this.removeFavoriteGuilds(value);
        } else {
            this.addFavoriteGuilds(value);
        }
    }
    public get favoriteGuilds(): number[] { return this.favoriteGuildsSubject.value; }

    // Favorite Players
    private favoritePlayersSubject = new BehaviorSubject<number[]>([]);
    favoritePlayers$ = this.favoritePlayersSubject.asObservable();
    updateFavoritePlayers(value: number[]) {
        this.localstorageService.setByKey('fav-players', value);
        this.favoritePlayersSubject.next(value);
    }
    addFavoritePlayers(value: number) {
        const newArray = [...this.favoritePlayers, value];
        this.localstorageService.setByKey('fav-players', newArray);
        this.favoritePlayersSubject.next(newArray);
    }
    removeFavoritePlayers(value: number) {
        // Your own player stays a favorite until unset
        if (value === this.playerId) return;
        const newArray = this.favoritePlayers.filter(v => v !== value);
        this.localstorageService.setByKey('fav-players', newArray);
        this.favoritePlayersSubject.next(newArray);
    }
    hasFavoritePlayer(value: number): boolean {
        return this.favoritePlayers.includes(value);
    }
    toggleFavoritePlayer(value: number) {
        if (this.hasFavoritePlayer(value)) {
            this.removeFavoritePlayers(value);
        } else {
            this.addFavoritePlayers(value);
        }
    }
    public get favoritePlayers(): number[] { return this.favoritePlayersSubject.value; }

    // UTILS
    public getImgPath(iconFilename: string, subFolder: string = ''): string {
        return `img/${subFolder}/${iconFilename}`;
    }

    public convertTrialTime(time?: number, decimals: true | number = 1): string {
        if (!time) return '';

        const m = Math.floor(Math.abs(time) / 60000);
        const s = Math.floor((Math.abs(time) - m * 60000) / 1000);
        const ms = Math.abs(time) % 1000;
        // Seconds + truncated fraction digits, with the decimal separator of the current language
        const seconds = (fraction: string) => formatNumber(Number(`${s}.${fraction}`), this.translationService.language.locale, `1.${fraction.length}-${fraction.length}`);

        if (decimals === true) {
            decimals = 3;
            const fraction = String(ms).padStart(decimals, '0');
            if (time >= 60000) return this.translationService.t('time.minSec', { m, s: seconds(fraction) });
            if (time > 0) return this.translationService.t('time.sec', { s: seconds(fraction) });
            if (time === 0) return this.translationService.t('time.sec', { s: seconds('000') });
            if (time < 0) return this.translationService.t('time.sec', { s: `-${seconds(fraction)}` });
        } else {
            const fraction = String(Math.floor(ms / (10 ** (3 - decimals)))).padStart(decimals, '0');
            if (time >= 60000) return this.translationService.t('time.minSec', { m, s });
            if (time > 0) return this.translationService.t('time.sec', { s: seconds(fraction) });
            if (time === 0) return this.translationService.t('time.sec', { s: seconds('000') });
            if (time < 0) return this.translationService.t('time.sec', { s: `-${seconds(fraction)}` });
        }

        return '';
    }

    // Names by image id (img/weapons/<id>.png, img/omnicells/<id>.png)
    private readonly weaponIds = [1, 2, 3, 4, 5, 6, 7];
    // Translated at use time: the language can change at runtime
    public get weaponNames(): Record<number, string> {
        return Object.fromEntries(this.weaponIds.map(id => [id, this.translationService.t(`weapon.${id}`)]));
    }
    public readonly omnicellNames: Record<number, string> = {
        1: 'Bastion', 2: 'Revenant', 3: 'Discipline', 4: 'Artificer', 5: 'Iceborne', 6: 'Tempest'
    };
    public readonly platformNames: Record<number, string> = {
        1: 'PC', 2: 'PlayStation', 3: 'Xbox', 4: 'Switch'
    };

    // Guild Score explanation (formula in DatabaseService), translated at use time
    public get guildScoreTooltip(): string {
        return this.translationService.t('shared.guildScoreTooltip');
    }

    // Weeks 282 & 283 leaderboards were disabled (Golden Claws exploit)
    public isDisabledTrialWeek(week: number): boolean {
        return week === 282 || week === 283;
    }

    // Shown eras (Settings switches and era selector), always at least one
    private shownErasSubject = new BehaviorSubject<ERA[]>(ERA_IDS);
    shownEras$ = this.shownErasSubject.asObservable();
    updateShownEras(value: ERA[]) {
        value = Array.isArray(value) ? ERA_IDS.filter(id => value.includes(id)) : [];
        if (!value.length) value = ERA_IDS;
        this.localstorageService.setByKey('shownEras', value);
        this.shownErasSubject.next(value);
    }
    public get shownEras(): ERA[] { return this.shownErasSubject.value; }
    public isEraShown(era: ERA): boolean {
        return this.shownEras.includes(era);
    }
    // The last shown era can't be hidden
    public isOnlyShownEra(era: ERA): boolean {
        return this.shownEras.length === 1 && this.isEraShown(era);
    }
    public toggleEra(era: ERA) {
        if (this.isOnlyShownEra(era)) return;
        this.updateShownEras(this.isEraShown(era) ? this.shownEras.filter(id => id !== era) : [...this.shownEras, era]);
    }
    public isWeekShown(week: number): boolean {
        return this.isEraShown(getEra(week));
    }

    // Params of an era's weeks window (common.eraWeeks.*): "Weeks before 73", "Weeks 73 to 281", "Week 282 and after"
    public getEraWeeksParams(era: typeof ERAS[number]) {
        return { week: era.to ? era.to + 1 : era.from, from: era.from, to: era.to ?? '' };
    }

    // Favorites only: restrict guild/player lists and statistics to favorites
    private allowedFavoritesOnly = [false, true];
    private favoritesOnlySubject = new BehaviorSubject<boolean>(this.allowedFavoritesOnly[0]);
    favoritesOnly$ = this.favoritesOnlySubject.asObservable();
    updateFavoritesOnly(value: boolean) {
        if (!this.allowedFavoritesOnly.includes(value)) value = this.allowedFavoritesOnly[0];
        this.localstorageService.setByKey('favoritesOnly', value);
        this.favoritesOnlySubject.next(value);
    }
    public get favoritesOnly(): boolean { return this.favoritesOnlySubject.value; }

    // Era of a trial week, for templates
    public eraOf(week: number): typeof ERAS[number] {
        return ERAS.find(era => era.id === getEra(week))!;
    }

    // Themero
    private allowedThemero = [true, false];
    private themeroSubject = new BehaviorSubject<boolean>(this.allowedThemero[0]);
    themero$ = this.themeroSubject.asObservable();
    updateThemero(value: boolean) {
        if (!this.allowedThemero.includes(value)) value = this.allowedThemero[0];
        this.localstorageService.setByKey('themero', value);
        this.themeroSubject.next(value);
    }
    public get themero(): boolean { return this.themeroSubject.value; }
}