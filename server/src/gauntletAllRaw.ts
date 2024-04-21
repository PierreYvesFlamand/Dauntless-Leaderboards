import fs from 'fs';

const seasonRawFolder = `../database/raw/gauntlets/gauntlet-season${String(process.argv[2]).padStart(2, '0')}/raw`;
if (!fs.existsSync(seasonRawFolder)) {
    throw new Error(`Raw folder doesn\'t exist for season ${process.argv[2]}`);
}

const allraw: any = {};
const files = fs.readdirSync(seasonRawFolder)
const totalFiles = files.length;
let filesDone = 0;

for (const fileName of files) {
    const data = JSON.parse(fs.readFileSync(`${seasonRawFolder}/${fileName}`, 'utf8'));
    allraw[fileName.split('.')[0]] = data;

    console.log(`${(100 / totalFiles * filesDone++).toFixed(1)}%`);
}

fs.writeFileSync(`../database/exposed/season-${String(process.argv[2]).padStart(2, '0')}-all-raw.json`, JSON.stringify(allraw), 'utf8');
