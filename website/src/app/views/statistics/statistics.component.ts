import { Component, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { ERA, SharedService } from '../../services/shared.service';
import { STAT_BLOCK, STAT_DEFAULT_FILTERS, STAT_DEFINITION, STAT_FILTERS, STAT_FILTER_KEY, STAT_FILTER_OPTIONS, STAT_SORT, STAT_TABLE_ROW, StatisticsService } from '../../services/statistics.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'dl-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  standalone: false
})
export class StatisticsComponent implements OnDestroy {
  public definition?: STAT_DEFINITION;
  public filters: STAT_FILTERS = { ...STAT_DEFAULT_FILTERS };
  public blocks: STAT_BLOCK[] = [];
  // Sorted rows of each table block (same index as blocks), null for other blocks
  public tableRows: (STAT_TABLE_ROW[] | null)[] = [];
  public readonly filterOptions = STAT_FILTER_OPTIONS;
  // Category names are translation keys
  public readonly categories: { name: string, stats: STAT_DEFINITION[] }[];
  public readonly starIcon = '<i class="fa-regular fa-star"></i>';

  private subscription: Subscription;
  // Chosen sort per table ('slug:blockIndex'), kept while filters change
  private tableSorts = new Map<string, STAT_SORT>();

  constructor(
    public statisticsService: StatisticsService,
    public sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translationService: TranslationService
  ) {
    const names = [...new Set(statisticsService.definitions.map(d => d.category))];
    this.categories = names.map(name => ({ name, stats: statisticsService.definitions.filter(d => d.category === name) }));

    // Favorites only setting and language also rebuild the stat
    this.subscription = combineLatest([this.activatedRoute.paramMap, this.activatedRoute.queryParamMap, this.sharedService.favoritesOnly$, this.translationService.language$]).subscribe(([params, query]) => {
      const slug = params.get('slug');
      if (!slug) {
        this.definition = undefined;
        this.blocks = [];
        return;
      }

      const definition = this.statisticsService.getDefinition(slug);
      if (!definition) {
        const renamed = this.statisticsService.getRenamedSlug(slug);
        this.router.navigate(renamed ? ['/statistics', renamed] : ['/statistics'], { replaceUrl: true, queryParamsHandling: 'preserve' });
        return;
      }

      this.definition = definition;
      const raw: Record<string, string | null> = {};
      for (const key of Object.keys(STAT_FILTER_OPTIONS)) raw[key] = query.get(key);
      this.filters = this.statisticsService.resolveFilters(definition, raw);
      this.blocks = this.statisticsService.getBlocks(slug, this.filters);
      this.sortTables();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public get index(): number {
    return this.definition ? this.statisticsService.definitions.indexOf(this.definition) : -1;
  }

  public get previous(): STAT_DEFINITION | undefined {
    return this.statisticsService.definitions[this.index - 1];
  }

  public get next(): STAT_DEFINITION | undefined {
    return this.statisticsService.definitions[this.index + 1];
  }

  // Filters live in the query params: shareable, and kept when moving to another stat
  // Eras are joined: era=reforged,awakening
  public setFilter(key: STAT_FILTER_KEY, value: string | number | ERA[]) {
    if (!this.definition) return;
    const toParam = (v: string | number | ERA[]) => Array.isArray(v) ? v.join(',') : v;
    const param = toParam(value);
    const defaultParam = toParam({ ...STAT_DEFAULT_FILTERS, ...this.definition.defaults }[key]);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { [key]: param === defaultParam ? null : param },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  public goTo(slug: string) {
    this.router.navigate(['/statistics', slug], { queryParamsHandling: 'preserve' });
  }

  // Mobile jump menu ('' = overview)
  public onJump(slug: string) {
    if (slug) this.goTo(slug);
    else this.router.navigate(['/statistics'], { queryParamsHandling: 'preserve' });
  }

  // ← / → to browse stats (ignored while typing or with modifiers)
  @HostListener('document:keydown', ['$event'])
  public onKeydown(event: KeyboardEvent) {
    if (!this.definition || event.ctrlKey || event.metaKey || event.altKey) return;
    const target = event.target as HTMLElement;
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable) return;

    if (event.key === 'ArrowLeft' && this.previous) this.goTo(this.previous.slug);
    if (event.key === 'ArrowRight' && this.next) this.goTo(this.next.slug);
  }

  // ---------------------------------------------------------------------------
  // Sortable tables
  // ---------------------------------------------------------------------------
  public getSort(blockIndex: number): STAT_SORT | undefined {
    const block = this.blocks[blockIndex];
    return this.tableSorts.get(`${this.definition?.slug}:${blockIndex}`) || (block?.type === 'table' ? block.defaultSort : undefined);
  }

  // First click: ascending (fastest / smallest first), then toggle
  public toggleSort(blockIndex: number, key: string) {
    const current = this.getSort(blockIndex);
    const dir = current?.key === key && current.dir === 'asc' ? 'desc' : 'asc';
    this.tableSorts.set(`${this.definition?.slug}:${blockIndex}`, { key, dir });
    this.sortTables();
  }

  public getSortIcon(blockIndex: number, key: string): string {
    const sort = this.getSort(blockIndex);
    if (sort?.key !== key) return 'fa-arrows-up-down';
    return sort.dir === 'asc' ? 'fa-arrow-up-long' : 'fa-arrow-down-long';
  }

  private sortTables() {
    this.tableRows = this.blocks.map((block, blockIndex) => {
      if (block.type !== 'table') return null;
      const sort = this.getSort(blockIndex);
      if (!sort) return block.rows;

      const direction = sort.dir === 'asc' ? 1 : -1;
      return [...block.rows].sort((a, b) => {
        const valueA = a.sortValues?.[sort.key] ?? null;
        const valueB = b.sortValues?.[sort.key] ?? null;
        if (valueA === null || valueB === null) return valueA === valueB ? 0 : valueA === null ? 1 : -1;
        return (valueA - valueB) * direction;
      });
    });
  }

  public isWide(block: STAT_BLOCK): boolean {
    return !!block.wide || block.type === 'kpis';
  }
}
