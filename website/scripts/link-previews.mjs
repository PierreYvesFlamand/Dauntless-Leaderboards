// Writes one HTML page per player, guild, trial and season in the build output, so links shared
// on Discord, X, Slack... show a preview card with that page's data
// - link preview bots don't run JavaScript: they only read the <meta> tags of the HTML they get
// - every page is a copy of index.html with its own og:/twitter: tags, the Angular app boots as usual
// - players/2.html is served by GitHub Pages for /players/2 (status 200 instead of the 404.html fallback)
// Usage (in /website): runs after "ng build" in "npm run build"

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SITE_URL = 'https://dauntless-leaderboards.com';
const SITE_NAME = 'Dauntless Leaderboards';
const DIST = new URL('../dist/website/browser/', import.meta.url);

// Same rules as the website (DatabaseService, SharedService, GuildDetailComponent, PlayerDetailComponent)
const DISABLED_WEEKS = [282, 283];
const REFORGED_WEEK = 73;
const AWAKENING_WEEK = 282;
const SCORE_HALF_LIFE = 3;
// trial board key -> trialLeaderboardItemTypeId
const BOARDS = { all: 1, group: 2, sword: 3, axe: 4, hammer: 5, chainblades: 6, pike: 7, repeaters: 8, strikers: 9 };
const WEAPONS = { 1: 'Hammer', 2: 'Axe', 3: 'Sword', 4: 'Chain Blades', 5: 'War Pike', 6: 'Repeaters', 7: 'Aether Strikers' };
const OMNICELLS = { 1: 'Bastion', 2: 'Revenant', 3: 'Discipline', 4: 'Artificer', 5: 'Iceborne', 6: 'Tempest' };
const PLATFORMS = { 1: 'PC', 2: 'PlayStation', 3: 'Xbox', 4: 'Switch' };

// The critical CSS Angular inlines in index.html (~5 kB) is replaced by a plain stylesheet link:
// it would be copied in every page (26k+ pages)
const template = readFileSync(new URL('index.html', DIST), 'utf8')
    .replace(/<style>[\s\S]*?<\/style><link rel="stylesheet" href="([^"]+)" media="print" onload="this\.media='all'"><noscript>[\s\S]*?<\/noscript>/, '<link rel="stylesheet" href="$1">');
const data = JSON.parse(readFileSync(new URL('data/allData.json', DIST), 'utf8'));

// ---------- Helpers ----------

const escapeHtml = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const formatDate = date => new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' });
const formatPercent = share => `${Math.round(share * 100)}%`;
const formatNumber = (value, decimals) => value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

// Best rank, then the top counts that aren't 0: "best rank #1 · 3 wins · 10 top 5"
const formatRanks = (ranks, tops) => [
    `best rank #${Math.min(...ranks)}`,
    ...tops.map(([top, label]) => [ranks.filter(rank => rank <= top).length, label])
        .filter(([count]) => count)
        .map(([count, label]) => label === 'win' ? plural(count, 'win') : `${count} ${label}`)
].join(' · ');

// Same text as SharedService.convertTrialTime(time, true) in English
const formatTrialTime = time => {
    const m = Math.floor(time / 60000);
    const s = `${Math.floor((time - m * 60000) / 1000)}.${String(time % 1000).padStart(3, '0')}`;
    return m ? `${m} min ${s} sec` : `${s} sec`;
};

const getEraName = week => week >= AWAKENING_WEEK ? 'Awakening' : week >= REFORGED_WEEK ? 'Reforged' : 'Pre-Reforged';

const getPlayerName = (playerId, platformId) => {
    const names = data.players[playerId - 1].names;
    return (names.find(n => n.platformId === platformId) || names[0])?.name || '';
};

// Most used id of a list, with its share
const getMain = ids => {
    const counts = new Map();
    for (const id of ids) if (id) counts.set(id, (counts.get(id) || 0) + 1);
    const [id, count] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0] || [];
    return id ? { id, share: count / ids.length } : null;
};

// Replaces the content of a <meta> tag of index.html, or adds the tag
const setMeta = (html, attribute, key, value) => {
    const tag = `<meta ${attribute}="${key}" content="${escapeHtml(value)}">`;
    const existing = new RegExp(`<meta ${attribute}="${key}" content="[^"]*"\\s*/?>`);
    return existing.test(html) ? html.replace(existing, () => tag) : html.replace('</head>', () => `  ${tag}\n</head>`);
};

let pageCount = 0;
const writeFile = (path, html) => {
    const file = new URL(path, DIST);
    mkdirSync(new URL('.', file), { recursive: true });
    writeFileSync(file, html);
    pageCount++;
};

const writePage = (path, title, description) => {
    let html = template;
    html = setMeta(html, 'property', 'og:title', title);
    html = setMeta(html, 'name', 'description', description);
    html = setMeta(html, 'property', 'og:description', description);
    html = setMeta(html, 'property', 'og:url', `${SITE_URL}/${path}`);
    html = setMeta(html, 'property', 'og:site_name', SITE_NAME);
    html = setMeta(html, 'property', 'og:type', 'website');
    html = setMeta(html, 'name', 'twitter:card', 'summary');
    writeFile(`${path}.html`, html);
};

// The players/ folder (...) makes GitHub Pages handle /players differently (redirect to /players/ or not,
// depending on its rules): the list page is written both ways so it never falls back to 404.html
for (const list of ['players', 'guilds', 'trials', 'seasons']) {
    writeFile(`${list}.html`, template);
    writeFile(`${list}/index.html`, template);
}

// ---------- Players ----------

const playerRuns = data.players.map(() => []);
for (const trial of data.trials) {
    if (DISABLED_WEEKS.includes(trial.info.week)) continue;
    for (const [board, typeId] of Object.entries(BOARDS)) {
        for (const row of trial[board] || []) {
            for (const player of row.players) {
                playerRuns[player.playerId - 1].push({ typeId, week: trial.info.week, rank: row.rank, players: row.players });
            }
        }
    }
}

for (const player of data.players) {
    const runs = playerRuns[player.id - 1];
    const weeks = [...new Set(runs.map(run => run.week))];
    const soloRanks = runs.filter(run => run.typeId === 1).map(run => run.rank);
    const groupRanks = runs.filter(run => run.typeId === 2).map(run => run.rank);
    // Loadout counted on the overall solo & group boards only (weapon boards repeat solo runs)
    const loadouts = runs.filter(run => run.typeId <= 2).map(run => run.players.find(p => p.playerId === player.id) || run.players[0]);
    const mainWeapon = getMain(loadouts.map(p => p.weaponId));
    const mainOmnicell = getMain(loadouts.map(p => p.roleId));

    const platforms = [...new Set(player.names.map(n => PLATFORMS[n.platformId]).filter(Boolean))];
    const lines = [platforms.length ? `Player on ${platforms.join(' & ')}` : 'Player'];
    if (weeks.length) {
        const [first, last] = [Math.min(...weeks), Math.max(...weeks)];
        lines.push(`${plural(weeks.length, 'trial')} played (${first === last ? `week ${first}` : `weeks ${first} to ${last}`})`);
    }
    if (soloRanks.length) lines.push(`Solo: ${formatRanks(soloRanks, [[1, 'win'], [5, 'top 5']])}`);
    if (groupRanks.length) lines.push(`Group: ${formatRanks(groupRanks, [[1, 'win']])}`);
    const loadout = [
        mainWeapon && `${WEAPONS[mainWeapon.id] || 'Unknown weapon'} (${formatPercent(mainWeapon.share)})`,
        mainOmnicell && `${OMNICELLS[mainOmnicell.id] || 'Unknown omnicell'} (${formatPercent(mainOmnicell.share)})`
    ].filter(Boolean);
    if (loadout.length) lines.push(`Main: ${loadout.join(' · ')}`);

    writePage(`players/${player.id}`, player.names.map(n => n.name).join(' / ') || `Player ${player.id}`, lines.join('\n'));
}

// ---------- Guilds ----------

const seasonCount = data.gauntlets.length;
const getRankPoints = rank => 100 * (1 - Math.log(rank) / Math.log(101));
const getSeasonWeight = season => Math.pow(0.5, (seasonCount - season) / SCORE_HALF_LIFE);
let totalWeight = 0;
for (let season = 1; season <= seasonCount; season++) totalWeight += getSeasonWeight(season);

const guildStats = data.guilds.map(() => []);
data.gauntlets.forEach((gauntlet, index) => {
    for (const item of gauntlet.leaderboard) {
        if (item.guildId) guildStats[item.guildId - 1].push({ season: index + 1, rank: item.rank });
    }
});
const ratings = guildStats.map(stats => stats.reduce((sum, s) => sum + Math.max(0, getRankPoints(s.rank)) * getSeasonWeight(s.season), 0) / totalWeight);

for (const guild of data.guilds) {
    const stats = guildStats[guild.id - 1];
    const ranks = stats.map(s => s.rank);
    const rating = ratings[guild.id - 1];
    const scoreRank = 1 + ratings.filter(r => r > rating).length;

    const lines = [`Guild Score ${formatNumber(rating, 1)} (#${scoreRank} of ${formatNumber(data.guilds.length, 0)} guilds)`];
    if (ranks.length) {
        const bestRank = Math.min(...ranks);
        const seasons = stats.map(s => s.season);
        const [first, last] = [Math.min(...seasons), Math.max(...seasons)];
        lines.push(`Gauntlet: ${formatRanks(ranks, [[1, 'win'], [5, 'top 5']])}`);
        lines.push(`Best rank reached ${plural(ranks.filter(rank => rank === bestRank).length, 'time')} · average rank #${formatNumber(ranks.reduce((sum, rank) => sum + rank, 0) / ranks.length, 1)}`);
        lines.push(`${plural(ranks.length, 'season')} ranked (${first === last ? `season ${first}` : `seasons ${first} to ${last}`})`);
    } else {
        lines.push('No ranked Gauntlet season');
    }

    writePage(`guilds/${guild.id}`, `${guild.name} [${guild.tag}]`, lines.join('\n'));
}

// ---------- Trials ----------

data.trials.forEach((trial, index) => {
    const { week, behemothId, startAt, endAt } = trial.info;
    const lines = [`${formatDate(startAt)} to ${formatDate(endAt)} · ${getEraName(week)} era`];

    if (DISABLED_WEEKS.includes(week)) {
        lines.push("This week's leaderboards have been disabled due to the use of an exploit with the Golden Claws");
    } else {
        const solo = trial.all[0];
        const group = trial.group[0];
        if (solo) {
            const p = solo.players[0];
            lines.push(`Solo record: ${getPlayerName(p.playerId, p.platformId)} in ${formatTrialTime(solo.completionTime)} (${WEAPONS[p.weaponId] || 'Unknown weapon'})`);
        }
        if (group) {
            lines.push(`Group record: ${group.players.map(p => getPlayerName(p.playerId, p.platformId)).join(', ')} in ${formatTrialTime(group.completionTime)}`);
        }
    }

    writePage(`trials/${index + 1}`, `Trial week ${week}: ${data.behemoths[behemothId - 1].name}`, lines.join('\n'));
});

// ---------- Gauntlet seasons ----------

data.gauntlets.forEach((gauntlet, index) => {
    const lines = [`${formatDate(gauntlet.startAt)} to ${formatDate(gauntlet.endAt)}`];
    for (const item of gauntlet.leaderboard.slice(0, 3)) {
        const guild = data.guilds[item.guildId - 1];
        const [name, tag] = guild ? [guild.name, guild.tag] : (item.guildNameTag || '|||').split('|||');
        lines.push(`#${item.rank} ${name} [${tag}] · level ${item.level}`);
    }

    writePage(`seasons/${index + 1}`, `Gauntlet Season ${index + 1}`, lines.join('\n'));
});

console.log(`Link previews: ${pageCount} pages written`);
