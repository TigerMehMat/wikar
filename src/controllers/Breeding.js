const Discord = require('discord.js');
const DiscordHelper = require('./GlobalControllers/DiscordHelper.js');
const AbstractCommandController = require('./AbstractCommandController.js');
const getIcon = require('./functions/getIcon.js');
const DvDataController = require('./DvDataController.js');

const CreaturesModel = require('../Models/CreaturesModel.js');

class Breeding extends AbstractCommandController {
    /**
     * @type {CreatureModel | null}
     */
    creature = null;

    multipliers = {
        mature: null,
        incubation: null
    };

    creature_name = '';

    /**
     * Устанавливаем данные из аргументов вызова
     * @param {Array} args
     */
    async setArgs(args) {

        let data = args.pop();
        if (isNaN(data)) {
            args.push(data);
            this.multipliers.mature = 1;
            this.multipliers.incubation = 1;
        } else {
            let data2 = args.pop();

            if (isNaN(data2)) {
                this.multipliers.mature = this.multipliers.incubation = this.getTrueValue(data);
                args.push(data2);
            } else {
                this.multipliers.mature = data2;
                this.multipliers.incubation = this.getTrueValue(data);
            }
        }

        this.creature_name = args.join(' ');
        this.creature = await ((new CreaturesModel())
            .setCreatureName(this.creature_name)
            .searchOne());
    }

    async process() {
        if (!this.valid) return;
        // Если не удалось найти существо
        if (!this.creature) {
            const embed = (new Discord.MessageEmbed())
                .setTitle('GRRRAAAR.. CRACK.. BOOM.. BARK! .. ')
                .setDescription('Теперь уже спокойный Ферокс сообщает что ``' + this.creature_name + '`` ему найти не удалось.');
            this.message.channel.send(embed);
            return;
        }

        let data = (new DvDataController()).getCreature(this.creature.dv_alias);
        let comment = '';
        if (typeof data === "undefined" || !data) {
            if (this.creature.parent) {
                comment = 'Нам не удалось найти информацию о разведении ' + this.creature.ru_name_rp + ', но скорее всего, у этого существа схожие параметры.\n\n';
                this.creature = await (new CreaturesModel()).getCreatureByID(this.creature.parent);
                data = (new DvDataController()).getCreature(this.creature.dv_alias);
            } else {
                await this.message.channel.send('Тушканчикам не удалось добыть информацию о разведении ' + this.creature.ru_name_rp + ', но они обещают спарить их при случае.');
                return;
            }
        }
        /* --- Вытащили нужное существо --- */
        let text;
        let is_breeding;

        if (!data['breeding'] || !data['breeding']['maturationtime']) {
            text = '🚫 Неразводимое существо';
            is_breeding = false;
        } else {
            text = '✅ Разводимое существо';
            switch (this.creature.dv_alias) {
                case 'reaper':
                case 'reaperking':
                case 'rreaperking':
                    text += '\n*Единственный способ "размножения" был бы через оплодотворение от королевы, но размножение технически невозможно из-за гендерной механики Жнеца.*';
                    break;
                case 'featherlight':
                    text += '\n*В данных игры указано что это травоядное существо, однако по факту оно питается мясом.*';
                    break;
                case 'achatina':
                case 'maewing':
                    text += '\n*Эти существа не имеют пола.\nОни оба дадут потомство и уйдут в откат.*';
                    break;

            }
            is_breeding = true;
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(this.creature.ru_name)
            .setAuthor(this.message.author.username, this.message.author.avatarURL())
            .setDescription(comment + text);

        if (is_breeding) {
            if (data['breeding']['maturationtime']) {
                embed.addField('Общее время роста', DiscordHelper.getTime(parseInt(data['breeding']['maturationtime']) / this.multipliers.mature), true);
            }

            if (data['breeding']['gestationtime'])
                embed.addField('Время беременности', DiscordHelper.getTime(parseInt(data['breeding']['gestationtime']) / this.multipliers.incubation), true);

            if (data['breeding']['incubationtime'])
                embed.addField('Время инкубации', DiscordHelper.getTime(parseInt(data['breeding']['incubationtime']) / this.multipliers.incubation), true);

            if (data['breeding']['mintemp'] && data['breeding']['maxtemp'])
                embed.addField('Диапазон инкубации', data['breeding']['mintemp'] + ' - ' + data['breeding']['maxtemp'] + ' °C', true);


            embed.addField('\u200B', '\u200B');

            if (data['breeding']['maturationtime']) {
                embed.addField('Детёныш', DiscordHelper.getTime(Math.floor(Number(data['breeding']['maturationtime'] * 0.1)) / this.multipliers.mature), true);
                embed.addField('Юнец', DiscordHelper.getTime(Math.floor(Number(data['breeding']['maturationtime'] * 0.4)) / this.multipliers.mature), true);
                embed.addField('Юный', DiscordHelper.getTime(Math.floor(Number(data['breeding']['maturationtime'] * 0.5)) / this.multipliers.mature), true);
            }
        }

        embed.addField('\u200B', '\u200B');

        if (data['diet']) {
            let diet;
            switch (data['diet']) {
                case 'Herbivore':
                    diet = getIcon('Ягоды') + 'Травоядное';
                    break;
                case 'Carnivore':
                    diet = getIcon('Сырое Мясо') + 'Хищник';
                    break;
                case 'Omnivore':
                    diet = 'Всеядное';
                    break;
                case 'Piscivore':
                    diet = getIcon('Сырая Рыба') + 'Рыбоядный';
                    break;
                case 'Carrion-Feeder':
                    diet = getIcon('Сырое Мясо') + 'Падаль (мясо)';
                    break;
                case 'Coprophagic':
                    diet = getIcon('Протухшее Мясо') + 'Копрофаг';
                    break;
                case 'Minerals':
                    diet = getIcon('Камень') + 'Минералы';
                    break;
                case 'Flame Eater':
                    diet = '🔥 Пожиратель Пламени';
                    break;
                default:
                    diet = data['diet'];
                    break;
            }
            embed.addField('Питание', diet, true);
        }

        if (data['stats'] && data['stats']['cansuffocate'])
            embed.addField('Может задохнуться', (data['stats']['cansuffocate'] === 'Yes') ? 'Да' : 'Нет', true);

        if (data['taming'] && data['taming']['torporimmune'])
            embed.addField('Иммунитет к оглушению', (data['taming']['torporimmune'] === 'Yes') ? 'Да' : 'Нет', true);

        embed.setFooter('Рост х' + this.multipliers.mature + ' • Инкубация х' + this.multipliers.incubation);

        await this.message.channel.send(embed);
        this.message.channel.stopTyping();
    }

    getTrueValue(value) {
        if (value > 1000) value = 1000;
        if (value < 0.001) value = 0.001;
        return Math.ceil(value * 1000) / 1000;
    }

    static getAliases() {
        return [
            'инкубация',
            'беременность',
            'разведение',
            'рост',
            'р',
        ];
    }
}


module.exports = Breeding;
