const access = require('./GlobalControllers/access.js'),
    Discord = require('discord.js');

class GetAva {
    static controller(message, args, client, messageAccess){
        if(!access.isAccess(messageAccess)) return;

        if(args.length === 0){
            GetAva.sendImageByUser(message, message.author);
            return;
        }
        let name = args.join(' ');
        let inc = name.indexOf('#');
        if(inc === -1) return;
        let userdisc = name.substr(inc+1, name.length);
        let username = name.substr(0, inc);
        if(!username||!userdisc) return;
        let usr = client.users.find(us => { return us.discriminator===userdisc && username === us.username });
        if(!usr){
            message.channel.send("Не удалось найти такого пользователя…");
            return;
        }

        GetAva.sendImageByUser(message, usr);
    }

    static sendImageByUser(message, usr){
        message.channel.startTyping();
        let mentionUserAva = usr.avatarURL;
        let avaExt = mentionUserAva.substr(mentionUserAva.lastIndexOf('.'));
        avaExt = avaExt.replace(/\?.*/, '');
        const attachment = new Discord.MessageAttachment(mentionUserAva, "аватарка"+avaExt);
        message.channel.send(attachment)
            .then(() => {
                message.channel.stopTyping();
            })
            .catch(() => {
                message.channel.stopTyping();
                message.channel.send('Не удалось загрузить изображение…');
            });
    }
}

module.exports = GetAva;
