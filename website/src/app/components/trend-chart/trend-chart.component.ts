import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import { formatNumber } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

export type TREND_POINT = {
  label: string
  value: number
  tooltip?: string
}

const HEIGHT = 240;
const PADDING = { top: 14, right: 16, bottom: 28, left: 44 };
const MAX_MARKERS = 40;

// Single series line chart (linear scale) with hover crosshair & tooltip
@Component({
  selector: 'dl-trend-chart',
  templateUrl: './trend-chart.component.html',
  styleUrl: './trend-chart.component.scss',
  standalone: false
})
export class TrendChartComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) public points: TREND_POINT[] = [];
  @Input() public zeroBased: boolean = true;
  @Input() public unit: string = '';

  public readonly height = HEIGHT;
  public readonly padding = PADDING;
  public width = 640;
  public hoverIndex: number | null = null;

  private resizeObserver?: ResizeObserver;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private ngZone: NgZone,
    private translationService: TranslationService
  ) { }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(entries => {
      const width = Math.round(entries[0].contentRect.width);
      if (width && width !== this.width) this.ngZone.run(() => this.width = width);
    });
    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  // Clean round ticks covering the data
  public get ticks(): number[] {
    const values = this.points.map(p => p.value);
    const min = this.zeroBased ? 0 : Math.min(...values);
    const max = Math.max(...values, min + 1);
    const rawStep = (max - min) / 4;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const step = [1, 2, 2.5, 5, 10].map(m => m * magnitude).find(s => s >= rawStep) || rawStep;
    const start = Math.floor(min / step) * step;
    const ticks: number[] = [];
    for (let tick = start; tick < max + step; tick += step) ticks.push(tick);
    return ticks;
  }

  public get plotWidth(): number {
    return this.width - PADDING.left - PADDING.right;
  }

  public get step(): number {
    return this.points.length > 1 ? this.plotWidth / (this.points.length - 1) : 0;
  }

  public x(index: number): number {
    return PADDING.left + (this.points.length > 1 ? index * this.step : this.plotWidth / 2);
  }

  public y(value: number): number {
    const ticks = this.ticks;
    const min = ticks[0];
    const max = ticks[ticks.length - 1];
    const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
    return PADDING.top + (1 - (value - min) / (max - min || 1)) * plotHeight;
  }

  public get linePath(): string {
    return this.points.map((point, index) => `${index ? 'L' : 'M'}${this.x(index)},${this.y(point.value)}`).join('');
  }

  // Area wash under the line, closed on the baseline
  public get areaPath(): string {
    if (!this.points.length) return '';
    const baseline = this.y(this.ticks[0]);
    return `${this.linePath}L${this.x(this.points.length - 1)},${baseline}L${this.x(0)},${baseline}Z`;
  }

  public get showMarkers(): boolean {
    return this.points.length <= MAX_MARKERS;
  }

  public showXLabel(index: number): boolean {
    const every = Math.ceil(56 / Math.max(this.step, 1));
    return index % every === 0;
  }

  public get hoverPoint(): TREND_POINT | null {
    return this.hoverIndex === null ? null : this.points[this.hoverIndex];
  }

  public get hoverX(): number {
    return this.hoverIndex === null ? 0 : this.x(this.hoverIndex);
  }

  public get hoverY(): number {
    return this.hoverPoint ? this.y(this.hoverPoint.value) : 0;
  }

  public get tooltipLeft(): number {
    return Math.min(Math.max(this.hoverX, 80), this.width - 80);
  }

  public formatTick(value: number): string {
    const locale = this.translationService.language.locale;
    if (Math.abs(value) >= 10000) return this.translationService.t('components.trendChart.thousands', { value: formatNumber(value / 1000, locale) });
    return formatNumber(value, locale);
  }

  // "1,234 players", value highlighted (HTML)
  public valueText(point: TREND_POINT): string {
    const value = `<span class="font-medium text-fg">${formatNumber(point.value, this.translationService.language.locale)}</span>`;
    return this.translationService.t('components.trendChart.value', { value, unit: this.unit });
  }
}
