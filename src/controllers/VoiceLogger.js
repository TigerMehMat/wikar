const Discord = require("discord.js");

class VoiceLogger {
    constructor(){
        this.lastVoiceUser = {};
    }

    voiceChanged(oldState, newState){
        let message = '';
        let channel = newState.guild.channels.cache.find(ch => { return ch.name === 'лог'; });
        if(!channel) return;
        if(oldState.channelID!==newState.channelID){

            if(!oldState.channelID){
                message = this.messageAddInChannel(oldState, newState);
            } else if(!newState.channelID){
                message = this.messageOutChannel(oldState, newState);
            } else {
                message = this.messageChangeChannel(oldState, newState);
            }

        } else if(oldState.selfDeaf !== newState.selfDeaf) {
            // oldState.selfMute !== newState.selfMute
            let statusMute = -oldState.selfMute +newState.selfMute;
            let statusDeaf = -oldState.selfDeaf +newState.selfDeaf;
            let messmin = '';
            if(statusDeaf === statusMute) {
                messmin = ' звук и микрофон';
            } else if(statusDeaf){
                messmin = ' звук';
            } else {
                messmin = ' микрофон';
            }
            if(statusMute !== 0)
                message = this.wrapperUser(this.getUserName(newState))+(statusMute < 0 ? " включил(а)" : " отключил(а)")+messmin;
            else
                message = this.wrapperUser(this.getUserName(newState))+(statusDeaf < 0 ? " включил(а)" : " отключил(а)")+messmin;
        }
        if(message){
            let embed = new Discord.MessageEmbed()
                .setTimestamp(Date.now())
                .setTitle(message);
            if(!this.isLastUser(newState)){
                embed.setAuthor(this.getUserName(newState), newState.member.user.avatarURL());
            }
            channel.send(embed);
        }
    }

    getUserName(state){
        let member = state.member;
        if(member.displayName === member.user.username) {
            return member.displayName;
        } else {
            return member.displayName + ' ('+member.user.username+')';
        }
    }

    isLastUser(state){
        let member = state.member;
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

    messageAddInChannel(oldState, newState){
        return this.wrapperUser(this.getUserName(newState))+" подключился к каналу "+this.wrapperChannel(newState.channel.name)+"!";
    }

    messageOutChannel(oldState, newState){
        return this.wrapperUser(this.getUserName(newState))+" отключился от канала "+this.wrapperChannel(oldState.channel.name)+"!";
    }

    messageChangeChannel(oldState, newState){
        return this.wrapperUser(this.getUserName(newState))+" перешел из канала "+this.wrapperChannel(oldState.channel.name)+" в канал "+this.wrapperChannel(newState.channel.name)+"!";
    }

    wrapperUser(text){
        return text;
    }

    wrapperChannel(text){
        return "\""+text+"\"";
    }
}

module.exports = VoiceLogger;
