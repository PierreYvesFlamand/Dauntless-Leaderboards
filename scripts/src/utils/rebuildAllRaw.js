const fs = require('fs');

const folder = '../../../server/public/data/gauntlets/gauntlet-season11/raw';
const allData = {};
for (const fileName of fs.readdirSync(folder)) {
    const data = JSON.parse(fs.readFileSync(folder + '/' + fileName, 'utf8'));
    allData[fileName.split('.')[0]] = data;
}
fs.writeFileSync('../../../server/public/data/gauntlets/gauntlet-season11/all-raw.new.json', JSON.stringify(allData, null, 2), 'utf8');

// // Fill missing data
// const base = JSON.parse(fs.readFileSync('../WORK/2024-04-10--06-10.json', 'utf8'));
// let date = new Date(Date.UTC(
//     Number('2024-04-10--06-10'.split('--')[0].split('-')[0]),
//     Number('2024-04-10--06-10'.split('--')[0].split('-')[1]) - 1,
//     Number('2024-04-10--06-10'.split('--')[0].split('-')[2]),
//     Number('2024-04-10--06-10'.split('--')[1].split('-')[0]),
//     Number('2024-04-10--06-10'.split('--')[1].split('-')[1])
// ));

// let next;
// do {
//     date = new Date(date.getTime() - 1000 * 60 * 10);
//     next = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}--${String(date.getUTCHours()).padStart(2, '0')}-${String(date.getUTCMinutes()).padStart(2, '0')}`;
//     console.log(next);
//     base.lastUpdated = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}T${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:04Z`;
//     fs.writeFileSync(`../WORK/${next}.json`, JSON.stringify(base, null, 2), 'utf8');
// } while (next !== '2024-04-09--17-10');

// // Rebuild All Raw
// const folder = '../WORK';
