const fs = require('fs');
const path = require('path');
const env = require('../../env.js');

module.exports = () => {
    return JSON.parse(fs.readFileSync(path.resolve(env.PATH_DATA, 'wiki/food.json'), 'utf8'));
};
