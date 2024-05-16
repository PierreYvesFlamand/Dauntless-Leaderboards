import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LocalstorageService } from "./localstorage.service";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    constructor(
        private localstorageService: LocalstorageService
    ) { }

    init() {
        this.updateTheme(this.localstorageService.getByKey<string>('theme'));
        this.updateLanguage(this.localstorageService.getByKey<string>('language'));
        this.updatePlayerId(this.localstorageService.getByKey<number>('player-id'));
        this.updateGuildId(this.localstorageService.getByKey<number>('guild-id'));
        this.updateTrialDecimals(this.localstorageService.getByKey<number>('trial-decimals'));
        this.updateFavoriteGuilds(this.localstorageService.getByKey<number[]>('favorite-guilds'));
        this.updateFavoritePlayers(this.localstorageService.getByKey<number[]>('favorite-players'));
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

    // Language
    private allowedLanguages = ['us', 'fr', 'de', 'jp', 'es', 'it', 'br', 'ru'];
    private languageSubject = new BehaviorSubject<string>(this.allowedLanguages[0]);
    language$ = this.languageSubject.asObservable();
    updateLanguage(value: string) {
        if (!this.allowedLanguages.includes(value)) value = this.allowedLanguages[0];
        this.localstorageService.setByKey('language', value);
        this.languageSubject.next(value);
    }
    public get language(): string { return this.languageSubject.value; }

    // Player id
    private playerIdSubject = new BehaviorSubject<number>(-1);
    playerId$ = this.playerIdSubject.asObservable();
    updatePlayerId(value: number) {        
        this.localstorageService.setByKey('player-id', value);
        this.playerIdSubject.next(value);
    }
    public get playerId(): number { return this.playerIdSubject.value; }

    // Guild id
    private guildIdSubject = new BehaviorSubject<number>(-1);
    guildId$ = this.guildIdSubject.asObservable();
    updateGuildId(value: number) {
        this.localstorageService.setByKey('guild-id', value);
        this.guildIdSubject.next(value);
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
        this.localstorageService.setByKey('favorite-guilds', value);
        this.favoriteGuildsSubject.next(value);
    }
    addFavoriteGuilds(value: number) {
        const newArray = [...this.favoriteGuilds, value];
        this.localstorageService.setByKey('favorite-guilds', newArray);
        this.favoriteGuildsSubject.next(newArray);
    }
    removeFavoriteGuilds(value: number) {
        const newArray = this.favoriteGuilds.filter(v => v !== value);
        this.localstorageService.setByKey('favorite-guilds', newArray);
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
        this.localstorageService.setByKey('favorite-players', value);
        this.favoritePlayersSubject.next(value);
    }
    addFavoritePlayers(value: number) {
        const newArray = [...this.favoritePlayers, value];
        this.localstorageService.setByKey('favorite-players', newArray);
        this.favoritePlayersSubject.next(newArray);
    }
    removeFavoritePlayers(value: number) {
        const newArray = this.favoritePlayers.filter(v => v !== value);
        this.localstorageService.setByKey('favorite-players', newArray);
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
        return `${environment.backendUrl}/assets/img/${subFolder}/${iconFilename}`;
    }

    public convertTrialTime(time?: number, decimals: true | number = 1): string {
        if (!time) return '';

        const m = Math.floor(Math.abs(time) / 60000);
        const s = Math.floor((Math.abs(time) - m * 60000) / 1000);
        const ms = Math.abs(time) % 1000;

        if (decimals === true) {
            decimals = 3;
            if (time >= 60000) return `${m} min ${s}.${String(ms).padStart(decimals, '0')} sec`;
            if (time > 0) return `${s}.${String(ms).padStart(decimals, '0')} sec`;
            if (time === 0) return `0.000 sec`;
            if (time < 0) return `-${s}.${String(ms).padStart(decimals, '0')} sec`;
        } else {
            if (time >= 60000) return `${m} min ${s} sec`;
            if (time > 0) return `${s}.${String(Math.floor(ms / (10 ** (3 - decimals)))).padStart(decimals, '0')} sec`;
            if (time === 0) return `0.000 sec`;
            if (time < 0) return `-${s}.${String(Math.floor(ms / (10 ** (3 - decimals)))).padStart(decimals, '0')} sec`;
        }

        return '';
    }
}