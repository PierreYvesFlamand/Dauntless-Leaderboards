const fs = require('fs');

const folder = '../../../server/public/data/gauntlet-season11/raw';
const allData = {};
for (const fileName of fs.readdirSync(folder)) {
    const data = JSON.parse(fs.readFileSync(folder + '/' + fileName, 'utf8'));
    allData[fileName.split('.')[0]] = data;
}
fs.writeFileSync('../../../server/public/data/gauntlet-season11/all-raw.new.json', JSON.stringify(allData, null, 2), 'utf8');
