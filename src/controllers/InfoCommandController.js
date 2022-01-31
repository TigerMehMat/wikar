const AbstractCommandController = require('./AbstractCommandController.js');
const CreaturesModel = require('../Models/CreaturesModel.js');
const DvDataController = require('./DvDataController.js');
const Discord = require('discord.js');
const ItemsModel = require('../Models/ItemsModel.js');
const MapsModel = require('../Models/MapsModel.js');

class InfoCommandController extends AbstractCommandController {
        creature_name;
        /** @type {DvCreature} */
        creature_data;
        /** @type {CreatureModel} */
        creature;

        /**
         * Устанавливаем данные из аргументов вызова
         * @param {Array} args
         */
        async setArgs(args) {
                this.creature_name = args.join(' ');
                this.creature = await ((new CreaturesModel())
                        .setCreatureName(this.creature_name)
                        .searchOne());
        }

        async validate() {
                await super.validate();
                if(this.valid && !this.creature) {
                        this.valid = false;
                        await this.message.channel.send(`Тушканчики не нашли в базе существо с названием \`\`${this.creature_name}\`\`.`);
                }
        }

        async process() {
                if (!this.valid) return;
                this.creature_data = (new DvDataController()).getCreature(this.creature.dv_alias);
                let embed = await this.getEmbed();
                await this.message.channel.send(embed);
        }

        async getEmbed() {
                let embed = new Discord.MessageEmbed();
                embed.setTitle(this.creature.ru_name);
                embed.addField(
                        'Иммунитет к',
                        'Радиации: ' +
                        ((typeof this.creature_data.radiationimmune === "undefined")
                                ? 'Неизвестно' : (this.creature_data.radiationimmune.toLowerCase() === 'no') ? 'Нет' : 'Да')
                                + '\nОглушению: ' +
                        ((typeof this.creature_data.taming.torporimmune === "undefined")
                                ? 'Неизвестно' : (this.creature_data.taming.torporimmune.toLowerCase() === 'no') ? 'Нет' : 'Да'),
                        true
                );
                embed.addField(
                        'Перенос',
                        'Вес переноса: ' + this.getParameter(this.creature_data.dragweight) +
                        '\nМасса: ' + this.getParameter(this.creature_data.mass),
                        true
                        );
                embed.addField(
                        'Множитель переноса',
                        'Для несущего: ' + this.getParameter(this.creature_data.passengerweightmultiplier) +
                        '\nДля носимого: ' + this.getParameter(this.creature_data.mounteddinoweightmultiplier),
                        true
                        );
                embed.addField(
                        'Может повредить',
                         this.getCanDamage(),
                        true
                        );
                embed.addField(
                        'С этого существа падает',
                         await this.getHarvests(this.creature_data.canbeharvestedfor),
                        true
                        );
                // embed.addField(
                //         'Это существо может добыть',
                //          await this.getHarvests(this.creature_data.harvests),
                //         true
                //         );
                embed.addField(
                        'Без категории',
                         'Шанс дополнительного лута: ' + this.getParameter(this.creature_data.chancetodroploot) +
                         '\nСпециальный лут: ' + (typeof this.creature_data.specialloot !== "undefined" ? await (new ItemsModel()).getName(this.creature_data.specialloot) : 'Неизвестно') +
                         '\nКатегория: ' + this.getParameter(this.creature_data.teamname),
                        true
                        );
                return embed;
        }

        getParameter(parameter) {
                return (typeof parameter === "undefined" || parameter === '') ? 'Неизвестно' : parameter;
        }

        getCanDamage() {
                let can_damage = this.creature_data.candamage;
                if(!can_damage) return 'Неизвестно';
                can_damage = can_damage.split(', ');
                let can_damage_result = [];
                let weights = {
                        'Thatch': 1,
                        'Wood': 2,
                        'Adobe': 3,
                        'Stone': 4,
                        'Greenhouse': 5,
                        'Metal': 6,
                        'Tek': 7,
                };
                can_damage.sort((a,b) => weights[a] > weights[b] ? 1 : -1);
                for(let material of can_damage) {
                        let material_translated = material;
                        switch (material) {
                                case 'Thatch':
                                        material_translated = 'Солома';
                                        break;
                                case 'Wood':
                                        material_translated = 'Дерево';
                                        break;
                                case 'Adobe':
                                        material_translated = 'Саман';
                                        break;
                                case 'Stone':
                                        material_translated = 'Камень';
                                        break;
                                case 'Greenhouse':
                                        material_translated = 'Парник';
                                        break;
                                case 'Metal':
                                        material_translated = 'Металл';
                                        break;
                                case 'Tek':
                                        material_translated = 'Тек';
                                        break;
                        }
                        can_damage_result.push(material_translated);
                }
                return can_damage_result.join('\n');
        }

        async getHarvests(harvests) {
                if(!harvests) return 'Неизвестно';
                harvests = harvests.split(', ');
                let items = [];
                let maps = await (new MapsModel()).getAllMaps();
                maps = maps.map((item) => {
                        return item.name
                });
                for(let item_name of harvests) {
                        item_name = item_name.replace(new RegExp(`\\s*\\((${maps.join('|')})\\)`), '').trim();
                        items.push(await (new ItemsModel()).getName(item_name));
                }
                return items.sort().join('\n');
        }

        static getAliases() {
                return [
                        'инфо'
                ];
        }
}

module.exports = InfoCommandController;
