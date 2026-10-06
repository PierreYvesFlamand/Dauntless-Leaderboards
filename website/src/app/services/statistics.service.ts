import { Injectable } from '@angular/core';
import { formatNumber as formatLocaleNumber, formatPercent } from '@angular/common';
import { DatabaseService, TRIAL_LEADERBOARD_PLAYER, WEBSITE_TRIAL } from './database.service';
import { SharedService } from './shared.service';
import { TRANSLATION_PARAMS, TranslationService } from './translation.service';

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------
export type STAT_FILTERS = {
  era: 'all' | 'pre' | 'post'
  board: 'solo' | 'group'
  top: number
  pos: number
}
export type STAT_FILTER_KEY = keyof STAT_FILTERS;

export const STAT_DEFAULT_FILTERS: STAT_FILTERS = { era: 'all', board: 'solo', top: 10, pos: 1 };

// Labels are translation keys (+ params), translated in the template
export const STAT_FILTER_OPTIONS: Record<STAT_FILTER_KEY, { label: string, options: { value: string | number, label: string, params?: TRANSLATION_PARAMS }[] }> = {
  era: { label: 'common.era', options: [{ value: 'all', label: 'common.all' }, { value: 'pre', label: 'common.preAwakening' }, { value: 'post', label: 'common.postAwakening' }] },
  board: { label: 'stats.filter.board', options: [{ value: 'solo', label: 'common.solo' }, { value: 'group', label: 'common.group' }] },
  top: { label: 'stats.filter.top', options: [1, 10, 100].map(value => ({ value, label: 'stats.filter.topOption', params: { top: value } })) },
  pos: { label: 'stats.filter.pos', options: [1, 5, 10, 25, 50, 100].map(value => ({ value, label: 'stats.filter.posOption', params: { pos: value } })) }
};

// ---------------------------------------------------------------------------
// Blocks: what a stat is made of, rendered generically by the statistics page
// ---------------------------------------------------------------------------
export type STAT_ICON = { src: string, cls?: string }

export type STAT_BAR_ITEM = {
  label: string
  isPlayerName?: boolean // replaced by "Themero" in themero mode
  icons?: STAT_ICON[]
  sub?: string
  value: number
  valueLabel: string
  link?: string
}

export type STAT_CELL = {
  text: string
  icons?: STAT_ICON[]
  sub?: string // small muted note after the text
  isPlayerName?: boolean
  muted?: boolean
  strong?: boolean
}

// Tables: a column with a sortKey is sortable on the matching row sortValues (null = no value, always last)
export type STAT_SORT = { key: string, dir: 'asc' | 'desc' }
export type STAT_TABLE_COLUMN = { label: string, align?: 'left' | 'center' | 'right', sortKey?: string }
export type STAT_TABLE_ROW = { cells: STAT_CELL[], link?: string, sortValues?: Record<string, number | null> }

export type STAT_BLOCK = { title?: string, subtitle?: string, wide?: boolean } & (
  | { type: 'kpis', items: { label: string, value: string, sub?: string, isPlayerName?: boolean, link?: string }[] }
  | { type: 'bars', items: STAT_BAR_ITEM[], ranked?: boolean }
  | { type: 'trend', points: { label: string, value: number, tooltip?: string }[], zeroBased: boolean, unit?: string }
  | { type: 'heatmap', columns: string[], rows: { label: string, icon?: STAT_ICON, values: (number | null)[] }[] }
  | { type: 'table', columns: STAT_TABLE_COLUMN[], rows: STAT_TABLE_ROW[], defaultSort?: STAT_SORT }
);

// category, title, description and seeAlso text/label are translation keys (translated in the template)
export type STAT_DEFINITION = {
  slug: string
  category: string
  title: string
  description: string
  icon: string
  filters: STAT_FILTER_KEY[]
  defaults?: Partial<STAT_FILTERS>
  // Shown under the description, e.g. to point to a related community project
  seeAlso?: { text: string, label: string, url: string }
  // Can be restricted to favorite players or guilds ("Favorites only" setting)
  favorites?: 'players' | 'guilds'
}

const AWAKENING_WEEK = 282;

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  public readonly definitions: STAT_DEFINITION[] = [
    // Trials meta
    { slug: 'weapons', category: 'stats.category.trialsMeta', title: 'stats.def.weapons.title', description: 'stats.def.weapons.description', icon: 'fa-solid fa-hammer', filters: ['era', 'board', 'top'], favorites: 'players' },
    { slug: 'weapon-trend', category: 'stats.category.trialsMeta', title: 'stats.def.weaponTrend.title', description: 'stats.def.weaponTrend.description', icon: 'fa-solid fa-timeline', filters: ['era', 'board', 'top'], favorites: 'players' },
    { slug: 'omnicells', category: 'stats.category.trialsMeta', title: 'stats.def.omnicells.title', description: 'stats.def.omnicells.description', icon: 'fa-solid fa-gem', filters: ['era', 'board', 'top'], favorites: 'players' },
    { slug: 'loadouts', category: 'stats.category.trialsMeta', title: 'stats.def.loadouts.title', description: 'stats.def.loadouts.description', icon: 'fa-solid fa-toolbox', filters: ['era', 'board', 'top'], favorites: 'players' },
    { slug: 'group-comps', category: 'stats.category.trialsMeta', title: 'stats.def.groupComps.title', description: 'stats.def.groupComps.description', icon: 'fa-solid fa-people-group', filters: ['era', 'top'], favorites: 'players' },
    // Records
    { slug: 'records', category: 'stats.category.records', title: 'stats.def.records.title', description: 'stats.def.records.description', icon: 'fa-solid fa-stopwatch', filters: ['era'], defaults: { era: 'pre' }, favorites: 'players' },
    { slug: 'photo-finishes', category: 'stats.category.records', title: 'stats.def.photoFinishes.title', description: 'stats.def.photoFinishes.description', icon: 'fa-solid fa-flag-checkered', filters: ['era', 'board'], favorites: 'players' },
    { slug: 'behemoths', category: 'stats.category.records', title: 'stats.def.behemoths.title', description: 'stats.def.behemoths.description', icon: 'fa-solid fa-dragon', filters: ['era'] },
    // Players
    { slug: 'top-players', category: 'common.players', title: 'stats.def.topPlayers.title', description: 'stats.def.topPlayers.description', icon: 'fa-solid fa-crown', filters: ['era', 'board', 'top'], defaults: { top: 1 }, seeAlso: { text: 'stats.def.topPlayers.seeAlsoText', label: 'stats.def.topPlayers.seeAlsoLabel', url: 'https://discord.gg/snwcPJ4xSF' }, favorites: 'players' },
    { slug: 'platforms', category: 'common.players', title: 'stats.def.platforms.title', description: 'stats.def.platforms.description', icon: 'fa-solid fa-gamepad', filters: ['era', 'board', 'top'], defaults: { top: 100 }, favorites: 'players' },
    { slug: 'loyalty', category: 'common.players', title: 'stats.def.loyalty.title', description: 'stats.def.loyalty.description', icon: 'fa-solid fa-shuffle', filters: ['era', 'board'], favorites: 'players' },
    { slug: 'newcomers', category: 'common.players', title: 'stats.def.newcomers.title', description: 'stats.def.newcomers.description', icon: 'fa-solid fa-seedling', filters: ['board', 'top'], defaults: { top: 100 }, favorites: 'players' },
    // Gauntlet
    { slug: 'gauntlet-champions', category: 'nav.gauntlet', title: 'stats.def.gauntletChampions.title', description: 'stats.def.gauntletChampions.description', icon: 'fa-solid fa-trophy', filters: [], favorites: 'guilds' },
    { slug: 'level-race', category: 'nav.gauntlet', title: 'stats.def.levelRace.title', description: 'stats.def.levelRace.description', icon: 'fa-solid fa-stairs', filters: ['pos'] },
    { slug: 'guild-veterans', category: 'nav.gauntlet', title: 'stats.def.guildVeterans.title', description: 'stats.def.guildVeterans.description', icon: 'fa-solid fa-shield-halved', filters: [], favorites: 'guilds' }
  ];

  private builders: Record<string, (filters: STAT_FILTERS) => STAT_BLOCK[]> = {
    'weapons': f => this.buildWeapons(f),
    'weapon-trend': f => this.buildWeaponTrend(f),
    'omnicells': f => this.buildOmnicells(f),
    'loadouts': f => this.buildLoadouts(f),
    'group-comps': f => this.buildGroupComps(f),
    'records': f => this.buildRecords(f),
    'photo-finishes': f => this.buildPhotoFinishes(f),
    'behemoths': f => this.buildBehemoths(f),
    'top-players': f => this.buildTopPlayers(f),
    'platforms': f => this.buildPlatforms(f),
    'loyalty': f => this.buildLoyalty(f),
    'newcomers': f => this.buildNewcomers(f),
    'gauntlet-champions': () => this.buildGauntletChampions(),
    'level-race': f => this.buildLevelRace(f),
    'guild-veterans': () => this.buildGuildVeterans()
  };

  // Old slugs still reachable from shared links
  private renamedSlugs: Record<string, string> = {
    'hall-of-fame': 'top-players'
  };

  // Data never changes once loaded: cache per stat + filters + language
  private cache = new Map<string, STAT_BLOCK[]>();

  // Favorites the stat being built is restricted to (null = everyone)
  private favoritePlayers: Set<number> | null = null;
  private favoriteGuilds: Set<number> | null = null;

  constructor(
    private databaseService: DatabaseService,
    private sharedService: SharedService,
    private translationService: TranslationService
  ) { }

  public getDefinition(slug: string | null): STAT_DEFINITION | undefined {
    return this.definitions.find(definition => definition.slug === slug);
  }

  public getRenamedSlug(slug: string): string | undefined {
    return this.renamedSlugs[slug];
  }

  // Filters of a stat: defaults < stat defaults < query params (only the ones the stat uses)
  public resolveFilters(definition: STAT_DEFINITION, params: Record<string, string | null>): STAT_FILTERS {
    const filters: STAT_FILTERS = { ...STAT_DEFAULT_FILTERS, ...definition.defaults };
    for (const key of definition.filters) {
      const raw = params[key];
      const option = STAT_FILTER_OPTIONS[key].options.find(o => String(o.value) === raw);
      if (option) (filters as Record<string, string | number>)[key] = option.value;
    }
    return filters;
  }

  public getBlocks(slug: string, filters: STAT_FILTERS): STAT_BLOCK[] {
    const scope = this.sharedService.favoritesOnly ? this.getDefinition(slug)?.favorites : undefined;
    this.favoritePlayers = scope === 'players' ? new Set(this.sharedService.favoritePlayers) : null;
    this.favoriteGuilds = scope === 'guilds' ? new Set(this.sharedService.favoriteGuilds) : null;
    const favorites = this.favoritePlayers || this.favoriteGuilds;

    const key = `${slug}|${JSON.stringify(filters)}|${this.sharedService.trialDecimals}|${favorites ? [...favorites].sort((a, b) => a - b).join(',') : '-'}|${this.translationService.language.code}`;
    if (!this.cache.has(key)) this.cache.set(key, this.builders[slug]?.(filters) || []);
    return this.cache.get(key)!;
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------
  private trialsFor(era: STAT_FILTERS['era']): WEBSITE_TRIAL[] {
    return this.databaseService.data.trials.filter(t => t.all.length > 0 && this.inEra(t.week, era));
  }

  private inEra(week: number, era: STAT_FILTERS['era']): boolean {
    return era === 'all' || (era === 'pre' ? week < AWAKENING_WEEK : week >= AWAKENING_WEEK);
  }

  private runs(trial: WEBSITE_TRIAL, filters: STAT_FILTERS) {
    return (filters.board === 'solo' ? trial.all : trial.group).filter(run => run.rank <= filters.top);
  }

  private isCountedPlayer(playerId: number): boolean {
    return !this.favoritePlayers || this.favoritePlayers.has(playerId);
  }

  private isCountedGuild(guildId: number): boolean {
    return !this.favoriteGuilds || this.favoriteGuilds.has(guildId);
  }

  // Run with at least one counted player
  private isCountedRun(run: { players: TRIAL_LEADERBOARD_PLAYER[] }): boolean {
    return !this.favoritePlayers || run.players.some(player => this.isCountedPlayer(player.playerId));
  }

  // Every (counted) player slot of the counted runs
  private forEachPlayer(filters: STAT_FILTERS, callback: (player: TRIAL_LEADERBOARD_PLAYER, trial: WEBSITE_TRIAL) => void) {
    for (const trial of this.trialsFor(filters.era)) {
      for (const run of this.runs(trial, filters)) {
        for (const player of run.players) if (this.isCountedPlayer(player.playerId)) callback(player, trial);
      }
    }
  }

  private increment<K>(map: Map<K, number>, key: K, amount: number = 1) {
    map.set(key, (map.get(key) || 0) + amount);
  }

  private sortedEntries<K>(map: Map<K, number>): [K, number][] {
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }

  private t(key: string, params?: TRANSLATION_PARAMS): string {
    return this.translationService.t(key, params);
  }

  private percent(value: number, total: number): string {
    return total ? formatPercent(value / total, this.translationService.language.locale, '1.1-1') : '–';
  }

  private formatNumber(value: number, digitsInfo?: string): string {
    return formatLocaleNumber(value, this.translationService.language.locale, digitsInfo);
  }

  // Counted text with a localized number: "{value} picks" (key_one / key_other)
  private count(key: string, count: number, params?: TRANSLATION_PARAMS): string {
    return this.t(key, { ...params, count, value: this.formatNumber(count) });
  }

  private time(ms: number): string {
    return this.sharedService.convertTrialTime(ms, true) || this.t('stats.common.zeroTime');
  }

  private icon(folder: 'weapons' | 'omnicells' | 'platforms' | 'behemoths', id: number | string): STAT_ICON {
    return { src: this.sharedService.getImgPath(`${id}.png`, folder), cls: folder === 'platforms' ? 'platform-icon' : undefined };
  }

  private weaponName(id: number): string {
    const key = `weapon.${id}`;
    const name = this.t(key);
    return name !== key ? name : this.t('stats.common.weaponFallback', { id });
  }

  private omnicellName(id: number): string {
    return this.sharedService.omnicellNames[id] || this.t('stats.common.omnicellFallback', { id });
  }

  private platformName(id: number): string {
    return this.sharedService.platformNames[id] || this.t('stats.common.platformFallback', { id });
  }

  private playerName(id: number): string {
    const names = this.databaseService.data.players[id - 1]?.playerNames || [];
    return [...names].sort((a, b) => a.platformId - b.platformId)[0]?.name || this.t('stats.common.playerFallback', { id });
  }

  private guildLabel(id: number): string {
    const guild = this.databaseService.data.guilds[id - 1];
    return guild ? `${guild.name} [${guild.tag}]` : this.t('stats.common.unknownGuild');
  }

  private year(trial: WEBSITE_TRIAL): number {
    return new Date(trial.startAt).getUTCFullYear();
  }

  // "Top 10 solo runs · All eras · Favorites only"
  private scope(filters: STAT_FILTERS, withBoard: boolean = true, withEra: boolean = true): string {
    const parts: string[] = [];
    if (withBoard) {
      parts.push(filters.board === 'solo'
        ? (filters.top === 1 ? this.t('stats.scope.winningSolo') : this.t('stats.scope.topSolo', { top: filters.top }))
        : (filters.top === 1 ? this.t('stats.scope.winningGroup') : this.t('stats.scope.topGroup', { top: filters.top })));
    }
    if (withEra) parts.push(this.t({ all: 'stats.scope.allEras', pre: 'common.preAwakening', post: 'common.postAwakening' }[filters.era]));
    if (this.favoritePlayers) parts.push(this.t('stats.scope.favoritesOnly'));
    return parts.join(' · ');
  }

  // Share of each key per year, as heatmap rows ordered by overall share
  private heatmapByYear(trials: WEBSITE_TRIAL[], filters: STAT_FILTERS, getKeys: (player: TRIAL_LEADERBOARD_PLAYER, trial: WEBSITE_TRIAL) => number[], getRow: (key: number) => { label: string, icon?: STAT_ICON }) {
    const years = [...new Set(trials.map(t => this.year(t)))].sort();
    const perYear = new Map<number, Map<number, number>>();
    const totals = new Map<number, number>();
    const overall = new Map<number, number>();

    for (const trial of trials) {
      const year = this.year(trial);
      if (!perYear.has(year)) perYear.set(year, new Map());
      for (const run of this.runs(trial, filters)) {
        for (const player of run.players) {
          if (!this.isCountedPlayer(player.playerId)) continue;
          for (const key of getKeys(player, trial)) {
            this.increment(perYear.get(year)!, key);
            this.increment(totals, year);
            this.increment(overall, key);
          }
        }
      }
    }

    return {
      columns: years.map(String),
      rows: this.sortedEntries(overall).map(([key]) => ({
        ...getRow(key),
        values: years.map(year => totals.get(year) ? (perYear.get(year)?.get(key) || 0) / totals.get(year)! : null)
      }))
    };
  }

  // unitKey: counted text key ("{value} picks", key_one / key_other)
  private shareBars(map: Map<number, number>, getItem: (key: number) => { label: string, icons?: STAT_ICON[] }, unitKey: string): STAT_BAR_ITEM[] {
    const total = [...map.values()].reduce((sum, count) => sum + count, 0);
    return this.sortedEntries(map).map(([key, count]) => ({
      ...getItem(key),
      value: count,
      valueLabel: this.percent(count, total),
      sub: this.count(unitKey, count)
    }));
  }

  // -------------------------------------------------------------------------
  // Trials meta
  // -------------------------------------------------------------------------
  private buildWeapons(filters: STAT_FILTERS): STAT_BLOCK[] {
    const primary = new Map<number, number>();
    const secondary = new Map<number, number>();
    this.forEachPlayer(filters, (player, trial) => {
      this.increment(primary, player.weaponId);
      if (trial.week >= AWAKENING_WEEK && player.secondaryWeaponId) this.increment(secondary, player.secondaryWeaponId);
    });

    const weaponItem = (id: number) => ({ label: this.weaponName(id), icons: [this.icon('weapons', id)] });
    const blocks: STAT_BLOCK[] = [
      { type: 'bars', title: this.t('stats.weapons.primary'), subtitle: this.scope(filters), items: this.shareBars(primary, weaponItem, 'stats.common.picks') }
    ];
    if (secondary.size) {
      blocks.push({ type: 'bars', title: this.t('stats.weapons.secondary'), subtitle: this.t('stats.weapons.secondarySubtitle'), items: this.shareBars(secondary, weaponItem, 'stats.common.picks') });
    }
    return blocks;
  }

  private buildWeaponTrend(filters: STAT_FILTERS): STAT_BLOCK[] {
    const heatmap = this.heatmapByYear(this.trialsFor(filters.era), filters, player => [player.weaponId], id => ({ label: this.weaponName(id), icon: this.icon('weapons', id) }));

    // Biggest share change between the first and the last year
    const first = 0;
    const last = heatmap.columns.length - 1;
    const deltas = heatmap.rows
      .map(row => ({ label: row.label, delta: (row.values[last] || 0) - (row.values[first] || 0) }))
      .sort((a, b) => b.delta - a.delta);
    const points = (delta: number) => this.t('stats.weaponTrend.points', { value: `${delta > 0 ? '+' : ''}${this.formatNumber(delta * 100, '1.1-1')}` });
    const period = `${heatmap.columns[first]} → ${heatmap.columns[last]}`;

    return [
      {
        type: 'kpis', items: [
          { label: this.t('stats.weaponTrend.biggestRise'), value: deltas[0]?.label || '–', sub: deltas[0] ? `${points(deltas[0].delta)} · ${period}` : undefined },
          { label: this.t('stats.weaponTrend.biggestFall'), value: deltas[deltas.length - 1]?.label || '–', sub: deltas.length ? `${points(deltas[deltas.length - 1].delta)} · ${period}` : undefined },
          { label: this.t('stats.weaponTrend.yearsCovered'), value: String(heatmap.columns.length), sub: period }
        ]
      },
      { type: 'heatmap', wide: true, title: this.t('stats.weaponTrend.heatmapTitle'), subtitle: this.t('stats.weaponTrend.heatmapSubtitle', { scope: this.scope(filters) }), ...heatmap }
    ];
  }

  private buildOmnicells(filters: STAT_FILTERS): STAT_BLOCK[] {
    const counts = new Map<number, number>();
    this.forEachPlayer(filters, player => {
      if (player.roleId) this.increment(counts, player.roleId);
    });
    const heatmap = this.heatmapByYear(this.trialsFor(filters.era), filters, player => player.roleId ? [player.roleId] : [], id => ({ label: this.omnicellName(id), icon: this.icon('omnicells', id) }));

    return [
      { type: 'bars', title: this.t('stats.omnicells.picks'), subtitle: this.scope(filters), items: this.shareBars(counts, id => ({ label: this.omnicellName(id), icons: [this.icon('omnicells', id)] }), 'stats.common.picks') },
      { type: 'heatmap', title: this.t('stats.common.perYear'), subtitle: this.t('stats.common.columnsSum'), ...heatmap }
    ];
  }

  private buildLoadouts(filters: STAT_FILTERS): STAT_BLOCK[] {
    const counts = new Map<string, number>();
    let total = 0;
    this.forEachPlayer(filters, (player, trial) => {
      const secondary = trial.week >= AWAKENING_WEEK ? player.secondaryWeaponId || 0 : 0;
      this.increment(counts, `${player.weaponId}-${secondary}-${player.roleId || 0}`);
      total++;
    });

    const items = this.sortedEntries(counts).slice(0, 15).map(([key, count]): STAT_BAR_ITEM => {
      const [weapon, secondary, omnicell] = key.split('-').map(Number);
      const weapons = [weapon, secondary].filter(Boolean);
      return {
        label: `${weapons.map(id => this.weaponName(id)).join(' + ')}${omnicell ? ` · ${this.omnicellName(omnicell)}` : ''}`,
        icons: [...weapons.map(id => this.icon('weapons', id)), ...(omnicell ? [this.icon('omnicells', omnicell)] : [])],
        value: count,
        valueLabel: this.percent(count, total),
        sub: this.count('stats.common.picks', count)
      };
    });

    return [
      {
        type: 'kpis', items: [
          { label: this.t('stats.loadouts.distinct'), value: this.formatNumber(counts.size), sub: this.scope(filters) },
          { label: this.t('stats.loadouts.mostPlayed'), value: items[0]?.label || '–', sub: items[0] ? this.t('stats.loadouts.mostPlayedSub', { percent: items[0].valueLabel }) : undefined },
          { label: this.t('stats.loadouts.top15Coverage'), value: this.percent(items.reduce((sum, item) => sum + item.value, 0), total), sub: this.t('stats.loadouts.ofAllPicks') }
        ]
      },
      { type: 'bars', wide: true, ranked: true, title: this.t('stats.loadouts.top15Title'), subtitle: this.t('stats.loadouts.top15Subtitle'), items }
    ];
  }

  private buildGroupComps(filters: STAT_FILTERS): STAT_BLOCK[] {
    const groupFilters: STAT_FILTERS = { ...filters, board: 'group' };
    const counts = new Map<string, number>();
    let total = 0;
    let mono = 0;
    let full = 0;

    for (const trial of this.trialsFor(filters.era)) {
      for (const run of this.runs(trial, groupFilters)) {
        if (!this.isCountedRun(run)) continue;
        const weapons = run.players.map(p => p.weaponId).sort((a, b) => a - b);
        this.increment(counts, weapons.join('-'));
        total++;
        if (weapons.length > 1 && new Set(weapons).size === 1) mono++;
        if (weapons.length === 4) full++;
      }
    }

    const items = this.sortedEntries(counts).slice(0, 12).map(([key, count]): STAT_BAR_ITEM => {
      const weapons = key.split('-').map(Number);
      const perWeapon = new Map<number, number>();
      weapons.forEach(id => this.increment(perWeapon, id));
      return {
        label: [...perWeapon.entries()].map(([id, n]) => `${n > 1 ? `${n}× ` : ''}${this.weaponName(id)}`).join(', '),
        icons: weapons.map(id => this.icon('weapons', id)),
        value: count,
        valueLabel: this.percent(count, total),
        sub: this.count('stats.groupComps.groups', count)
      };
    });

    return [
      {
        type: 'kpis', items: [
          { label: this.t('stats.groupComps.groupsCounted'), value: this.formatNumber(total), sub: this.scope(groupFilters) },
          { label: this.t('stats.groupComps.distinct'), value: this.formatNumber(counts.size), sub: this.t('stats.groupComps.orderIgnored') },
          { label: this.t('stats.groupComps.mono'), value: this.percent(mono, total), sub: this.count('stats.groupComps.monoSub', mono) },
          { label: this.t('stats.groupComps.full'), value: this.percent(full, total), sub: this.t('stats.groupComps.fullSub') }
        ]
      },
      { type: 'bars', wide: true, ranked: true, title: this.t('stats.groupComps.mostCommon'), items }
    ];
  }

  // -------------------------------------------------------------------------
  // Records
  // -------------------------------------------------------------------------
  private buildRecords(filters: STAT_FILTERS): STAT_BLOCK[] {
    type RECORD = { time: number, week: number, playerIds: number[] };
    const behemoths = new Map<string, { solo?: RECORD, group?: RECORD, weeks: number }>();

    for (const trial of this.trialsFor(filters.era)) {
      const entry = behemoths.get(trial.behemothName) || { weeks: 0 };
      entry.weeks++;
      // Boards are sorted by rank: the first counted run is the best one
      const solo = trial.all.find(run => this.isCountedRun(run));
      const group = trial.group.find(run => this.isCountedRun(run));
      if (solo && (!entry.solo || solo.completionTime < entry.solo.time)) entry.solo = { time: solo.completionTime, week: trial.week, playerIds: solo.players.map(p => p.playerId) };
      if (group && (!entry.group || group.completionTime < entry.group.time)) entry.group = { time: group.completionTime, week: trial.week, playerIds: group.players.map(p => p.playerId) };
      behemoths.set(trial.behemothName, entry);
    }

    const rows = [...behemoths.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, entry]): STAT_TABLE_ROW => ({
        link: entry.solo ? `/trials/${entry.solo.week}` : undefined,
        sortValues: { solo: entry.solo?.time ?? null, group: entry.group?.time ?? null },
        cells: [
          { text: name, icons: [this.icon('behemoths', name)], strong: true },
          { text: entry.solo ? this.time(entry.solo.time) : '–', sub: entry.solo ? this.t('common.weekShort', { week: entry.solo.week }) : undefined },
          { text: entry.solo ? this.playerName(entry.solo.playerIds[0]) : '–', isPlayerName: !!entry.solo },
          { text: entry.group ? this.time(entry.group.time) : '–', sub: entry.group ? this.t('common.weekShort', { week: entry.group.week }) : undefined },
          { text: String(entry.weeks), muted: true }
        ]
      }));

    const all = [...behemoths.entries()];
    const fastestSolo = all.filter(([, e]) => e.solo).sort((a, b) => a[1].solo!.time - b[1].solo!.time)[0];
    const fastestGroup = all.filter(([, e]) => e.group).sort((a, b) => a[1].group!.time - b[1].group!.time)[0];

    return [
      {
        type: 'kpis', items: [
          { label: this.t('stats.records.fastestSolo'), value: fastestSolo ? this.time(fastestSolo[1].solo!.time) : '–', sub: fastestSolo ? this.t('stats.records.behemothWeek', { behemoth: fastestSolo[0], week: fastestSolo[1].solo!.week }) : undefined, link: fastestSolo ? `/trials/${fastestSolo[1].solo!.week}` : undefined },
          { label: this.t('stats.records.fastestGroup'), value: fastestGroup ? this.time(fastestGroup[1].group!.time) : '–', sub: fastestGroup ? this.t('stats.records.behemothWeek', { behemoth: fastestGroup[0], week: fastestGroup[1].group!.week }) : undefined, link: fastestGroup ? `/trials/${fastestGroup[1].group!.week}` : undefined },
          { label: this.t('stats.records.behemoths'), value: String(behemoths.size), sub: this.scope(filters, false) }
        ]
      },
      {
        type: 'table', wide: true, title: this.t('stats.records.tableTitle'),
        subtitle: this.t('stats.records.tableSubtitle'),
        columns: [{ label: this.t('stats.records.behemoth') }, { label: this.t('stats.records.soloRecord'), sortKey: 'solo' }, { label: this.t('stats.records.soloHolder') }, { label: this.t('stats.records.groupRecord'), sortKey: 'group' }, { label: this.t('stats.records.trialsCount'), align: 'right' }],
        rows,
        defaultSort: { key: 'solo', dir: 'asc' }
      }
    ];
  }

  private buildPhotoFinishes(filters: STAT_FILTERS): STAT_BLOCK[] {
    const races = this.trialsFor(filters.era)
      .map(trial => {
        const board = filters.board === 'solo' ? trial.all : trial.group;
        return board.length > 1 ? { trial, winner: board[0], margin: board[1].completionTime - board[0].completionTime } : null;
      })
      .filter((race): race is NonNullable<typeof race> => race !== null && this.isCountedRun(race.winner))
      .sort((a, b) => a.margin - b.margin);

    const toRow = (race: typeof races[number]) => ({
      link: `/trials/${race.trial.week}`,
      cells: [
        { text: this.t('common.weekShort', { week: race.trial.week }), icons: [this.icon('behemoths', race.trial.behemothName)], muted: true },
        { text: race.winner.players.map(p => p.playerName || this.playerName(p.playerId)).join(', '), isPlayerName: true },
        { text: race.margin === 0 ? this.t('stats.photoFinishes.exactTie') : this.time(race.margin), strong: true }
      ]
    });
    const columns: STAT_TABLE_COLUMN[] = [{ label: this.t('common.week') }, { label: this.t(filters.board === 'solo' ? 'stats.photoFinishes.winner' : 'stats.photoFinishes.winners') }, { label: this.t('stats.common.margin') }];
    const average = races.reduce((sum, race) => sum + race.margin, 0) / (races.length || 1);
    const closest = races[0];
    const biggest = races[races.length - 1];

    return [
      {
        type: 'kpis', items: [
          { label: this.t('stats.photoFinishes.closest'), value: closest ? (closest.margin === 0 ? this.t('stats.photoFinishes.exactTie') : this.time(closest.margin)) : '–', sub: closest ? this.t('stats.photoFinishes.weekBehemoth', { week: closest.trial.week, behemoth: closest.trial.behemothName }) : undefined, link: closest ? `/trials/${closest.trial.week}` : undefined },
          { label: this.t('stats.photoFinishes.averageMargin'), value: this.time(Math.round(average)), sub: this.t('stats.photoFinishes.averageSub', { scope: this.scope(filters, false) }) },
          { label: this.t('stats.photoFinishes.biggestMargin'), value: biggest ? this.time(biggest.margin) : '–', sub: biggest ? this.t('stats.photoFinishes.weekBehemoth', { week: biggest.trial.week, behemoth: biggest.trial.behemothName }) : undefined, link: biggest ? `/trials/${biggest.trial.week}` : undefined }
        ]
      },
      { type: 'table', title: this.t('stats.def.photoFinishes.title'), subtitle: this.t('stats.photoFinishes.smallestGap'), columns, rows: races.slice(0, 10).map(toRow) },
      { type: 'table', title: this.t('stats.photoFinishes.domination'), subtitle: this.t('stats.photoFinishes.biggestGap'), columns, rows: races.slice(-10).reverse().map(toRow) }
    ];
  }

  private buildBehemoths(filters: STAT_FILTERS): STAT_BLOCK[] {
    // Disabled weeks (282, 283) still had a behemoth
    const trials = this.databaseService.data.trials.filter(t => this.inEra(t.week, filters.era));
    const counts = new Map<string, number>();
    trials.forEach(trial => this.increment(counts, trial.behemothName));
    const sorted = this.sortedEntries(counts);
    const once = sorted.filter(([, count]) => count === 1).length;

    return [
      {
        type: 'kpis', items: [
          { label: this.t('stats.behemoths.different'), value: String(counts.size), sub: this.t('stats.behemoths.overTrials', { count: trials.length }) },
          { label: this.t('stats.behemoths.mostFeatured'), value: sorted[0]?.[0] || '–', sub: sorted[0] ? this.t('stats.behemoths.weeks', { count: sorted[0][1] }) : undefined },
          { label: this.t('stats.behemoths.featuredOnce'), value: String(once), sub: once ? sorted.filter(([, count]) => count === 1).map(([name]) => name).slice(0, 3).join(', ') + (once > 3 ? '…' : '') : this.t('stats.common.none') }
        ]
      },
      {
        type: 'bars', wide: true, ranked: true, title: this.t('stats.behemoths.barsTitle'), subtitle: this.scope(filters, false),
        items: sorted.map(([name, count]) => ({ label: name, icons: [this.icon('behemoths', name)], value: count, valueLabel: this.t('stats.behemoths.weeksShort', { count }) }))
      }
    ];
  }

  // -------------------------------------------------------------------------
  // Players
  // -------------------------------------------------------------------------
  private buildTopPlayers(filters: STAT_FILTERS): STAT_BLOCK[] {
    const counts = new Map<number, number>();
    this.forEachPlayer(filters, player => this.increment(counts, player.playerId));
    const sorted = this.sortedEntries(counts);
    // Wins (top 1) or top N finishes
    const wins = filters.top === 1;
    const top = { top: filters.top };

    return [
      {
        type: 'kpis', items: [
          { label: this.t('stats.topPlayers.different'), value: this.formatNumber(counts.size), sub: this.t(wins ? 'stats.topPlayers.differentSubWins' : 'stats.topPlayers.differentSubTop', top) },
          { label: this.t('stats.topPlayers.leader'), value: sorted[0] ? this.playerName(sorted[0][0]) : '–', isPlayerName: true, sub: sorted[0] ? this.count(wins ? 'stats.topPlayers.leaderWins' : 'stats.topPlayers.leaderTop', sorted[0][1], top) : undefined, link: sorted[0] ? `/players/${sorted[0][0]}` : undefined },
          { label: this.t('stats.topPlayers.top15Share'), value: this.percent(sorted.slice(0, 15).reduce((sum, [, n]) => sum + n, 0), sorted.reduce((sum, [, n]) => sum + n, 0)), sub: this.t(wins ? 'stats.topPlayers.shareSubWins' : 'stats.topPlayers.shareSubTop', top) }
        ]
      },
      {
        type: 'bars', wide: true, ranked: true, title: this.t(wins ? 'stats.topPlayers.titleWins' : 'stats.topPlayers.titleTop', top), subtitle: this.scope(filters),
        items: sorted.slice(0, 15).map(([id, count]) => ({ label: this.playerName(id), isPlayerName: true, value: count, valueLabel: this.formatNumber(count), link: `/players/${id}` }))
      }
    ];
  }

  private buildPlatforms(filters: STAT_FILTERS): STAT_BLOCK[] {
    const counts = new Map<number, number>();
    this.forEachPlayer(filters, player => this.increment(counts, player.platformId));
    const platformRow = (id: number) => ({ label: this.platformName(id), icon: this.icon('platforms', id) });
    const heatmap = this.heatmapByYear(this.trialsFor(filters.era), filters, player => [player.platformId], platformRow);

    return [
      { type: 'bars', title: this.t('stats.platforms.shareTitle'), subtitle: this.scope(filters), items: this.shareBars(counts, id => ({ label: platformRow(id).label, icons: [platformRow(id).icon] }), 'stats.platforms.playerSlots') },
      { type: 'heatmap', title: this.t('stats.common.perYear'), subtitle: this.t('stats.common.columnsSum'), ...heatmap }
    ];
  }

  private buildLoyalty(filters: STAT_FILTERS): STAT_BLOCK[] {
    const MIN_RUNS = 10;
    const min = { min: MIN_RUNS };
    const perPlayer = new Map<number, Map<number, number>>();
    this.forEachPlayer({ ...filters, top: 100 }, player => {
      if (!perPlayer.has(player.playerId)) perPlayer.set(player.playerId, new Map());
      this.increment(perPlayer.get(player.playerId)!, player.weaponId);
    });

    const players = [...perPlayer.entries()].map(([id, weapons]) => ({
      id,
      weapons: this.sortedEntries(weapons),
      runs: [...weapons.values()].reduce((sum, n) => sum + n, 0)
    }));

    const oneTricks = players
      .filter(p => p.weapons.length === 1 && p.runs >= MIN_RUNS)
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 12);
    const allRounders = players
      .filter(p => p.runs >= MIN_RUNS)
      .sort((a, b) => b.weapons.length - a.weapons.length || b.runs - a.runs)
      .slice(0, 12);
    const loyal = players.filter(p => p.runs >= MIN_RUNS);

    return [
      {
        type: 'kpis', items: [
          { label: this.t('stats.loyalty.playersWithRuns', min), value: this.formatNumber(loyal.length), sub: this.scope({ ...filters, top: 100 }) },
          { label: this.t('stats.loyalty.trueOneTricks'), value: this.percent(loyal.filter(p => p.weapons.length === 1).length, loyal.length), sub: this.t('stats.loyalty.neverTouched') },
          { label: this.t('stats.loyalty.averageWeapons'), value: this.formatNumber(loyal.reduce((sum, p) => sum + p.weapons.length, 0) / (loyal.length || 1), '1.1-1'), sub: this.t('stats.loyalty.perPlayer', min) }
        ]
      },
      {
        type: 'bars', ranked: true, title: this.t('stats.loyalty.oneTricks'), subtitle: this.t('stats.loyalty.oneTricksSubtitle', min),
        items: oneTricks.map(p => ({ label: this.playerName(p.id), isPlayerName: true, icons: [this.icon('weapons', p.weapons[0][0])], value: p.runs, valueLabel: this.count('stats.loyalty.runs', p.runs), link: `/players/${p.id}` }))
      },
      {
        type: 'bars', ranked: true, title: this.t('stats.loyalty.allRounders'), subtitle: this.t('stats.loyalty.allRoundersSubtitle', min),
        items: allRounders.map(p => ({ label: this.playerName(p.id), isPlayerName: true, sub: this.count('stats.loyalty.runs', p.runs), value: p.weapons.length, valueLabel: this.t('stats.loyalty.weapons', { count: p.weapons.length }), link: `/players/${p.id}` }))
      }
    ];
  }

  private buildNewcomers(filters: STAT_FILTERS): STAT_BLOCK[] {
    const seen = new Set<number>();
    const perQuarter = new Map<string, number>();
    const trials = [...this.trialsFor('all')].reverse(); // oldest first

    for (const trial of trials) {
      const date = new Date(trial.startAt);
      const quarter = this.t('stats.newcomers.quarter', { year: date.getUTCFullYear(), quarter: Math.floor(date.getUTCMonth() / 3) + 1 });
      if (!perQuarter.has(quarter)) perQuarter.set(quarter, 0);
      for (const run of this.runs(trial, filters)) {
        for (const player of run.players) {
          if (seen.has(player.playerId) || !this.isCountedPlayer(player.playerId)) continue;
          seen.add(player.playerId);
          this.increment(perQuarter, quarter);
        }
      }
    }

    const points = [...perQuarter.entries()].map(([label, value]) => ({ label, value }));
    const afterLaunch = points.slice(1);
    const best = [...afterLaunch].sort((a, b) => b.value - a.value)[0];
    const lastFour = points.slice(-4).reduce((sum, p) => sum + p.value, 0);

    return [
      {
        type: 'kpis', items: [
          // Every era counted: no era filter on this stat
          { label: this.t('stats.newcomers.everCounted'), value: this.formatNumber(seen.size), sub: this.scope(filters, true, false) },
          { label: this.t('stats.newcomers.bestQuarter'), value: best?.label || '–', sub: best ? this.count('stats.newcomers.bestQuarterSub', best.value) : undefined },
          { label: this.t('stats.newcomers.lastFour'), value: this.formatNumber(lastFour), sub: this.t('stats.newcomers.newcomers') }
        ]
      },
      { type: 'trend', wide: true, title: this.t('stats.newcomers.trendTitle'), subtitle: this.t('stats.newcomers.trendSubtitle'), points, zeroBased: true, unit: this.t('stats.newcomers.unit') }
    ];
  }

  // -------------------------------------------------------------------------
  // Gauntlet
  // -------------------------------------------------------------------------
  private buildGauntletChampions(): STAT_BLOCK[] {
    const seasons = this.databaseService.data.gauntlets;
    const wins = new Map<number, number>();
    let longestReign = { guildId: 0, length: 0 };
    let reign = { guildId: 0, length: 0 };

    const rows = seasons.map(season => {
      const [first, second] = season.gauntletLeaderboard;
      if (first?.guildId && !this.isCountedGuild(first.guildId)) {
        reign = { guildId: 0, length: 0 };
        return null;
      }
      if (first?.guildId) {
        this.increment(wins, first.guildId);
        reign = reign.guildId === first.guildId ? { guildId: first.guildId, length: reign.length + 1 } : { guildId: first.guildId, length: 1 };
        if (reign.length > longestReign.length) longestReign = { ...reign };
      }
      const margin = !first || !second ? '–'
        : first.level !== second.level ? this.t('stats.gauntletChampions.levelsAhead', { count: first.level - second.level })
          : this.count('stats.gauntletChampions.secondsLeft', first.remainingSec - second.remainingSec);
      return {
        link: `/seasons/${season.gauntletInfo.season}`,
        cells: [
          { text: this.t('common.seasonShort', { season: season.gauntletInfo.season }), muted: true },
          { text: first ? `${first.guildName} [${first.guildTag}]` : '–', strong: true },
          { text: first ? String(first.level) : '–' },
          { text: margin, muted: true }
        ]
      };
    }).filter((row): row is NonNullable<typeof row> => row !== null).reverse();

    const sorted = this.sortedEntries(wins);
    return [
      {
        type: 'kpis', items: [
          { label: this.t('stats.gauntletChampions.different'), value: String(wins.size), sub: this.t('stats.gauntletChampions.overSeasons', { count: seasons.length }) },
          { label: this.t('stats.gauntletChampions.mostTitles'), value: sorted[0] ? this.guildLabel(sorted[0][0]) : '–', sub: sorted[0] ? this.t('stats.gauntletChampions.seasonsWon', { count: sorted[0][1] }) : undefined, link: sorted[0] ? `/guilds/${sorted[0][0]}` : undefined },
          { label: this.t('stats.gauntletChampions.longestReign'), value: longestReign.guildId ? this.guildLabel(longestReign.guildId) : '–', sub: this.t('stats.gauntletChampions.titlesInRow', { count: longestReign.length }), link: longestReign.guildId ? `/guilds/${longestReign.guildId}` : undefined }
        ]
      },
      {
        type: 'bars', wide: true, ranked: true, title: this.t('stats.gauntletChampions.titlesPerGuild'),
        items: sorted.map(([id, count]) => ({ label: this.guildLabel(id), value: count, valueLabel: this.t('stats.gauntletChampions.titles', { count }), link: `/guilds/${id}` }))
      },
      { type: 'table', wide: true, title: this.t('stats.gauntletChampions.tableTitle'), subtitle: this.t('stats.gauntletChampions.tableSubtitle'), columns: [{ label: this.t('common.season') }, { label: this.t('stats.gauntletChampions.champion') }, { label: this.t('common.level') }, { label: this.t('stats.common.margin') }], rows }
    ];
  }

  private buildLevelRace(filters: STAT_FILTERS): STAT_BLOCK[] {
    const points = this.databaseService.data.gauntlets
      .map(season => {
        const entry = season.gauntletLeaderboard.find(item => item.rank === filters.pos);
        return entry ? { label: this.t('common.seasonShort', { season: season.gauntletInfo.season }), value: entry.level, tooltip: `${entry.guildName} [${entry.guildTag}]` } : null;
      })
      .filter((point): point is NonNullable<typeof point> => point !== null);

    const highest = [...points].sort((a, b) => b.value - a.value)[0];
    const lowest = [...points].sort((a, b) => a.value - b.value)[0];
    const growth = points.length > 1 ? points[points.length - 1].value - points[0].value : 0;

    return [
      {
        type: 'kpis', items: [
          { label: this.t('stats.levelRace.highest'), value: highest ? this.t('stats.levelRace.levelValue', { level: highest.value }) : '–', sub: highest ? `${highest.label} · ${highest.tooltip}` : undefined },
          { label: this.t('stats.levelRace.lowest'), value: lowest ? this.t('stats.levelRace.levelValue', { level: lowest.value }) : '–', sub: lowest ? `${lowest.label} · ${lowest.tooltip}` : undefined },
          { label: this.t('stats.levelRace.firstToLast'), value: this.t('stats.levelRace.growth', { count: growth, value: `${growth >= 0 ? '+' : ''}${growth}` }), sub: points.length ? `${points[0].label} → ${points[points.length - 1].label}` : undefined }
        ]
      },
      { type: 'trend', wide: true, title: this.t('stats.levelRace.trendTitle', { pos: filters.pos }), subtitle: this.t('stats.levelRace.trendSubtitle'), points, zeroBased: false, unit: this.t('stats.levelRace.unit') }
    ];
  }

  private buildGuildVeterans(): STAT_BLOCK[] {
    const seasons = this.databaseService.data.gauntlets;
    const guilds = this.databaseService.data.guilds.filter(g => g.guildGauntletStats.length > 0 && this.isCountedGuild(g.id));
    const veterans = [...guilds].sort((a, b) => b.guildGauntletStats.length - a.guildGauntletStats.length || b.rating - a.rating);

    const firstSeason = new Map<number, number>();
    guilds.forEach(guild => this.increment(firstSeason, Math.min(...guild.guildGauntletStats.map(s => s.season))));
    const points = seasons.map(season => ({ label: this.t('common.seasonShort', { season: season.gauntletInfo.season }), value: firstSeason.get(season.gauntletInfo.season) || 0, tooltip: this.t('stats.guildVeterans.trendTooltip') }));
    const everySeason = guilds.filter(g => g.guildGauntletStats.length === seasons.length).length;

    return [
      {
        type: 'kpis', items: [
          { label: this.t('stats.guildVeterans.everRanked'), value: this.formatNumber(guilds.length), sub: this.t('stats.guildVeterans.everRankedSub', { count: seasons.length }) },
          { label: this.t('stats.guildVeterans.everySeason'), value: String(everySeason), sub: this.t('stats.guildVeterans.ultimate') },
          { label: this.t('stats.guildVeterans.oneSeason'), value: this.percent(guilds.filter(g => g.guildGauntletStats.length === 1).length, guilds.length), sub: this.t('stats.guildVeterans.cameSawLeft') }
        ]
      },
      {
        type: 'bars', ranked: true, title: this.t('stats.guildVeterans.mostSeasons'),
        items: veterans.slice(0, 15).map(guild => ({ label: `${guild.name} [${guild.tag}]`, sub: this.t('stats.guildVeterans.bestRank', { rank: Math.min(...guild.guildGauntletStats.map(s => s.rank)) }), value: guild.guildGauntletStats.length, valueLabel: this.t('stats.guildVeterans.seasons', { count: guild.guildGauntletStats.length }), link: `/guilds/${guild.id}` }))
      },
      { type: 'trend', title: this.t('stats.guildVeterans.trendTitle'), subtitle: this.t('stats.guildVeterans.trendSubtitle'), points, zeroBased: true, unit: this.t('stats.guildVeterans.unit') }
    ];
  }
}
