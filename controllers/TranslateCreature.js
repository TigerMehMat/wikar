const aliases = require("../aliases/creatureAliases"),
    aliases2 = require("../aliases/creatureAliases2"),
    aliasesMap = require("../aliases/creatureAliasesMap");

class TranslateCreature {
    static getENCreature(text){
        text = TranslateCreature.validate(text);
        if(aliases[text]){
            return aliases[text];
        }
        text =TranslateCreature.getCreatureByStart(text);
        return text;
    }

    static getENCreature_map(text){
        text = TranslateCreature.getENCreature(text);
        if(aliasesMap[text]){
            return aliasesMap[text];
        }
        return text;
    }

    static getRUCreature(text){
        text = TranslateCreature.validate(text);
        text = (aliases2[text]) ? aliases2[text] : text;
        return text;
    }

    static getCreatureByStart(text){
        let results = false;
        for(let key in aliases){
            if(key.indexOf(text)!==0) continue;
            if(!results) results = aliases[key];
            else if(results !== aliases[key]) return text;
        }
        if(!results) return text;
        return results;
    }

    static validate(text){
        text = String(text);
        text = text.trim().toLowerCase().replace(' ', '');
        return text;
    }
}

module.exports = TranslateCreature;