import { Injectable } from '@angular/core';
import { DatabaseService, TRIAL_LEADERBOARD_PLAYER, WEBSITE_TRIAL } from './database.service';
import { SharedService } from './shared.service';

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

export const STAT_FILTER_OPTIONS: Record<STAT_FILTER_KEY, { label: string, options: { value: string | number, label: string }[] }> = {
  era: { label: 'Era', options: [{ value: 'all', label: 'All' }, { value: 'pre', label: 'Pre-Awakening' }, { value: 'post', label: 'Post-Awakening' }] },
  board: { label: 'Leaderboard', options: [{ value: 'solo', label: 'Solo' }, { value: 'group', label: 'Group' }] },
  top: { label: 'Counting', options: [{ value: 1, label: 'Top 1' }, { value: 10, label: 'Top 10' }, { value: 100, label: 'Top 100' }] },
  pos: { label: 'Position', options: [1, 5, 10, 25, 50, 100].map(value => ({ value, label: `#${value}` })) }
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

export type STAT_DEFINITION = {
  slug: string
  category: string
  title: string
  description: string
  icon: string
  filters: STAT_FILTER_KEY[]
  defaults?: Partial<STAT_FILTERS>
}

const AWAKENING_WEEK = 282;

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  public readonly definitions: STAT_DEFINITION[] = [
    // Trials meta
    { slug: 'weapons', category: 'Trials meta', title: 'Weapon popularity', description: 'Which weapons the best hunters bring to the Trials.', icon: 'fa-solid fa-hammer', filters: ['era', 'board', 'top'] },
    { slug: 'weapon-trend', category: 'Trials meta', title: 'Weapon meta over time', description: 'Share of each weapon, year by year. Watch the meta shift.', icon: 'fa-solid fa-timeline', filters: ['era', 'board', 'top'] },
    { slug: 'omnicells', category: 'Trials meta', title: 'Omnicell popularity', description: 'Omnicell picks overall and per year.', icon: 'fa-solid fa-gem', filters: ['era', 'board', 'top'] },
    { slug: 'loadouts', category: 'Trials meta', title: 'Favorite loadouts', description: 'Most played weapon + omnicell combinations.', icon: 'fa-solid fa-toolbox', filters: ['era', 'board', 'top'] },
    { slug: 'group-comps', category: 'Trials meta', title: 'Group compositions', description: 'How groups build their team, and who goes full mono-weapon.', icon: 'fa-solid fa-people-group', filters: ['era', 'top'] },
    // Records
    { slug: 'records', category: 'Records', title: 'Behemoth records', description: 'Fastest solo and group time ever for every behemoth.', icon: 'fa-solid fa-stopwatch', filters: ['era'], defaults: { era: 'pre' } },
    { slug: 'photo-finishes', category: 'Records', title: 'Photo finishes', description: 'The closest races for #1, and the most one-sided wins.', icon: 'fa-solid fa-flag-checkered', filters: ['era', 'board'] },
    { slug: 'behemoths', category: 'Records', title: 'Behemoth rotation', description: 'How often each behemoth was the weekly Trial.', icon: 'fa-solid fa-dragon', filters: ['era'] },
    // Players
    { slug: 'hall-of-fame', category: 'Players', title: 'Hall of fame', description: 'Players with the most wins or top finishes.', icon: 'fa-solid fa-crown', filters: ['era', 'board', 'top'], defaults: { top: 1 } },
    { slug: 'platforms', category: 'Players', title: 'Platforms', description: 'PC, PlayStation, Xbox or Switch: who fills the leaderboards.', icon: 'fa-solid fa-gamepad', filters: ['era', 'board', 'top'], defaults: { top: 100 } },
    { slug: 'loyalty', category: 'Players', title: 'One-tricks & all-rounders', description: 'Players who never switched weapon, and those who mastered them all.', icon: 'fa-solid fa-shuffle', filters: ['era', 'board'] },
    { slug: 'newcomers', category: 'Players', title: 'New blood', description: 'Players reaching the leaderboards for the first time, per quarter.', icon: 'fa-solid fa-seedling', filters: ['board', 'top'], defaults: { top: 100 } },
    // Gauntlet
    { slug: 'gauntlet-champions', category: 'Gauntlet', title: 'Gauntlet champions', description: 'Every season winner and how close it was.', icon: 'fa-solid fa-trophy', filters: [] },
    { slug: 'level-race', category: 'Gauntlet', title: 'Level race', description: 'Level reached by a given position, season after season.', icon: 'fa-solid fa-stairs', filters: ['pos'] },
    { slug: 'guild-veterans', category: 'Gauntlet', title: 'Guild veterans', description: 'Guilds that kept coming back, and new guilds per season.', icon: 'fa-solid fa-shield-halved', filters: [] }
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
    'hall-of-fame': f => this.buildHallOfFame(f),
    'platforms': f => this.buildPlatforms(f),
    'loyalty': f => this.buildLoyalty(f),
    'newcomers': f => this.buildNewcomers(f),
    'gauntlet-champions': () => this.buildGauntletChampions(),
    'level-race': f => this.buildLevelRace(f),
    'guild-veterans': () => this.buildGuildVeterans()
  };

  // Data never changes once loaded: cache per stat + filters
  private cache = new Map<string, STAT_BLOCK[]>();

  constructor(
    private databaseService: DatabaseService,
    private sharedService: SharedService
  ) { }

  public getDefinition(slug: string | null): STAT_DEFINITION | undefined {
    return this.definitions.find(definition => definition.slug === slug);
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
    const key = `${slug}|${JSON.stringify(filters)}|${this.sharedService.trialDecimals}`;
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

  // Every player slot of the counted runs
  private forEachPlayer(filters: STAT_FILTERS, callback: (player: TRIAL_LEADERBOARD_PLAYER, trial: WEBSITE_TRIAL) => void) {
    for (const trial of this.trialsFor(filters.era)) {
      for (const run of this.runs(trial, filters)) {
        for (const player of run.players) callback(player, trial);
      }
    }
  }

  private increment<K>(map: Map<K, number>, key: K, amount: number = 1) {
    map.set(key, (map.get(key) || 0) + amount);
  }

  private sortedEntries<K>(map: Map<K, number>): [K, number][] {
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }

  private percent(value: number, total: number): string {
    return total ? `${(value / total * 100).toFixed(1)}%` : '–';
  }

  private formatNumber(value: number): string {
    return value.toLocaleString('en-US');
  }

  private time(ms: number): string {
    return this.sharedService.convertTrialTime(ms, true) || '0.000 sec';
  }

  private icon(folder: 'weapons' | 'omnicells' | 'platforms' | 'behemoths', id: number | string): STAT_ICON {
    return { src: this.sharedService.getImgPath(`${id}.png`, folder), cls: folder === 'platforms' ? 'platform-icon' : undefined };
  }

  private weaponName(id: number): string {
    return this.sharedService.weaponNames[id] || `Weapon ${id}`;
  }

  private omnicellName(id: number): string {
    return this.sharedService.omnicellNames[id] || `Omnicell ${id}`;
  }

  private playerName(id: number): string {
    const names = this.databaseService.data.players[id - 1]?.playerNames || [];
    return [...names].sort((a, b) => a.platformId - b.platformId)[0]?.name || `Player ${id}`;
  }

  private guildLabel(id: number): string {
    const guild = this.databaseService.data.guilds[id - 1];
    return guild ? `${guild.name} [${guild.tag}]` : 'Unknown guild';
  }

  private year(trial: WEBSITE_TRIAL): number {
    return new Date(trial.startAt).getUTCFullYear();
  }

  private scope(filters: STAT_FILTERS, withBoard: boolean = true): string {
    const era = { all: 'All eras', pre: 'Pre-Awakening', post: 'Post-Awakening' }[filters.era];
    const runs = filters.top === 1 ? 'Winning' : `Top ${filters.top}`;
    return withBoard ? `${runs} ${filters.board} runs · ${era}` : era;
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

  private shareBars(map: Map<number, number>, getItem: (key: number) => { label: string, icons?: STAT_ICON[] }, unit: string): STAT_BAR_ITEM[] {
    const total = [...map.values()].reduce((sum, count) => sum + count, 0);
    return this.sortedEntries(map).map(([key, count]) => ({
      ...getItem(key),
      value: count,
      valueLabel: this.percent(count, total),
      sub: `${this.formatNumber(count)} ${unit}`
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
      { type: 'bars', title: 'Primary weapon', subtitle: this.scope(filters), items: this.shareBars(primary, weaponItem, 'picks') }
    ];
    if (secondary.size) {
      blocks.push({ type: 'bars', title: 'Secondary weapon', subtitle: 'Post-Awakening runs only (two weapons per hunter)', items: this.shareBars(secondary, weaponItem, 'picks') });
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
    const points = (delta: number) => `${delta > 0 ? '+' : ''}${(delta * 100).toFixed(1)} pts`;
    const period = `${heatmap.columns[first]} → ${heatmap.columns[last]}`;

    return [
      {
        type: 'kpis', items: [
          { label: 'Biggest rise', value: deltas[0]?.label || '–', sub: deltas[0] ? `${points(deltas[0].delta)} · ${period}` : undefined },
          { label: 'Biggest fall', value: deltas[deltas.length - 1]?.label || '–', sub: deltas.length ? `${points(deltas[deltas.length - 1].delta)} · ${period}` : undefined },
          { label: 'Years covered', value: String(heatmap.columns.length), sub: period }
        ]
      },
      { type: 'heatmap', wide: true, title: 'Share of picks per year', subtitle: `${this.scope(filters)} · each column sums to 100%`, ...heatmap }
    ];
  }

  private buildOmnicells(filters: STAT_FILTERS): STAT_BLOCK[] {
    const counts = new Map<number, number>();
    this.forEachPlayer(filters, player => {
      if (player.roleId) this.increment(counts, player.roleId);
    });
    const heatmap = this.heatmapByYear(this.trialsFor(filters.era), filters, player => player.roleId ? [player.roleId] : [], id => ({ label: this.omnicellName(id), icon: this.icon('omnicells', id) }));

    return [
      { type: 'bars', title: 'Omnicell picks', subtitle: this.scope(filters), items: this.shareBars(counts, id => ({ label: this.omnicellName(id), icons: [this.icon('omnicells', id)] }), 'picks') },
      { type: 'heatmap', title: 'Per year', subtitle: 'Each column sums to 100%', ...heatmap }
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
        sub: `${this.formatNumber(count)} picks`
      };
    });

    return [
      {
        type: 'kpis', items: [
          { label: 'Distinct loadouts', value: this.formatNumber(counts.size), sub: this.scope(filters) },
          { label: 'Most played', value: items[0]?.label || '–', sub: items[0] ? `${items[0].valueLabel} of picks` : undefined },
          { label: 'Top 15 coverage', value: this.percent(items.reduce((sum, item) => sum + item.value, 0), total), sub: 'of all picks' }
        ]
      },
      { type: 'bars', wide: true, ranked: true, title: 'Top 15 loadouts', subtitle: 'Weapon (+ secondary after the Awakening) and omnicell', items }
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
        sub: `${this.formatNumber(count)} groups`
      };
    });

    return [
      {
        type: 'kpis', items: [
          { label: 'Groups counted', value: this.formatNumber(total), sub: this.scope(groupFilters) },
          { label: 'Distinct compositions', value: this.formatNumber(counts.size), sub: 'Weapon order ignored' },
          { label: 'Mono-weapon groups', value: this.percent(mono, total), sub: `${this.formatNumber(mono)} groups, all the same weapon` },
          { label: 'Full groups of 4', value: this.percent(full, total), sub: 'The rest went in 2 or 3' }
        ]
      },
      { type: 'bars', wide: true, ranked: true, title: 'Most common compositions', items }
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
      const solo = trial.all[0];
      const group = trial.group[0];
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
          { text: entry.solo ? this.time(entry.solo.time) : '–', sub: entry.solo ? `W${entry.solo.week}` : undefined },
          { text: entry.solo ? this.playerName(entry.solo.playerIds[0]) : '–', isPlayerName: !!entry.solo },
          { text: entry.group ? this.time(entry.group.time) : '–', sub: entry.group ? `W${entry.group.week}` : undefined },
          { text: String(entry.weeks), muted: true }
        ]
      }));

    const all = [...behemoths.entries()];
    const fastestSolo = all.filter(([, e]) => e.solo).sort((a, b) => a[1].solo!.time - b[1].solo!.time)[0];
    const fastestGroup = all.filter(([, e]) => e.group).sort((a, b) => a[1].group!.time - b[1].group!.time)[0];

    return [
      {
        type: 'kpis', items: [
          { label: 'Fastest solo record', value: fastestSolo ? this.time(fastestSolo[1].solo!.time) : '–', sub: fastestSolo ? `${fastestSolo[0]} · week ${fastestSolo[1].solo!.week}` : undefined, link: fastestSolo ? `/trials/${fastestSolo[1].solo!.week}` : undefined },
          { label: 'Fastest group record', value: fastestGroup ? this.time(fastestGroup[1].group!.time) : '–', sub: fastestGroup ? `${fastestGroup[0]} · week ${fastestGroup[1].group!.week}` : undefined, link: fastestGroup ? `/trials/${fastestGroup[1].group!.week}` : undefined },
          { label: 'Behemoths', value: String(behemoths.size), sub: this.scope(filters, false) }
        ]
      },
      {
        type: 'table', wide: true, title: 'Records per behemoth',
        subtitle: 'Post-Awakening times include objective bonuses (they can go below zero): compare within one era',
        columns: [{ label: 'Behemoth' }, { label: 'Solo record', sortKey: 'solo' }, { label: 'Solo holder' }, { label: 'Group record', sortKey: 'group' }, { label: 'Trials', align: 'right' }],
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
      .filter((race): race is NonNullable<typeof race> => race !== null)
      .sort((a, b) => a.margin - b.margin);

    const toRow = (race: typeof races[number]) => ({
      link: `/trials/${race.trial.week}`,
      cells: [
        { text: `W${race.trial.week}`, icons: [this.icon('behemoths', race.trial.behemothName)], muted: true },
        { text: race.winner.players.map(p => p.playerName || this.playerName(p.playerId)).join(', '), isPlayerName: true },
        { text: race.margin === 0 ? 'Exact tie' : this.time(race.margin), strong: true }
      ]
    });
    const columns: STAT_TABLE_COLUMN[] = [{ label: 'Week' }, { label: filters.board === 'solo' ? 'Winner' : 'Winners' }, { label: 'Margin' }];
    const average = races.reduce((sum, race) => sum + race.margin, 0) / (races.length || 1);
    const closest = races[0];
    const biggest = races[races.length - 1];

    return [
      {
        type: 'kpis', items: [
          { label: 'Closest race', value: closest ? (closest.margin === 0 ? 'Exact tie' : this.time(closest.margin)) : '–', sub: closest ? `Week ${closest.trial.week} · ${closest.trial.behemothName}` : undefined, link: closest ? `/trials/${closest.trial.week}` : undefined },
          { label: 'Average margin', value: this.time(Math.round(average)), sub: `Between #1 and #2 · ${this.scope(filters, false)}` },
          { label: 'Biggest margin', value: biggest ? this.time(biggest.margin) : '–', sub: biggest ? `Week ${biggest.trial.week} · ${biggest.trial.behemothName}` : undefined, link: biggest ? `/trials/${biggest.trial.week}` : undefined }
        ]
      },
      { type: 'table', title: 'Photo finishes', subtitle: 'Smallest gap between #1 and #2', columns, rows: races.slice(0, 10).map(toRow) },
      { type: 'table', title: 'Total domination', subtitle: 'Biggest gap between #1 and #2', columns, rows: races.slice(-10).reverse().map(toRow) }
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
          { label: 'Different behemoths', value: String(counts.size), sub: `Over ${trials.length} weekly Trials` },
          { label: 'Most featured', value: sorted[0]?.[0] || '–', sub: sorted[0] ? `${sorted[0][1]} weeks` : undefined },
          { label: 'Featured only once', value: String(once), sub: once ? sorted.filter(([, count]) => count === 1).map(([name]) => name).slice(0, 3).join(', ') + (once > 3 ? '…' : '') : 'None' }
        ]
      },
      {
        type: 'bars', wide: true, ranked: true, title: 'Weeks as the Trial', subtitle: this.scope(filters, false),
        items: sorted.map(([name, count]) => ({ label: name, icons: [this.icon('behemoths', name)], value: count, valueLabel: `${count} wk` }))
      }
    ];
  }

  // -------------------------------------------------------------------------
  // Players
  // -------------------------------------------------------------------------
  private buildHallOfFame(filters: STAT_FILTERS): STAT_BLOCK[] {
    const counts = new Map<number, number>();
    this.forEachPlayer(filters, player => this.increment(counts, player.playerId));
    const sorted = this.sortedEntries(counts);
    const what = filters.top === 1 ? 'wins' : `top ${filters.top} finishes`;

    return [
      {
        type: 'kpis', items: [
          { label: 'Different players', value: this.formatNumber(counts.size), sub: `With at least one of these ${what}` },
          { label: 'Leader', value: sorted[0] ? this.playerName(sorted[0][0]) : '–', isPlayerName: true, sub: sorted[0] ? `${sorted[0][1]} ${what}` : undefined, link: sorted[0] ? `/players/${sorted[0][0]}` : undefined },
          { label: 'Top 15 share', value: this.percent(sorted.slice(0, 15).reduce((sum, [, n]) => sum + n, 0), sorted.reduce((sum, [, n]) => sum + n, 0)), sub: `Of all ${what}` }
        ]
      },
      {
        type: 'bars', wide: true, ranked: true, title: `Most ${what}`, subtitle: this.scope(filters),
        items: sorted.slice(0, 15).map(([id, count]) => ({ label: this.playerName(id), isPlayerName: true, value: count, valueLabel: this.formatNumber(count), link: `/players/${id}` }))
      }
    ];
  }

  private buildPlatforms(filters: STAT_FILTERS): STAT_BLOCK[] {
    const counts = new Map<number, number>();
    this.forEachPlayer(filters, player => this.increment(counts, player.platformId));
    const platformRow = (id: number) => ({ label: this.sharedService.platformNames[id] || `Platform ${id}`, icon: this.icon('platforms', id) });
    const heatmap = this.heatmapByYear(this.trialsFor(filters.era), filters, player => [player.platformId], platformRow);

    return [
      { type: 'bars', title: 'Share of runs', subtitle: this.scope(filters), items: this.shareBars(counts, id => ({ label: platformRow(id).label, icons: [platformRow(id).icon] }), 'player slots') },
      { type: 'heatmap', title: 'Per year', subtitle: 'Each column sums to 100%', ...heatmap }
    ];
  }

  private buildLoyalty(filters: STAT_FILTERS): STAT_BLOCK[] {
    const MIN_RUNS = 10;
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
          { label: 'Players with 10+ runs', value: this.formatNumber(loyal.length), sub: this.scope({ ...filters, top: 100 }) },
          { label: 'True one-tricks', value: this.percent(loyal.filter(p => p.weapons.length === 1).length, loyal.length), sub: 'Never touched another weapon' },
          { label: 'Average weapons used', value: (loyal.reduce((sum, p) => sum + p.weapons.length, 0) / (loyal.length || 1)).toFixed(1), sub: 'Per player with 10+ runs' }
        ]
      },
      {
        type: 'bars', ranked: true, title: 'One-tricks', subtitle: `Only ever played one weapon (${MIN_RUNS}+ runs)`,
        items: oneTricks.map(p => ({ label: this.playerName(p.id), isPlayerName: true, icons: [this.icon('weapons', p.weapons[0][0])], value: p.runs, valueLabel: `${p.runs} runs`, link: `/players/${p.id}` }))
      },
      {
        type: 'bars', ranked: true, title: 'All-rounders', subtitle: `Most different weapons (${MIN_RUNS}+ runs)`,
        items: allRounders.map(p => ({ label: this.playerName(p.id), isPlayerName: true, sub: `${p.runs} runs`, value: p.weapons.length, valueLabel: `${p.weapons.length} weapons`, link: `/players/${p.id}` }))
      }
    ];
  }

  private buildNewcomers(filters: STAT_FILTERS): STAT_BLOCK[] {
    const seen = new Set<number>();
    const perQuarter = new Map<string, number>();
    const trials = [...this.trialsFor('all')].reverse(); // oldest first

    for (const trial of trials) {
      const date = new Date(trial.startAt);
      const quarter = `${date.getUTCFullYear()} Q${Math.floor(date.getUTCMonth() / 3) + 1}`;
      if (!perQuarter.has(quarter)) perQuarter.set(quarter, 0);
      for (const run of this.runs(trial, filters)) {
        for (const player of run.players) {
          if (seen.has(player.playerId)) continue;
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
          { label: 'Players ever counted', value: this.formatNumber(seen.size), sub: this.scope(filters).replace(' · All eras', '') },
          { label: 'Best quarter', value: best?.label || '–', sub: best ? `${this.formatNumber(best.value)} newcomers (launch quarter excluded)` : undefined },
          { label: 'Last 4 quarters', value: this.formatNumber(lastFour), sub: 'Newcomers' }
        ]
      },
      { type: 'trend', wide: true, title: 'First appearance per quarter', subtitle: 'The first quarter counts everyone, as everyone is new at launch', points, zeroBased: true, unit: 'new players' }
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
      if (first?.guildId) {
        this.increment(wins, first.guildId);
        reign = reign.guildId === first.guildId ? { guildId: first.guildId, length: reign.length + 1 } : { guildId: first.guildId, length: 1 };
        if (reign.length > longestReign.length) longestReign = { ...reign };
      }
      const margin = !first || !second ? '–'
        : first.level !== second.level ? `+${first.level - second.level} levels`
          : `+${first.remainingSec - second.remainingSec}s left`;
      return {
        link: `/seasons/${season.gauntletInfo.season}`,
        cells: [
          { text: `S${season.gauntletInfo.season}`, muted: true },
          { text: first ? `${first.guildName} [${first.guildTag}]` : '–', strong: true },
          { text: first ? String(first.level) : '–' },
          { text: margin, muted: true }
        ]
      };
    }).reverse();

    const sorted = this.sortedEntries(wins);
    return [
      {
        type: 'kpis', items: [
          { label: 'Different champions', value: String(wins.size), sub: `Over ${seasons.length} seasons` },
          { label: 'Most titles', value: sorted[0] ? this.guildLabel(sorted[0][0]) : '–', sub: sorted[0] ? `${sorted[0][1]} seasons won` : undefined, link: sorted[0] ? `/guilds/${sorted[0][0]}` : undefined },
          { label: 'Longest reign', value: longestReign.guildId ? this.guildLabel(longestReign.guildId) : '–', sub: `${longestReign.length} titles in a row`, link: longestReign.guildId ? `/guilds/${longestReign.guildId}` : undefined }
        ]
      },
      {
        type: 'bars', wide: true, ranked: true, title: 'Titles per guild',
        items: sorted.map(([id, count]) => ({ label: this.guildLabel(id), value: count, valueLabel: `${count} title${count > 1 ? 's' : ''}`, link: `/guilds/${id}` }))
      },
      { type: 'table', wide: true, title: 'Season winners', subtitle: 'Margin: levels ahead of #2, or extra time left at the same level', columns: [{ label: 'Season' }, { label: 'Champion' }, { label: 'Level' }, { label: 'Margin' }], rows }
    ];
  }

  private buildLevelRace(filters: STAT_FILTERS): STAT_BLOCK[] {
    const points = this.databaseService.data.gauntlets
      .map(season => {
        const entry = season.gauntletLeaderboard.find(item => item.rank === filters.pos);
        return entry ? { label: `S${season.gauntletInfo.season}`, value: entry.level, tooltip: `${entry.guildName} [${entry.guildTag}]` } : null;
      })
      .filter((point): point is NonNullable<typeof point> => point !== null);

    const highest = [...points].sort((a, b) => b.value - a.value)[0];
    const lowest = [...points].sort((a, b) => a.value - b.value)[0];
    const growth = points.length > 1 ? points[points.length - 1].value - points[0].value : 0;

    return [
      {
        type: 'kpis', items: [
          { label: 'Highest', value: highest ? `Level ${highest.value}` : '–', sub: highest ? `${highest.label} · ${highest.tooltip}` : undefined },
          { label: 'Lowest', value: lowest ? `Level ${lowest.value}` : '–', sub: lowest ? `${lowest.label} · ${lowest.tooltip}` : undefined },
          { label: 'First → last season', value: `${growth >= 0 ? '+' : ''}${growth} levels`, sub: points.length ? `${points[0].label} → ${points[points.length - 1].label}` : undefined }
        ]
      },
      { type: 'trend', wide: true, title: `Level reached by the #${filters.pos} guild`, subtitle: 'Hover a season to see the guild', points, zeroBased: false, unit: 'level' }
    ];
  }

  private buildGuildVeterans(): STAT_BLOCK[] {
    const seasons = this.databaseService.data.gauntlets;
    const guilds = this.databaseService.data.guilds.filter(g => g.guildGauntletStats.length > 0);
    const veterans = [...guilds].sort((a, b) => b.guildGauntletStats.length - a.guildGauntletStats.length || b.rating - a.rating);

    const firstSeason = new Map<number, number>();
    guilds.forEach(guild => this.increment(firstSeason, Math.min(...guild.guildGauntletStats.map(s => s.season))));
    const points = seasons.map(season => ({ label: `S${season.gauntletInfo.season}`, value: firstSeason.get(season.gauntletInfo.season) || 0, tooltip: 'guilds ranked for the first time' }));
    const everySeason = guilds.filter(g => g.guildGauntletStats.length === seasons.length).length;

    return [
      {
        type: 'kpis', items: [
          { label: 'Guilds ever ranked', value: this.formatNumber(guilds.length), sub: `In the top 100 of ${seasons.length} seasons` },
          { label: 'Ranked every season', value: String(everySeason), sub: 'The ultimate veterans' },
          { label: 'One season only', value: this.percent(guilds.filter(g => g.guildGauntletStats.length === 1).length, guilds.length), sub: 'Came, saw, left' }
        ]
      },
      {
        type: 'bars', ranked: true, title: 'Most seasons ranked',
        items: veterans.slice(0, 15).map(guild => ({ label: `${guild.name} [${guild.tag}]`, sub: `Best #${Math.min(...guild.guildGauntletStats.map(s => s.rank))}`, value: guild.guildGauntletStats.length, valueLabel: `${guild.guildGauntletStats.length} seasons`, link: `/guilds/${guild.id}` }))
      },
      { type: 'trend', title: 'New guilds per season', subtitle: 'First time in the top 100 (season 1 counts everyone)', points, zeroBased: true, unit: 'guilds' }
    ];
  }
}
