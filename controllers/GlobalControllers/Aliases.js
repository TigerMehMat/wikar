const creatureAliases   = require('./../../aliases/creatureAliases');
const creatureAliases2   = require('./../../aliases/creatureAliases2');
const creatureAliasesMap   = require('./../../aliases/creatureAliasesMap');
const eatAliases   = require('./../../aliases/eatAliases');

class Aliases {
    static enCreatures(name){
        if(name.search('тек')===0) name = name.substr(3);
        if(name.search('аберрантн')===0) name = name.substr(11);
    }
}

module.exports = Aliases;
