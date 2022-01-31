const staticTextModule = require('./GlobalControllers/staticTextModule.js'),
    materials = require('../data/crafting/materials.js'),
    fuel = require('../data/crafting/fuel.js'),
    stantions = require('../data/crafting/stantions.js');

class CraftingSpeed extends staticTextModule {
    static controller(message, args){ // <материал> [<количество> <станция> <количество>]
        if(!staticTextModule.isAccess(message)) return;


    }

    static getHelpMessage(){
        return '';
    }

    static getTimeByMaterial(material, q_material =  'full', stantion = false, q_stantion = 1, fuel = false){
        material = materials[material];

        if(!stantion) stantion = Object.keys(material.stantions)[0];
        stantion = stantions[stantion];

        if(q_material === 'full'){
            q_material = material.stack * stantion.slots;
        }

        return this.getRawData(material, q_material, stantion, q_stantion, fuel)
    }

    static getRawData(material, q_material, stantion, q_stantion, fuel){
        let parts = Math.ceil(q_material / material.stantions[stantion.name].perone);
        return parts * material.stantions[stantion.name].pertime;
    }

}


module.exports = CraftingSpeed;
