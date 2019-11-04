const Discord = require("discord.js");
const access = require("./GlobalControllers/access");
const kibbles = require("../data/kibble/kibbles.js");
const itemLink   = require("./functions/itemLink");
const numberFormat  = require("./functions/numberFormat");

const db_badRequests_class	= require('./DB/bad_requests');
const db_badRequests	= new db_badRequests_class();


class Kibble {

    static controller(message, args, messageAccess){
        if(!access.isAccess(messageAccess)) return;

        if(args.length === 0) {
            message.channel.send('Эта команда не вызывается без параметров. Для справки используйте ``!помощь корм``')
                .catch(console.error);
            return;
        }

        let name = args[0];
        let quantity = (!isNaN(+args[1]))?+parseInt(args[1]):1;
        if(quantity<1) quantity = 1;
        if(quantity>10000) quantity = 10000;

        let kb = Kibble.getKibbleInfo(name);
        if (!kb) {
            message.channel.send("В нашей базе нет корма ``"+Discord.Util.escapeMarkdown(name, false, true)+"``")
                .then((msg) => {
                    db_badRequests.putRequest(message, 'kibble', 'Нет корма в базе: '+name, msg.id)
                        .catch(console.error);
                })
                .catch(console.error);
        }
        else {
            Kibble.sendKibbleInfo(kb, message, quantity);
        }
    }

    static getKibbleInfo(name){
        if(typeof name !== 'string') return false;
        name = name.trim().toLowerCase();
        switch (name) {
            case "белый":
            case "оченьмаленький":
            case "оченьмаленькое":
            case "серый":
            case "базовый":
            case "basic":
                return kibbles["basic"];
            case "зелёный":
            case "зеленый":
            case "маленький":
            case "маленькое":
            case "простой":
            case "simple":
                return kibbles["simple"];
            case "синий":
            case "средний":
            case "среднее":
            case "обычный":
            case "regular":
                return kibbles["regular"];
            case "фиолетовый":
            case "большой":
            case "большое":
            case "отличный":
            case "superior":
                return kibbles["superior"];
            case "желтый":
            case "жёлтый":
            case "оченьбольшой":
            case "оченьбольшое":
            case "исключительный":
            case "exceptional":
                return kibbles["exceptional"];
            case "голубой":
            case "легендарный":
            case "экстраординарный":
            case "специальный":
            case "специальное":
            case "extraordinary":
                return kibbles["extraordinary"];
            default:
                return false;
        }
    }

    static sendKibbleInfo(kibble, message, quantity){
        let embed = new Discord.RichEmbed()
            .setTitle(itemLink(kibble.ruName + " Корм", false)+" (" + kibble.name + " kibble)")
            .setAuthor(message.author.username, message.author.avatarURL)
            .setURL("https://ark-ru.gamepedia.com/"+encodeURIComponent(kibble.wikiLink))
            .setFooter(numberFormat(quantity)+" шт")
            .setColor(kibble.colorHEX);
        let content = this.getContentByArray(kibble.craft, quantity);
        embed.setDescription(content);
        message.channel.send(embed)
            .then((msg) => {
                if(kibble.fullCraft) {
                    msg.react('557880955063238667')
                        .then(() => {
                            let reactionFilter = (reaction, user) => {
                                return '557880955063238667' === reaction.emoji.id && user.id === message.author.id && !message.author.bot;
                            };
                            setTimeout(() => {
                                if(msg.deleted) return;
                                msg.clearReactions().catch(console.error);
                            }, 60000);
                            msg.awaitReactions(reactionFilter, {max: 1, time: 60000, errors: ['time']})
                                .then(() => {
                                    msg.clearReactions()
                                        .then(() => {
                                            let embed = new Discord.RichEmbed()
                                                .setTitle(itemLink(kibble.ruName + " Корм", false)+" (" + kibble.name + " kibble)")
                                                .setAuthor(message.author.username, message.author.avatarURL)
                                                .setURL("https://ark-ru.gamepedia.com/"+encodeURIComponent(kibble.wikiLink))
                                                .setFooter(numberFormat(quantity)+" шт")
                                                .setColor(kibble.colorHEX);
                                            let content = Kibble.getContentByArray(kibble.fullCraft, quantity);
                                            embed.setDescription(content);
                                            msg.edit(embed)
                                        })
                                        .catch(console.error);
                                })
                                .catch(console.error);
                        })
                        .catch(console.error);
                }
            })
            .catch(console.error);
    }

    static getContentByArray(arr, quantity){
        let content = "";
        for(let crName in arr){
            let count = arr[crName]*quantity;
            count = count === Infinity ? '∞' : count;
            content +=  itemLink(crName) + " х " + numberFormat(count) + "\n";
        }
        return content;
    }
}

module.exports = Kibble;
