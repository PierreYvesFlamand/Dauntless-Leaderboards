import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formatNumber } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

// Known labels get their own text (word order & plural forms per language)
const RANGE_KEYS = new Map<string, string>([
  ['guilds', 'pagination.rangeGuilds'],
  ['players', 'pagination.rangePlayers'],
  ['trials', 'pagination.rangeTrials']
]);

@Component({
  selector: 'dl-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  standalone: false
})
export class PaginationComponent {
  @Input() public page: number = 1;
  @Input() public total: number = 0;
  @Input() public pageSize: number = 20;
  // 'guilds' | 'players' | 'trials' (translated here), any other text is shown as is
  @Input() public label: string = '';
  @Output() public pageChange = new EventEmitter<number>();

  constructor(
    private translationService: TranslationService
  ) { }

  public get numberOfPages(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  public get rangeStart(): number {
    return (this.page - 1) * this.pageSize + 1;
  }

  public get rangeEnd(): number {
    return Math.min(this.page * this.pageSize, this.total);
  }

  // "1–20 of 1,234 players", range highlighted (HTML)
  public get rangeText(): string {
    const locale = this.translationService.language.locale;
    const range = `<span class="font-medium text-fg">${formatNumber(this.rangeStart, locale)}–${formatNumber(this.rangeEnd, locale)}</span>`;
    const total = formatNumber(this.total, locale);
    const key = RANGE_KEYS.get(this.label);
    if (key) return this.translationService.t(key, { count: this.total, range, total });
    return this.translationService.t('pagination.range', { range, total, label: this.label });
  }

  public goTo(page: number) {
    page = Math.min(Math.max(1, Math.floor(Number(page) || 1)), this.numberOfPages);
    if (page === this.page) return;
    this.pageChange.emit(page);
  }
}
