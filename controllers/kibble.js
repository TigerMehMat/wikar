/**
 * @typedef {Object} KibbleItem
 * @property {string} name
 * @property {string} ruName
 * @property {string} color
 * @property {string} colorHEX
 * @property {string} wikiLink
 * @property {Object} craft
 * @property {Object} fullCraft
 */
const Discord = require("discord.js");
const access = require("./GlobalControllers/access");
const kibbles = require("../data/kibble/kibbles.js");
const itemLink   = require("./functions/itemLink");
const numberFormat  = require("./functions/numberFormat");

const BadRequestsModel  = new (require('../Models/BadRequestsModel'));


class Kibble {

    constructor() {
        this.name = undefined;
        this.quantity = undefined;
        this.is_validate = false;
        this.bot_message = undefined;
    }
    /**
     * Сообщение, на которое надо реагировать
     * @param {Message} message
     * @return {Kibble}
     */
    setMessage(message) {
        this.message = message;
        return this;
    }

    /**
     * Устанавливаем нужные нам параметры из аргументов
     * @param {string[]} args
     * @return {Kibble}
     */
    setArgs(args) {
        if(args.length < 1) return this;

        this.name = this.getKibbleRealName(args[0]);
        this.quantity = (!isNaN(args[args.length - 1])) ? Math.min(10000, Math.max(1, args[args.length - 1])) : 1;

        return this;
    }

    /**
     * Валидация входных данных перед процессом
     * @return {Kibble}
     */
    validate() {
        this.is_validate = !(typeof this.name !== "string" || typeof this.quantity !== "number");
        return this;
    }

    /**
     * Финальный процесс
     */
    process() {
        return new Promise((resolve, reject) => {
            if(!this.is_validate) {
                this.message.channel.send("Пожалуйста, укажите название корма");
                reject(new Error('Название корма не введено'));
            }
            this.message.channel.startTyping();
            let embed = this.getEmbed();
            this.message.channel.send(embed)
                    .then((bot_msg) => {
                        this.bot_message = bot_msg;
                        this.message.channel.stopTyping();
                        if(typeof this.getKibble().fullCraft !== "undefined") {
                            return this.bot_message.react('557880955063238667');
                        } else {
                            resolve();
                        }
                    })
                    .then(() => {
                            let reactionFilter = (reaction, user) => {
                                return '557880955063238667' === reaction.emoji.id && user.id === this.message.author.id && !this.message.author.bot;
                            };
                            setTimeout(() => {
                                if(this.bot_message.deleted) return;
                                this.bot_message.clearReactions().catch(console.error);
                            }, 60000);
                            return this.bot_message.awaitReactions(reactionFilter, {max: 1, time: 60000, errors: ['time']});
                    })
                    .then(() => {
                        this.message.channel.startTyping();
                        return this.bot_message.clearReactions();
                    })
                    .then(() => {
                        let embed = this.getEmbed(true);
                        this.bot_message.edit(embed);
                        this.message.channel.stopTyping();
                    })
                    .catch(error => {
                        this.message.channel.stopTyping(true);
                        reject(error);
                    });

        });
    }

    /**
     * Получаем объект корма
     * @return {KibbleItem}
     */
    getKibble() {
        return kibbles[this.name];
    }

    /**
     * Получаем подготовленные данные для отправки
     * @param fullCraft
     * @return {module:"discord.js".RichEmbed}
     */
    getEmbed(fullCraft = false) {
        let kibble = this.getKibble();
        let embed = new Discord.RichEmbed()
            .setTitle(itemLink(kibble.ruName + " Корм", false)+" (" + kibble.name + " kibble)")
            .setAuthor(this.message.author.username, this.message.author.avatarURL)
            .setURL("https://ark-ru.gamepedia.com/"+encodeURIComponent(kibble.wikiLink))
            .setFooter(numberFormat(this.quantity)+" шт")
            .setColor(kibble.colorHEX);
        let content = this.getList((fullCraft && typeof kibble.fullCraft !== "undefined") ? kibble.fullCraft : kibble.craft);
        embed.setDescription(content);
        return embed;
    }

    /**
     * Получаем строку из списка для вывода (рендерим)
     * @param {Object} itemsCraft
     * @return {string}
     */
    getList(itemsCraft) {
        let content = "";
        for(let crName in itemsCraft){
            if(itemsCraft.hasOwnProperty(crName)) {
                let count = itemsCraft[crName] * this.quantity;
                count = count === Infinity ? '∞' : count;
                content += itemLink(crName) + " х " + numberFormat(count) + "\n";
            }
        }
        return content;
    }

    /**
     * Получаем строгое название корма по нестрогому
     * @param {string} name нестрогое название корма
     * @return {string|undefined}
     */
    getKibbleRealName(name) {
        if(typeof name !== 'string') return undefined;
        name = name.trim().toLowerCase();
        switch (name) {
            case "белый":
            case "оченьмаленький":
            case "оченьмаленькое":
            case "серый":
            case "базовый":
            case "basic":
                return "basic";
            case "зелёный":
            case "зеленый":
            case "маленький":
            case "маленькое":
            case "простой":
            case "simple":
                return "simple";
            case "синий":
            case "средний":
            case "среднее":
            case "обычный":
            case "regular":
                return "regular";
            case "фиолетовый":
            case "большой":
            case "большое":
            case "отличный":
            case "superior":
                return "superior";
            case "желтый":
            case "жёлтый":
            case "оченьбольшой":
            case "оченьбольшое":
            case "исключительный":
            case "exceptional":
                return "exceptional";
            case "голубой":
            case "легендарный":
            case "экстраординарный":
            case "специальный":
            case "специальное":
            case "extraordinary":
                return "extraordinary";
            default:
                return undefined;
        }
    }
}

module.exports = Kibble;
