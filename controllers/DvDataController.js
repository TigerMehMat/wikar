const DvData = require('./functions/getDvData')();

/**
 * @typedef DvTaming
 * @property {string} torporimmune
 * @property {string} canbetamed
 * @property {string} rideable
 * @property {string} equipment
 * @property {string} canmountonhumans
 * @property {string} nonviolenttame
 * @property {string} knockouttame
 * @property {string} ballowmountedweaponry
 * @property {number} tameineffectivenessbyaffinity
 * @property {number} tameaffinitybase
 * @property {number} tameaffinityperlevel
 * @property {number} foodconsumptionbase
 * @property {number} foodconsumptionmult
*/
/**
 * @typedef DvTamingFood
 * @property {string} kibble
 * @property {string} favoritefood
*/
/**
 * @typedef DvBreeding
 * @property {string} egg
 * @property {number} mintemp
 * @property {number} maxtemp
 * @property {number} incubationtime
 * @property {number} maturationtime
 * @property {number} babytime
 * @property {number} juveniletime
 * @property {number} adolescenttime
 * @property {number} mintimebetweenmating
 * @property {number} maxtimebetweenmating
*/
/**
 * @typedef DvColorPlace
 * @property {string} name
 * @property {string} colors
*/
/**
 * @typedef DvColorization
 * @property {DvColorPlace} 0 Нулевая цветовая область
 * @property {DvColorPlace} 1 Первая цветовая область
 * @property {DvColorPlace} 2 Вторая цветовая область
 * @property {DvColorPlace} 3 Третья цветовая область
 * @property {DvColorPlace} 4 Четвертая цветовая область
 * @property {DvColorPlace} 5 Пятая цветовая область
*/
/**
 * @typedef DvStats
 * @property {'Yes'|'No'|''} cansuffocate
 * @property {number} health
 * @property {number} healthwildlevel
 * @property {number} healthtamedlevel
 * @property {number} healthtamedadd
 * @property {number} stamina
 * @property {number} staminawildlevel
 * @property {number} staminatamedlevel
 * @property {number} torpor
 * @property {number} torporwildlevel
 * @property {number} torportamedadd
 * @property {number} oxygen
 * @property {number} oxygenwildlevel
 * @property {number} oxygentamedlevel
 * @property {number} food
 * @property {number} foodwildlevel
 * @property {number} foodtamedlevel
 * @property {number} foodtamedmult
 * @property {number} weight
 * @property {number} weightwildlevel
 * @property {number} weighttamedlevel
 * @property {number} melee
 * @property {number} meleewildlevel
 * @property {number} meleetamedlevel
 * @property {number} meleetamedmult
 * @property {number} meleetamedadd
 * @property {number} speed
 * @property {number} speedtamedadd
 * @property {number} walkspeed
 * @property {number} riddenwalkspeed
 * @property {number} untamedrunspeed
 * @property {number} tamedrunspeed
 * @property {number} runningstaminaconsumptionrate
 * @property {number} swimspeed
 * @property {number} riddenswimspeed
 * @property {number} flyspeed
 * @property {number} flyriddenspeed
 * @property {number} untamedrunflyspeed
 * @property {number} tamedrunflyspeed
 * @property {number} tamedriddenrunflyspeed
 * @property {number} flyingstaminaconsumptionrate
*/
/**
 * @typedef DvCreature
 * @property {string} dlc
 * @property {string} releasedate
 * @property {string} releaseversion
 * @property {string} xboxreleasedate
 * @property {string} xboxreleaseversion
 * @property {string} ps4releasedate
 * @property {string} ps4releaseversion
 * @property {string} mobilereleasedate
 * @property {string} mobilereleaseversion
 * @property {string} switchreleasedate
 * @property {string} switchreleaseversion
 * @property {string} class
 * @property {string} blueprintpath
 * @property {string} commonname
 * @property {string} dossierimage
 * @property {string} dossieraddbook
 * @property {string} soundfile
 * @property {string} pronunciation
 * @property {string} categories
 * @property {string} species
 * @property {string} time
 * @property {string} group
 * @property {string} temperament
 * @property {string} diet
 * @property {DvTaming} taming
 * @property {DvTamingFood} tamingfood
 * @property {DvBreeding} breeding
 * @property {DvColorization} colorization
 * @property {DvStats} stats
 * @property {number} grabweightthreshold
 * @property {number} dragweight
 * @property {number} mass
 * @property {string} fecessize
 * @property {string} radiationimmune
 * @property {string} immobilizedby
 * @property {string} candamage
 * @property {string} carryableby
 * @property {string} passengerweightmultiplier
 * @property {number} meleebase
 * @property {Object} attacks
 * @property {string} killxpbase
 * @property {string} teamname
 * @property {string} chancetodroploot
 * @property {string} lootitems
 * @property {string} canbeharvestedfor
 * @property {string} harvests
 */

/**
 * Класс для работы с DvData
 */
class DvDataController {
        /**
         * Получаем DvData, рекурсивно получая инфу от родителей
         * @param creature_dv_name
         * @return {DvCreature}
         */
        getCreature(creature_dv_name) {
                if(typeof DvData[creature_dv_name] === "undefined") return null;
                let data = JSON.parse(JSON.stringify(DvData[creature_dv_name]));
                let parent = null;
                if(typeof data['inherits'] !== "undefined") {
                        parent = this.getCreature(data['inherits']);
                } else {
                        return data;
                }
                return this.extend(parent, data);
        }

        /**
         * Объединение объектов
         * @param {{}} object1
         * @param {{}} object2
         * @return {*}
         */
        extend(object1, object2) {
                for(let key in object2) {
                        if(!object2.hasOwnProperty(key)) continue;
                        if(typeof object1[key] === "object" && typeof object2[key] === "object") {
                                object1[key] = this.extend(object1[key], object2[key]);
                        } else {
                                object1[key] = object2[key];
                        }
                }
                return object1;
        }
}

module.exports = DvDataController;