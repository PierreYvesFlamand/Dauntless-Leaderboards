import { Component, Input } from '@angular/core';
import { formatPercent } from '@angular/common';
import { STAT_ICON } from '../../services/statistics.service';
import { TranslationService } from '../../services/translation.service';

export type HEATMAP_ROW = {
  label: string
  icon?: STAT_ICON
  values: (number | null)[] // shares 0-1, null = no data
}

// Rows x columns of shares, one hue: more is darker
@Component({
  selector: 'dl-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrl: './heatmap.component.scss',
  standalone: false
})
export class HeatmapComponent {
  @Input({ required: true }) public columns: string[] = [];
  @Input({ required: true }) public rows: HEATMAP_ROW[] = [];

  constructor(
    private translationService: TranslationService
  ) { }

  public get max(): number {
    return Math.max(...this.rows.flatMap(row => row.values.map(value => value || 0)), 0.0001);
  }

  // 0.06 floor keeps empty-ish cells visible against the surface
  public intensity(value: number | null): number {
    return value === null ? 0 : 0.06 + 0.94 * (value / this.max);
  }

  public format(value: number | null): string {
    if (value === null) return '–';
    const locale = this.translationService.language.locale;
    const percent = value * 100;
    return percent > 0 && percent < 0.5 ? `<${formatPercent(0.01, locale, '1.0-0')}` : formatPercent(Math.round(percent) / 100, locale, '1.0-0');
  }

  // "Row · Column: value"
  public cellTitle(row: HEATMAP_ROW, index: number): string {
    return this.translationService.t('components.heatmap.cellTitle', { row: row.label, column: this.columns[index], value: this.format(row.values[index]) });
  }
}
