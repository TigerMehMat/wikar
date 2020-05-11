let Updater = require('./GlobalControllers/updater');

const ARK_api = require('./GlobalControllers/ARK_api');
const Discord = require('discord.js');

const GlobalVarsModel = new (require('../Models/GlobalVarsModel'));

class VersionUpdater extends Updater {
        async runFunction() {
                await super.runFunction();
                let last_version = await GlobalVarsModel.getItem('game_version');
                let current_version = await ARK_api.getCurrentVersion();

                if (current_version && String(current_version) !== String(last_version)) {
                        let embed = (new Discord.MessageEmbed())
                                .setDescription('Изменилась версия игры: ' + last_version + ' → ' + current_version);
                        await GlobalVarsModel.setItem('game_version', current_version);
                        await this.sendLog(embed);
                }
        }
}

module.exports = VersionUpdater;