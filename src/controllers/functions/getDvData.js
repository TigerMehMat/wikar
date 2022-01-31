const fs = require('fs');
const path = require('path');

module.exports = () => {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../data/wiki/dvdata.json'), 'utf8'));
};
