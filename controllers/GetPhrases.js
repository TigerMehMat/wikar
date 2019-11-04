const fs = require('fs'),
    path = require('path');
let phrases = fs.readFileSync(path.resolve(__dirname,'../data/phrases/main.json'));
phrases = JSON.parse(phrases);

class GetPhrases {
    static getWait(){
        return phrases.wait.sort(() => {
            return Math.random() - 0.5
        })[0];
    }
}

module.exports = GetPhrases;