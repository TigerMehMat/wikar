const Discord = require("discord.js");

class VoiceLogger {
    constructor(){
        this.lastVoiceUser = {};
    }

    voiceChanged(oldMember, newMember){
        let message = '';
        let channel = newMember.guild.channels.find(ch => { return ch.name === 'лог'; });
        if(!channel) return;
        if(oldMember.voiceChannelID!==newMember.voiceChannelID){

            if(!oldMember.voiceChannelID){
                message = this.messageAddInChannel(oldMember, newMember);
            } else if(!newMember.voiceChannelID){
                message = this.messageOutChannel(oldMember, newMember);
            } else {
                message = this.messageChangeChannel(oldMember, newMember);
            }

        } else if(oldMember.selfDeaf !== newMember.selfDeaf) {
            // oldMember.selfMute !== newMember.selfMute
            let statusMute = -oldMember.selfMute +newMember.selfMute;
            let statusDeaf = -oldMember.selfDeaf +newMember.selfDeaf;
            let messmin = '';
            if(statusDeaf === statusMute) {
                messmin = ' звук и микрофон';
            } else if(statusDeaf){
                messmin = ' звук';
            } else {
                messmin = ' микрофон';
            }
            if(statusMute !== 0)
                message = this.wrapperUser(this.getUserName(newMember))+(statusMute < 0 ? " включил(а)" : " отключил(а)")+messmin;
            else
                message = this.wrapperUser(this.getUserName(newMember))+(statusDeaf < 0 ? " включил(а)" : " отключил(а)")+messmin;
        }
        if(message){
            let embed = new Discord.MessageEmbed()
                .setTimestamp(Date())
                .setTitle(message);
            if(!this.isLastUser(newMember)){
                embed.setAuthor(this.getUserName(newMember), newMember.user.avatarURL);
            }
            channel.send(embed);
        }
    }

    getUserName(member){
        if(member.displayName === member.user.username) {
            return member.displayName;
        } else {
            return member.displayName + ' ('+member.user.username+')';
        }
    }

    isLastUser(member){
        if(this.lastVoiceUser[member.guild.id]){
            if(this.lastVoiceUser[member.guild.id] === member.user.id) return true;
            else {
                this.lastVoiceUser[member.guild.id] = member.user.id;
                return false;
            }
        } else {
            this.lastVoiceUser[member.guild.id] = member.user.id;
            return false;
        }
    }

    messageAddInChannel(oldMember, newMember){
        return this.wrapperUser(this.getUserName(newMember))+" подключился к каналу "+this.wrapperChannel(newMember.voiceChannel.name)+"!";
    }

    messageOutChannel(oldMember, newMember){
        return this.wrapperUser(this.getUserName(newMember))+" отключился от канала "+this.wrapperChannel(oldMember.voiceChannel.name)+"!";
    }

    messageChangeChannel(oldMember, newMember){
        return this.wrapperUser(this.getUserName(newMember))+" перешел из канала "+this.wrapperChannel(oldMember.voiceChannel.name)+" в канал "+this.wrapperChannel(newMember.voiceChannel.name)+"!";
    }

    wrapperUser(text){
        return text;
    }

    wrapperChannel(text){
        return "\""+text+"\"";
    }
}

module.exports = VoiceLogger;
