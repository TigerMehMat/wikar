const CreaturesParser = require('./CreaturesParser');
const ItemsParser = require('./ItemsParser');

let parser = new ItemsParser('./parsers/rawData/items.json');
parser.parseItems();
