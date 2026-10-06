import { Pipe, PipeTransform } from '@angular/core';
import { formatDate, formatNumber, formatPercent } from '@angular/common';
import { TRANSLATION_PARAMS, TranslationService } from '../services/translation.service';

// Impure: the language can change at runtime

// {{ 'dashboard.title' | t }} / {{ 'players.entries' | t: { count: 3 } }}
@Pipe({ name: 't', pure: false, standalone: false })
export class TranslatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) { }

  transform(key: string, params?: TRANSLATION_PARAMS): string {
    return this.translationService.t(key, params);
  }
}

// Each language orders the date parts its own way (Intl), on top of the date pipe formats
const DATE_PRESETS: Record<string, Intl.DateTimeFormatOptions> = {
  monthDay: { month: 'long', day: 'numeric' },
  monthDayTime: { month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' },
  longDateTime: { dateStyle: 'long', timeStyle: 'short' },
  mediumDateTime: { dateStyle: 'medium', timeStyle: 'short' }
};

// Same formats as the date pipe, plus the presets above: {{ date | ldate:'monthDay' }}
@Pipe({ name: 'ldate', pure: false, standalone: false })
export class LocalDatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) { }

  transform(value: Date | string | number | null | undefined, format: string = 'mediumDate'): string {
    if (value === null || value === undefined || value === '') return '';
    const locale = this.translationService.language.locale;
    if (DATE_PRESETS[format]) return new Intl.DateTimeFormat(locale, DATE_PRESETS[format]).format(new Date(value));
    return formatDate(value, format, locale);
  }
}

// Same digits info as the number pipe, in the current language
@Pipe({ name: 'lnumber', pure: false, standalone: false })
export class LocalNumberPipe implements PipeTransform {
  constructor(private translationService: TranslationService) { }

  transform(value: number | null | undefined, digitsInfo?: string): string {
    if (value === null || value === undefined || isNaN(value)) return '';
    return formatNumber(value, this.translationService.language.locale, digitsInfo);
  }
}

// Same digits info as the percent pipe, in the current language
@Pipe({ name: 'lpercent', pure: false, standalone: false })
export class LocalPercentPipe implements PipeTransform {
  constructor(private translationService: TranslationService) { }

  transform(value: number | null | undefined, digitsInfo?: string): string {
    if (value === null || value === undefined || isNaN(value)) return '';
    return formatPercent(value, this.translationService.language.locale, digitsInfo);
  }
}
