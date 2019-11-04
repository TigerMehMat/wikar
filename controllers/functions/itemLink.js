const getIcon   = require('./getIcon');


module.exports = (text, link = true) => {
    if(!link) return getIcon(text) + text;
    return '[' + getIcon(text) + text+'](https://ark-ru.gamepedia.com/'+text.replace(/\s/g, '_')+')';
};
