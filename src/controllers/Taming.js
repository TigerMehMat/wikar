const AbstractCommandController = require('./AbstractCommandController.js');
const CreaturesModel = require("../Models/CreaturesModel.js");
const getCreature = require("./functions/getCreature.js");
const Discord = require("discord.js");
const getFood = require("./functions/getFood.js");
const eatAliases = require("../aliases/eatAliases.js");

class Taming extends AbstractCommandController {
    creatureName;
    creature;
    level;
    multiTamingSpeed;
    multiFood;

    /**
     * Устанавливаем нужные нам параметры из аргументов
     * @param {string[]} args
     * @return {Promise<this>}
     */
    async setArgs(args) {
        if (args.length < 1) return this;
        let creatureName = '';
        let index = 0;
        while (typeof args[index] === 'string' && isNaN(Number(args[index]))) {
            creatureName += ' ' + args[index];
            index++;
        }
        this.creatureName = creatureName.trim();
        this.level = Number(args[index] ?? 150);
        this.multiTamingSpeed = Number(args[index + 1] ?? 1);

        return this;
    }

    /**
     * Валидация входных данных перед процессом
     * @return {Kibble}
     */
    async validate() {
        await super.validate();
        if (this.valid) {
            this.valid = !(typeof this.creatureName !== "string" || typeof this.level !== "number" || typeof this.multiTamingSpeed !== "number");
        }
        return this;
    }

    /**
     * Финальный процесс
     */
    async process() {
        return new Promise(async (resolve, reject) => {
            if (!this.valid) {
                this.message.channel.send("Некоторые данные невалидны");
                setTimeout(() => {
                    this.message.channel.stopTyping();
                    resolve();
                }, 5000);
                return;
            }
            this.creature = await (new CreaturesModel())
                .setCreatureName(this.creatureName)
                .searchOne();

            if (!this.creature) {
                this.message.channel.send(`Не удалось найти  ${this.creatureName} в базе`);
            }

            const creature = getCreature()[this.creature.en_name];

            if (!creature) {
                this.message.channel.send(`Не удалось найти информацию о приручении ${this.creature.ru_name_rp}`);
                return;
            }

            const food = getFood();

            let description = '';
            const affinityNeeded = creature.affinityNeeded0 + creature.affinityIncrease * this.level;
            let wakeAffinityMult = creature.wakeAffinityMult ?? 1;

            for (let foodItem of creature.eats) {
                if (foodItem.search('(Primitive Plus)') !== -1) continue;
                if (foodItem === 'Crops') {
                    foodItem = 'Vegetables';
                }
                const currentFood = (creature.specialFoodValues && creature.specialFoodValues[foodItem]) || food[foodItem];
                if (!currentFood) continue;
                let foodAffinity  = currentFood.affinity ?? 0;
                let foodValue  = currentFood.foodValue ?? currentFood.value ?? 0;
                foodAffinity = foodAffinity * wakeAffinityMult * 4 * this.multiTamingSpeed;

                if (!(foodAffinity > 0 && foodValue > 0)) continue;

                const itemsNeeded = Math.ceil(affinityNeeded / foodAffinity);

                if (foodItem === 'Kibble') {
                    foodItem = creature.favoriteKibble + ' Kibble';
                }

                description += '\n' + ((eatAliases[foodItem]) || foodItem) + ' - ' + itemsNeeded;
            }

            const embed = new Discord.MessageEmbed();
            embed
                .setTitle(`Приручение ${this.creature.ru_name_rp}`)
                .setURL(`https://www.dododex.com/taming/${this.creature.dododex_alias.replace(' ', '').toLowerCase()}/${this.level}?taming=${String(this.multiTamingSpeed).replace('.', ',')}`)
                .setDescription(description)
                .setFooter(`ур. ${this.level} • х${this.multiTamingSpeed}`)
            ;
            this.message.channel.send(embed);
        });
    }

    static getAliases() {
        return [
            'приручение',
            'п',
        ];
    }
}

module.exports = Taming;
