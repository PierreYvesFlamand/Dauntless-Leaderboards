# Translations

Thank you for helping translate **Dauntless Leaderboards**! No coding needed.

Each language has its own file:

| Language | File |
|---|---|
| <img src="https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/us.svg" width="20" alt=""> English (original texts) | [en.json](en.json) |
| <img src="https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/fr.svg" width="20" alt=""> Français | [fr.json](fr.json) |
| <img src="https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/de.svg" width="20" alt=""> Deutsch | [de.json](de.json) |
| <img src="https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/jp.svg" width="20" alt=""> 日本語 | [ja.json](ja.json) |
| <img src="https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/es.svg" width="20" alt=""> Español | [es.json](es.json) |
| <img src="https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/it.svg" width="20" alt=""> Italiano | [it.json](it.json) |
| <img src="https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/br.svg" width="20" alt=""> Português (Brasil) | [pt-BR.json](pt-BR.json) |
| <img src="https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/ru.svg" width="20" alt=""> Русский | [ru.json](ru.json) |

## How a text looks

```json
"nav.dashboard": { "en": "Dashboard", "text": "Tableau de bord", "ai": true },
```

- `"en"`: the English original, for reference. Don't change it.
- `"text"`: the translation shown on the website. **This is what you edit.**
- `"ai"`: `true` means the text was translated by AI and nobody checked it yet. When you check or fix a text, set it to `false`: it then counts as translated by a human. The website shows, for each language, how much is translated by AI and how much by humans.

An empty `"text"` (`""`) means "not translated yet": the website shows the English text instead.

## Rules

- Keep the words between braces, like `{count}`, `{name}` or `{icon}`, exactly as they are. They are replaced by numbers, names or icons. You can move them in the sentence.
- Keys ending with `_one` and `_other` are the singular and plural forms (`1 title` / `5 titles`). If your language needs more forms, add them next to the others with the same key and `_zero`, `_two`, `_few` or `_many` (for example Russian uses `_few` and `_many`).
- Don't translate behemoth, guild or player names.
- Keep buttons, column titles and tabs short.
- Keep the quotes `"` and commas `,` of the file: only change what's between the quotes after `"text":`.

## Sending your changes

- **On GitHub**: open the file, click the ✏️ pencil (Edit), make your changes, then "Propose changes" to open a pull request.
- **Or on Discord**: download the file, edit it with any text editor and send it on the [Dauntless Leaderboards Discord](https://discord.gg/JGTVcqMDfm).

## For developers

`en.json` holds the source texts. After adding, changing or removing a key in it, run `npm run i18n:sync` in the `website` folder: it adds the new keys to every language (empty, so English is shown), removes the old ones, and prints the progress of each language.
