import { Injectable } from '@angular/core';
import { formatPercent, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeDe from '@angular/common/locales/de';
import localeJa from '@angular/common/locales/ja';
import localeEs from '@angular/common/locales/es';
import localeIt from '@angular/common/locales/it';
import localePt from '@angular/common/locales/pt';
import localeRu from '@angular/common/locales/ru';
import { BehaviorSubject } from 'rxjs';
import { LocalstorageService } from './localstorage.service';

[localeFr, localeDe, localeJa, localeEs, localeIt, localePt, localeRu].forEach(locale => registerLocaleData(locale));

export type LANGUAGE_CODE = 'en' | 'fr' | 'de' | 'ja' | 'es' | 'it' | 'pt-BR' | 'ru';

export type LANGUAGE = {
  code: LANGUAGE_CODE
  name: string // In its own language
  flag: string // flags/<flag>.svg (flag-icons)
  locale: string // Angular locale, for dates & numbers
}

export const LANGUAGES: LANGUAGE[] = [
  { code: 'en', name: 'English', flag: 'us', locale: 'en-US' },
  { code: 'fr', name: 'Français', flag: 'fr', locale: 'fr' },
  { code: 'de', name: 'Deutsch', flag: 'de', locale: 'de' },
  { code: 'ja', name: '日本語', flag: 'jp', locale: 'ja' },
  { code: 'es', name: 'Español', flag: 'es', locale: 'es' },
  { code: 'it', name: 'Italiano', flag: 'it', locale: 'it' },
  { code: 'pt-BR', name: 'Português (Brasil)', flag: 'br', locale: 'pt' },
  { code: 'ru', name: 'Русский', flag: 'ru', locale: 'ru' }
];

// Where to ask / send translations
export const HELP_TRANSLATE_URL = 'https://discord.gg/JGTVcqMDfm';

// public/i18n/<code>.json: { language, instructions, texts: { key: entry } }
// "ai": true = translated by AI, not reviewed by a human yet. Empty "text" = not translated (English is shown)
type TRANSLATION_ENTRY = { en?: string, text: string, ai?: boolean };
type TRANSLATION_FILE = { texts: Record<string, TRANSLATION_ENTRY> };

export type TRANSLATION_PARAMS = Record<string, string | number>;

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private languageSubject = new BehaviorSubject<LANGUAGE>(LANGUAGES[0]);
  public language$ = this.languageSubject.asObservable();
  public get language(): LANGUAGE { return this.languageSubject.value; }

  // Explicit choice, or null when following the browser language
  public chosenCode: LANGUAGE_CODE | null = null;

  private files = new Map<LANGUAGE_CODE, Promise<TRANSLATION_FILE | null>>();
  private english = new Map<string, string>();
  private texts = new Map<string, string>();
  private pluralRules = new Intl.PluralRules('en-US');

  // Share of texts translated by AI / by humans (reviewed), per language, once loadShares() is done
  public shares = new Map<LANGUAGE_CODE, { ai: number, human: number }>();

  constructor(
    private localstorageService: LocalstorageService
  ) { }

  // Run before the app starts (APP_INITIALIZER)
  public async init(): Promise<void> {
    const stored = this.localstorageService.getByKey<string>('lang');
    this.chosenCode = LANGUAGES.some(language => language.code === stored) ? stored as LANGUAGE_CODE : null;
    this.english = this.toTexts(await this.loadFile('en'));
    await this.applyLanguage(this.chosenCode || this.detectBrowserLanguage());
  }

  // null = follow the browser language
  public async setLanguage(code: LANGUAGE_CODE | null) {
    this.chosenCode = code;
    this.localstorageService.setByKey('lang', code || '');
    await this.applyLanguage(code || this.detectBrowserLanguage());
  }

  // "Original language" for English, "xx% translated by AI" (+ by humans) otherwise, nothing once fully reviewed ('' until loadShares() is done)
  public shareLabel(code: LANGUAGE_CODE): string {
    if (code === 'en') return this.t('lang.original');
    const share = this.shares.get(code);
    if (!share) return '';
    const percent = (value: number) => formatPercent(value, this.language.locale);
    if (!share.human) return this.t('lang.aiShare', { percent: percent(share.ai) });
    if (!share.ai) return ''; // Fully reviewed by humans: nothing to say
    return this.t('lang.mixedShare', { ai: percent(share.ai), human: percent(share.human) });
  }

  public t(key: string, params?: TRANSLATION_PARAMS): string {
    if (params && typeof params['count'] === 'number') key = this.pluralKey(key, params['count']);
    const text = this.texts.get(key) || this.english.get(key) || key;
    if (!params) return text;
    return text.replace(/\{(\w+)\}/g, (match, name: string) => params[name] !== undefined ? String(params[name]) : match);
  }

  public getLanguage(code: LANGUAGE_CODE): LANGUAGE {
    return LANGUAGES.find(language => language.code === code) || LANGUAGES[0];
  }

  public detectBrowserLanguage(): LANGUAGE_CODE {
    for (const browserLanguage of navigator.languages || [navigator.language]) {
      const lower = (browserLanguage || '').toLowerCase();
      if (lower.startsWith('pt')) return 'pt-BR'; // Only Portuguese offered
      const match = LANGUAGES.find(language => language.code === lower.split('-')[0]);
      if (match) return match.code;
    }
    return 'en';
  }

  // Loads every language file once to count AI / human translated texts
  public async loadShares() {
    if (this.shares.size === LANGUAGES.length) return;
    const englishKeys = [...this.english.keys()];
    await Promise.all(LANGUAGES.map(async language => {
      if (language.code === 'en') {
        this.shares.set('en', { ai: 0, human: 1 });
        return;
      }
      const file = await this.loadFile(language.code);
      const entries = englishKeys.map(key => file?.texts[key]).filter(entry => entry?.text);
      const human = entries.filter(entry => entry!.ai === false).length;
      const total = englishKeys.length || 1;
      this.shares.set(language.code, { ai: (entries.length - human) / total, human: human / total });
    }));
  }

  private async applyLanguage(code: LANGUAGE_CODE) {
    const language = this.getLanguage(code);
    this.texts = language.code === 'en' ? this.english : this.toTexts(await this.loadFile(language.code));
    this.pluralRules = new Intl.PluralRules(language.locale);
    document.documentElement.lang = language.code;
    this.languageSubject.next(language);
  }

  // key_one / key_few / key_other... by the language plural rules
  private pluralKey(key: string, count: number): string {
    const candidates = [`${key}_${this.pluralRules.select(count)}`, `${key}_other`];
    return candidates.find(candidate => this.texts.has(candidate) || this.english.has(candidate)) || key;
  }

  private loadFile(code: LANGUAGE_CODE): Promise<TRANSLATION_FILE | null> {
    if (!this.files.has(code)) {
      this.files.set(code, fetch(`i18n/${code}.json`, { cache: 'no-cache' })
        .then(res => res.ok ? res.json() as Promise<TRANSLATION_FILE> : null)
        .catch(() => null));
    }
    return this.files.get(code)!;
  }

  private toTexts(file: TRANSLATION_FILE | null): Map<string, string> {
    const texts = new Map<string, string>();
    for (const [key, entry] of Object.entries(file?.texts || {})) {
      if (entry?.text) texts.set(key, entry.text);
    }
    return texts;
  }
}
