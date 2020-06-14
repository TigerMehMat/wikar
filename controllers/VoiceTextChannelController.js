const DiscordServersModel = require('../Models/DiscordServersModel');

/**
 * Самостоятельный контроллер, работающий без команд
 */
class VoiceTextChannelController {
        oldMember;
        newMember;
        serversModel = new DiscordServersModel();

        constructor(oldMember, newMember) {
                this.oldMember = oldMember;
                this.newMember = newMember;
        }

        async checkVoiceTexts() {
                if(this.oldMember.channelID === this.newMember.channelID) return;
                await this.missChannel();
                await this.addToChannel();
        }

        async missChannel() {
                const sets = await this.serversModel.getVoiceSets(this.oldMember.channelID);
                if(!sets) return;
                await this.oldMember.member.roles.remove(sets.role, 'Покинул(а) голосовой канал');
        }

        async addToChannel() {
                const sets = await this.serversModel.getVoiceSets(this.newMember.channelID);
                if(!sets) return;
                await this.newMember.member.roles.add(sets.role, 'Зашел(ла) в голосовой канал');
        }
}

module.exports = VoiceTextChannelController;