// const fs = require('fs');
// const { google } = require('googleapis');

// const ROOT_FOLDER = './data';

// let googleSheetClient = undefined;
// const SHEET_ID = '1M9NR7EWLvq6ffWtSIdKgX-uAFl3EbrSaC4srISB7Ws8';

// (async () => {
//     googleSheetClient = await _getGoogleSheetClient();

//     // const max = fs.readdirSync('./data.old/gauntlet-season11').length;
//     // let cur = 1;
//     // for (const filename of fs.readdirSync('./data.old/gauntlet-season11').slice(0, 1)) {
//     //     console.log(`${cur++}/${max}`);
//     //     if (filename === 'guildList.json') continue;
//     //     const data = JSON.parse(fs.readFileSync(`./data.old/gauntlet-season11/${filename}`));

//     //     // Order guild
//     //     for (const guild of data.leaderboard) {
//     //         const guildsToOrder = data.leaderboard.filter(g => g.level === guild.level);
//     //         if (guildsToOrder.length < 2) continue;
//     //         guildsToOrder.forEach((guildToOrder, index) => {
//     //             guildToOrder.level += (0.001 * (guildsToOrder.length - index));
//     //         });
//     //     }

//     //     // Guild list
//     //     const guildListPath = './data.old/gauntlet-season11/guildList.json';
//     //     if (!fs.existsSync(guildListPath)) {
//     //         fs.writeFileSync(guildListPath, JSON.stringify([], null, 2), 'utf8');
//     //     }

//     //     const guildList = JSON.parse(fs.readFileSync(guildListPath));

//     //     for (const item of data.leaderboard) {
//     //         if (guildList.includes(`${item.guild_name} [${item.guild_nameplate}]`)) continue;
//     //         guildList.push(`${item.guild_name} [${item.guild_nameplate}]`);
//     //     }
//     //     fs.writeFileSync(guildListPath, JSON.stringify(guildList, null, 2), 'utf8');

//     //     // Write data
//     //     const date = new Date(data.last_updated);
//     //     const dateString = `${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${String(date.getUTCDate()).padStart(2, '0')}`;
//     //     const timeString = `${date.getUTCHours()}:${String(date.getUTCMinutes()).padStart(2, '0')}`;

//     //     await _updateGoogleSheet(googleSheetClient, SHEET_ID, 'TEST AREA', 'A:ZZ', [['Timestamp', 'Date', 'Time', 'Full date', ...guildList]]);
//     //     await _writeGoogleSheet(googleSheetClient, SHEET_ID, 'TEST AREA', 'A:ZZ', [[
//     //         date.getTime(),
//     //         dateString,
//     //         timeString,
//     //         `${dateString} ${timeString}`,
//     //         ...guildList.map(g => data.leaderboard.find(l => `${l.guild_name} [${l.guild_nameplate}]` === g)?.level || null)
//     //     ]]);

//     //     // await new Promise(resolve => setTimeout(resolve, 1000 * 4));
//     // }

//     scrap();
//     // setInterval(scrap, 1000 * 30);
//     setInterval(scrap, 1000 * 60 * 10);
// })();

// // DATA
// async function getAllSeasonsData() {
//     try {
//         const res = await fetch(`https://storage.googleapis.com/dauntless-gauntlet-leaderboard/production-gauntlet-all-seasons.json?_=${new Date()}`);
//         const data = await res.json();
//         return data;
//     } catch (error) {
//         console.log(error);
//     }
// }

// async function getSeasonData(gauntlet_id) {
//     try {
//         const res = await fetch(`https://storage.googleapis.com/dauntless-gauntlet-leaderboard/production-${gauntlet_id}.json?_=${new Date()}`);
//         const data = await res.json();
//         return data;
//     } catch (error) {
//         console.log(error);
//     }
// }

// async function scrap() {
//     if (!fs.existsSync(ROOT_FOLDER)) {
//         fs.mkdirSync(ROOT_FOLDER);
//     }

//     const allSeasons = await getAllSeasonsData();
//     if (!allSeasons) return setTimeout(scrap, 1000 * 30);

//     for (const season of allSeasons.past_seasons) {
//         const seasonFolder = `${ROOT_FOLDER}/${season.gauntlet_id}`;
//         if (!fs.existsSync(seasonFolder)) {
//             fs.mkdirSync(seasonFolder);
//         }

//         const endResultPath = `${seasonFolder}/end-result.json`;
//         if (!fs.existsSync(endResultPath)) {
//             const seasonData = await getSeasonData(season.gauntlet_id);
//             if (!seasonData) return setTimeout(scrap, 1000 * 30);

//             seasonData.start_at = season.start_at;
//             fs.writeFileSync(endResultPath, JSON.stringify({
//                 start_at: season.start_at,
//                 end_at: seasonData.end_at,
//                 last_updated: seasonData.last_updated,
//                 leaderboard: seasonData.leaderboard
//             }, null, 2), 'utf8');

//             try {
//                 await _updateGoogleSheet(googleSheetClient, SHEET_ID, `Season ${Number(season.gauntlet_id.slice(15))}`, 'C1', [[new Date(season.start_at).toUTCString()]]);
//                 await _updateGoogleSheet(googleSheetClient, SHEET_ID, `Season ${Number(season.gauntlet_id.slice(15))}`, 'C2', [[new Date(season.end_at).toUTCString()]]);
//                 await _updateGoogleSheet(googleSheetClient, SHEET_ID, `Season ${Number(season.gauntlet_id.slice(15))}`, 'C3', [[new Date(season.end_at).toUTCString()]]);

//                 await _updateGoogleSheet(googleSheetClient, SHEET_ID, `Season ${Number(season.gauntlet_id.slice(15))}`, 'A6:F105', seasonData.leaderboard.map((item, index) => [
//                     index + 1,
//                     item.guild_name,
//                     item.guild_nameplate, item.level,
//                     `${Math.floor(item.remaining_sec / 60)}:${String(item.remaining_sec % 60).padStart(2, '0')}`,
//                     item.remaining_sec
//                 ]));
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//     }

//     const seasonFolder = `${ROOT_FOLDER}/${allSeasons.active_season.gauntlet_id}`;
//     if (!fs.existsSync(seasonFolder)) {
//         fs.mkdirSync(seasonFolder);
//     }

//     const seasonData = await getSeasonData(allSeasons.active_season.gauntlet_id);
//     const date = new Date(seasonData.last_updated);

//     const fileName = [
//         date.getUTCFullYear(),
//         '-',
//         String(date.getUTCMonth() + 1).padStart(2, '0'),
//         '-',
//         String(date.getUTCDate()).padStart(2, '0'),
//         '--',
//         String(date.getUTCHours()).padStart(2, '0'),
//         '-',
//         String(date.getUTCMinutes()).padStart(2, '0')
//     ].join('');

//     const lastUpdatedPath = `${ROOT_FOLDER}/${allSeasons.active_season.gauntlet_id}/${fileName}.json`;
//     if (!fs.existsSync(lastUpdatedPath)) {
//         const formatedSeasonData = {
//             start_at: allSeasons.active_season.start_at,
//             end_at: seasonData.end_at,
//             last_updated: seasonData.last_updated,
//             leaderboard: seasonData.leaderboard
//         };
//         fs.writeFileSync(lastUpdatedPath, JSON.stringify(formatedSeasonData, null, 2), 'utf8');

//         try {
//             await _updateGoogleSheet(googleSheetClient, SHEET_ID, `Season ${Number(allSeasons.active_season.gauntlet_id.slice(15))}`, 'C1', [[new Date(allSeasons.active_season.start_at).toUTCString()]]);
//             await _updateGoogleSheet(googleSheetClient, SHEET_ID, `Season ${Number(allSeasons.active_season.gauntlet_id.slice(15))}`, 'C2', [[new Date(seasonData.end_at).toUTCString()]]);
//             await _updateGoogleSheet(googleSheetClient, SHEET_ID, `Season ${Number(allSeasons.active_season.gauntlet_id.slice(15))}`, 'C3', [[new Date(seasonData.last_updated).toUTCString()]]);

//             await _updateGoogleSheet(googleSheetClient, SHEET_ID, `Season ${Number(allSeasons.active_season.gauntlet_id.slice(15))}`, 'A6:F105', seasonData.leaderboard.map((item, index) => [
//                 index + 1,
//                 item.guild_name,
//                 item.guild_nameplate, item.level,
//                 `${Math.floor(item.remaining_sec / 60)}:${String(item.remaining_sec % 60).padStart(2, '0')}`,
//                 item.remaining_sec
//             ]));

//             // Order guild
//             for (const guild of seasonData.leaderboard) {
//                 const guildsToOrder = seasonData.leaderboard.filter(g => g.level === guild.level);
//                 if (guildsToOrder.length < 2) continue;
//                 guildsToOrder.forEach((guildToOrder, index) => {
//                     guildToOrder.level += (0.001 * (guildsToOrder.length - index));
//                 });
//             }

//             // Guild list
//             const guildListPath = `${ROOT_FOLDER}/${allSeasons.active_season.gauntlet_id}/guildList.json`
//             if (!fs.existsSync(guildListPath)) {
//                 fs.writeFileSync(guildListPath, JSON.stringify([], null, 2), 'utf8');
//             }

//             const guildList = JSON.parse(fs.readFileSync(guildListPath));

//             // Write data
//             for (const item of formatedSeasonData.leaderboard) {
//                 if (guildList.includes(`${item.guild_name} [${item.guild_nameplate}]`)) continue;
//                 guildList.push(`${item.guild_name} [${item.guild_nameplate}]`);
//             }
//             fs.writeFileSync(guildListPath, JSON.stringify(guildList, null, 2), 'utf8');

//             const date = new Date(formatedSeasonData.last_updated);
//             const dateString = `${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${String(date.getUTCDate()).padStart(2, '0')}`;
//             const timeString = `${date.getUTCHours()}:${String(date.getUTCMinutes()).padStart(2, '0')}`;

//             await _updateGoogleSheet(googleSheetClient, SHEET_ID, `Season ${Number(allSeasons.active_season.gauntlet_id.slice(15))} - ALL`, 'A:ZZ', [['Timestamp', 'Date', 'Time', 'Full date', ...guildList]]);
//             await _writeGoogleSheet(googleSheetClient, SHEET_ID, `Season ${Number(allSeasons.active_season.gauntlet_id.slice(15))} - ALL`, 'A:ZZ', [[
//                 date.getTime(),
//                 dateString,
//                 timeString,
//                 `${dateString} ${timeString}`,
//                 ...guildList.map(g => formatedSeasonData.leaderboard.find(l => `${l.guild_name} [${l.guild_nameplate}]` === g)?.level || null)
//             ]]);
//         } catch (error) {
//             console.log(error);
//         }
//     }
// }

// // GOOGLE
// async function _getGoogleSheetClient() {
//     const auth = new google.auth.GoogleAuth({
//         keyFile: './dauntless-gauntlet-leaderboard-ef55abc6b8b1.json',
//         scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//     });
//     const authClient = await auth.getClient();
//     return google.sheets({
//         version: 'v4',
//         auth: authClient,
//     });
// }

// async function _readGoogleSheet(googleSheetClient, sheetId, tabName, range) {
//     const res = await googleSheetClient.spreadsheets.values.get({
//         spreadsheetId: sheetId,
//         range: `${tabName}!${range}`
//     });

//     return res.data.values;
// }

// async function _writeGoogleSheet(googleSheetClient, sheetId, tabName, range, data, shouldOverwrite = false) {
//     await googleSheetClient.spreadsheets.values.append({
//         spreadsheetId: sheetId,
//         range: `${tabName}!${range}`,
//         valueInputOption: 'RAW',
//         insertDataOption: shouldOverwrite ? 'OVERWRITE' : 'INSERT_ROWS',
//         resource: {
//             "majorDimension": "ROWS",
//             "values": data
//         }
//     });
// }

// async function _updateGoogleSheet(googleSheetClient, sheetId, tabName, range, data) {
//     await googleSheetClient.spreadsheets.values.update({
//         spreadsheetId: sheetId,
//         range: `${tabName}!${range}`,
//         valueInputOption: 'RAW',
//         resource: {
//             "values": data
//         }
//     });
// }