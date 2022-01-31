const CreaturesParser = require('./CreaturesParser.js');
const ItemsParser = require('./ItemsParser.js');

let parser = new ItemsParser('./parsers/rawData/items.json');
parser.parseItems();
