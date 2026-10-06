// Keeps public/i18n/<lang>.json in sync with public/i18n/en.json (the source texts)
// - adds missing keys (empty text = not translated, English is shown)
// - removes keys that no longer exist (extra plural forms like key_few are kept)
// - refreshes the "en" reference of every entry
// - prints the translation progress of every language
// Usage (in /website): npm run i18n:sync

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const DIR = new URL('../public/i18n/', import.meta.url);
const LANGUAGES = {
  'fr': 'Français',
  'de': 'Deutsch',
  'ja': '日本語',
  'es': 'Español',
  'it': 'Italiano',
  'pt-BR': 'Português (Brasil)',
  'ru': 'Русский'
};
const PLURAL = /^(.*)_(zero|one|two|few|many|other)$/;

const INSTRUCTIONS = name => [
  `Texts of the Dauntless Leaderboards website in ${name}. Thank you for helping!`,
  'Only change the "text" values. "en" is the English original, for reference only.',
  '"ai": true means the text was translated by AI and not checked by a human yet. After checking or fixing a text, set "ai" to false: it then counts as translated by a human.',
  'An empty "text" means not translated yet: the English text is shown instead.',
  'Keep the words between braces, like {count} or {name}, as they are: they are replaced by numbers or names. You can move them in the sentence.',
  'Keys ending with _one and _other are the singular and plural forms. Add the forms your language needs next to them (_zero, _two, _few, _many), for example "stats.titles_few".',
  'Do not translate behemoth, guild or player names.',
  'To share your changes: edit this file on GitHub and open a pull request, or send it on our Discord.'
];

const readJson = url => JSON.parse(readFileSync(url, 'utf8'));

// One entry per line: easier to read and edit
const write = (url, file) => {
  const entryToString = entry => `{ ${Object.entries(entry).map(([name, value]) => `${JSON.stringify(name)}: ${JSON.stringify(value)}`).join(', ')} }`;
  const lines = Object.entries(file.texts).map(([key, entry]) => `    ${JSON.stringify(key)}: ${entryToString(entry)}`);
  const header = JSON.stringify({ language: file.language, instructions: file.instructions }, null, 2).replace(/\n}$/, '');
  writeFileSync(url, `${header},\n  "texts": {\n${lines.join(',\n')}\n  }\n}\n`);
};

const english = readJson(new URL('en.json', DIR));
const englishKeys = Object.keys(english.texts);
const report = [];

for (const [code, name] of Object.entries(LANGUAGES)) {
  const url = new URL(`${code}.json`, DIR);
  const current = existsSync(url) ? readJson(url).texts || {} : {};
  const texts = {};

  for (const key of englishKeys) {
    const entry = current[key] || {};
    texts[key] = { en: english.texts[key].text, text: entry.text || '', ai: entry.ai ?? false };

    // Extra plural forms of this key (key_few, key_many...)
    const base = key.match(PLURAL)?.[1];
    if (base && key.endsWith('_other')) {
      for (const [extraKey, extra] of Object.entries(current)) {
        if (extraKey.startsWith(`${base}_`) && PLURAL.test(extraKey) && !english.texts[extraKey]) {
          texts[extraKey] = { en: english.texts[key].text, text: extra.text || '', ai: extra.ai ?? false };
        }
      }
    }
  }

  write(url, { language: name, instructions: INSTRUCTIONS(name), texts });

  const entries = englishKeys.map(key => texts[key]);
  const human = entries.filter(e => e.text && e.ai === false).length;
  const ai = entries.filter(e => e.text && e.ai !== false).length;
  report.push({ language: code, human: `${(human / entries.length * 100).toFixed(1)}%`, ai: `${(ai / entries.length * 100).toFixed(1)}%`, missing: entries.length - human - ai });
}

console.log(`${englishKeys.length} texts in en.json`);
console.table(report);
