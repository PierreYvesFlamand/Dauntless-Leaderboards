import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';

export type RANK_CHART_POINT = {
  season: number
  rank: number | null // null = not ranked that season
  level?: number
}

const HEIGHT = 200;
const PADDING = { top: 12, right: 12, bottom: 26, left: 36 };
const MAX_RANK = 100;

// Rank per season as a line (log scale so the top ranks stay readable), gaps for unranked seasons
@Component({
  selector: 'dl-rank-chart',
  templateUrl: './rank-chart.component.html',
  styleUrl: './rank-chart.component.scss',
  standalone: false
})
export class RankChartComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) public points: RANK_CHART_POINT[] = [];

  public readonly height = HEIGHT;
  public readonly padding = PADDING;
  public readonly yTicks = [1, 5, 10, 25, 50, 100];
  public width = 600;
  public hoverIndex: number | null = null;

  private resizeObserver?: ResizeObserver;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private ngZone: NgZone
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

  public get plotWidth(): number {
    return this.width - PADDING.left - PADDING.right;
  }

  public get step(): number {
    return this.points.length > 1 ? this.plotWidth / (this.points.length - 1) : 0;
  }

  public x(index: number): number {
    return PADDING.left + (this.points.length > 1 ? index * this.step : this.plotWidth / 2);
  }

  public y(rank: number): number {
    const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
    return PADDING.top + Math.log(Math.min(rank, MAX_RANK)) / Math.log(MAX_RANK) * plotHeight;
  }

  // One sub-path per run of consecutive ranked seasons
  public get linePath(): string {
    let path = '';
    let drawing = false;
    this.points.forEach((point, index) => {
      if (point.rank === null) {
        drawing = false;
        return;
      }
      path += `${drawing ? 'L' : 'M'}${this.x(index)},${this.y(point.rank)}`;
      drawing = true;
    });
    return path;
  }

  // Skip season labels when too dense
  public showXLabel(index: number): boolean {
    const every = Math.ceil(24 / Math.max(this.step, 1));
    return index % every === 0 || index === this.points.length - 1;
  }

  public get hoverPoint(): RANK_CHART_POINT | null {
    return this.hoverIndex === null ? null : this.points[this.hoverIndex];
  }

  public get hoverX(): number {
    return this.hoverIndex === null ? 0 : this.x(this.hoverIndex);
  }

  // Keep the tooltip inside the chart
  public get tooltipLeft(): number {
    if (this.hoverIndex === null) return 0;
    return Math.min(Math.max(this.x(this.hoverIndex), 70), this.width - 70);
  }
}
