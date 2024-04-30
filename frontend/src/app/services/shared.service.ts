import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LocalstorageService } from "./localstorage.service";

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
}