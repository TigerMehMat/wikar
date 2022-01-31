const Wiki      = require('./GlobalControllers/Wiki.js');
const Access    = require('./GlobalControllers/access.js');
const Discord   = require('discord.js');
const itemLink  = require('./functions/itemLink.js');
const getIcon   = require('./functions/getIcon.js');
const numberFormat  = require("./functions/numberFormat.js");

const BadRequestsModel  = new (require('../Models/BadRequestsModel.js'));

class Wiki_craft extends Wiki {
    static async sendCraft(message, args, messageConf) {
        if(!Access.isAccess(messageConf)) return;
        if(args.length === 0) {
            message.channel.send('Эта команда не вызывается без параметров. Для справки используйте ``!помощь викикрафт``');
            return;
        }
        let quantity;
        let rate;
        message.channel.startTyping();

        rate = args.pop();
        if(isNaN(+rate)) {
            args.push(rate);
            quantity    = 1;
            rate        = 1;
        } else {
            quantity    = args.pop();
            if(isNaN(+quantity)) {
                args.push(quantity);
                quantity    = parseInt(rate);
                rate        = 1;
            } else {
                quantity    = parseInt(quantity);
                rate        = parseFloat(rate);
            }
            if (quantity < 1) quantity = 1;
            if (quantity > 10000000) quantity = 10000000;
        }


        for(let i = 0; i < args.length; i++) {
            let res = args[i].toLowerCase();
            if(res !== 'для' && res !== 'и' && res !== 'или' && res !== 'с') {
                res = res.substr(0, 1).toUpperCase() + res.substr(1);
            }
            args[i] = res;
        }
        let link;
        let page;
        link = encodeURIComponent(args.join('_'));
        try {
            page = await this.getPage(link);
        }
        catch (e) {
            if(e.response) {
                if(e.response.status === 404) {
                    message.channel.stopTyping();
                    message.channel.send(`Мы не нашли страницы **${decodeURIComponent(link).replace(/_/g, '\\_')}** на википедии...`)
                        .then(function (msg) {
                            BadRequestsModel.putRequest(message, 'craft', 'На вики нет страницы: '+decodeURIComponent(link).replace(/_/g, '\_'), msg.id)
                                .catch(console.error);
                        })
                        .catch(console.error);
                    return;
                }
                console.error(e.response);
            }
            console.error(e);
            return;
        }
        let arr_craft = this.getCraft(page);
        let title = this.getTitle(page);


        if(!arr_craft || arr_craft.length === 0) {
            message.channel.stopTyping();
            message.channel.send(`На странице вики **${title}** нет информации о крафте`)
                .then(function (msg) {
                    BadRequestsModel.putRequest(message, 'craft', 'Нет информации о крафте: '+title, msg.id)
                        .catch(console.error);
                })
                .catch(console.error);
            return;
        }

        let arr_craft_in = this.getCraftIn(page);
        let text_craft_in = '';
        for(let i = 0; i < arr_craft_in.length; i++) {
            text_craft_in += itemLink(arr_craft_in[i]) + '\n';
        }


        let curlvl = this.getLevel(page);

        let text = '';

        for(let i = 0; i < arr_craft.length; i++) {
            if(arr_craft[i].name === "Вода") text += itemLink(arr_craft[i].name) + '\n';
            else text +=  itemLink(arr_craft[i].name) + ' × ' + numberFormat(Math.ceil((parseInt(arr_craft[i].quantity) / rate) * quantity)) + '\n';
        }

        let emtitle = getIcon(title) + title;

        if(emtitle.length > 250) {
            emtitle = emtitle.substr(0,250) + '…';
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(emtitle)
            .setAuthor(message.author.username, message.author.avatarURL())
            .setURL('https://ark-ru.gamepedia.com/' + link)
            .setDescription(text);
        if(text_craft_in !== '') {
            embed.addField('Создается в', text_craft_in);
        }

        let footer = [];
        if(curlvl) {
            footer.push(curlvl + ' уровень');
        }
        footer.push(numberFormat(quantity) + ' шт');
        embed.setFooter(footer.join(' • '));
        message.channel.stopTyping();
        message.channel.send(embed)
            .catch(console.error);
    }
}

module.exports = Wiki_craft;
