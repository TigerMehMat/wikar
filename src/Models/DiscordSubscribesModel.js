const MainModel = require('./MainModel.js');

class DiscordSubscribesModel extends MainModel {
        constructor() {
                super();
        }

        getSubscribes() {
                return new Promise((resolve, reject) => {
                        this.query('SELECT ds.discord_id guild, dsub.channel, dsub.message, dsub.emoji, dsub.role_id\n' +
                                'FROM discord_subscribe dsub\n' +
                                         'LEFT JOIN discord_servers ds on dsub.guild = ds.id\n' +
                                'WHERE dsub.is_bad = 0')
                                .then(resolve)
                                .catch(reject);
                });
        }
}

module.exports = DiscordSubscribesModel;
