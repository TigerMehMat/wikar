const creatureAliases   = require('../../aliases/creatureAliases.js');
const creatureAliases2   = require('../../aliases/creatureAliases2.js');
const creatureAliasesMap   = require('../../aliases/creatureAliasesMap.js');
const eatAliases   = require('../../aliases/eatAliases.js');

class Aliases {
    static enCreatures(name){
        if(name.search('тек')===0) name = name.substr(3);
        if(name.search('аберрантн')===0) name = name.substr(11);
    }
}

module.exports = Aliases;
