const MainModel = require('./MainModel.js');

class DiscordServersModel extends MainModel {
        constructor() {
                super();
        }

        /**
         * Получаем список серверов
         * @param servers
         * @return {Promise<unknown>}
         */
        getServers(servers = null) {
                return new Promise((resolve, reject) => {
                        let where = '';
                        if (servers !== null) {
                                if (!Array.isArray(servers)) {
                                        servers = [servers];
                                }
                                where = ' WHERE `discord_id` IN (' + servers.join(',') + ')';
                        }
                        this.query('SELECT * FROM discord_servers' + where)
                                .then(resolve)
                                .catch(reject);
                });
        }

        getRatesChannels() {
                return new Promise((resolve, reject) => {
                        this.query('SELECT off_rates_channel,discord_id FROM discord_servers WHERE off_rates_channel IS NOT NULL AND off_rates_channel <> \'DELETED\'')
                                .then((res) => {
                                        let rs = [];
                                        res.rows.forEach((el) => {
                                                let curRes = el.off_rates_channel.split(',');
                                                curRes.unshift(el.discord_id);
                                                rs.push(curRes);
                                        });
                                        resolve(rs);
                                })
                                .catch(reject);
                });
        }

        setNewServerNameByServerId(serverId, name) {
                return new Promise((resolve, reject) => {
                        this.query('UPDATE discord_servers SET last_name = $1 WHERE discord_id= $2', [name, serverId])
                                .then((res) => {
                                        resolve(res);
                                })
                                .catch(reject);
                });
        }

        deleteRatesAlertByServerId(serverId) {
                return new Promise((resolve, reject) => {
                        this.query(`UPDATE discord_servers SET off_rates_channel = 'DELETED' WHERE discord_id = $1`, [serverId])
                                .then((res) => {
                                        resolve(res);
                                })
                                .catch(reject);
                });
        }

        /**
         * @typedef ActiveServerData
         * @property rates {string}
         * @property tribe_functions {boolean}
         */

        /**
         *
         * Проверяет, активен ли текущий сервер.
         * @param {string} serverId
         * @param {string} channelId
         * @param {'active'|'bm'} type
         * @returns {Promise<ActiveServerData>}
         */
        isActiveServer(serverId, channelId, type = 'active') {
                return new Promise((resolve, reject) => {
                        let field = '';
                        let where = '';
                        switch (type) {
                                case 'active':
                                        field = 'ark_active_to';
                                        where = '(active_channel= $2 OR active_channel=\'*\')';
                                        break;
                                case 'bm':
                                        field = 'bm_active_to';
                                        where = 'bm_channel = $2';
                                        break;
                                default:
                                        reject(new Error('Unknown active type'));
                                        return;
                        }
                        this.query(`SELECT tribe_functions, prefix, rates, id FROM discord_servers WHERE ${field} >= NOW() AND discord_id= $1 AND ${where} LIMIT 1`, [serverId, channelId])
                                .then((res) => {
                                        res = res.rows;
                                        if (!(res.length > 0)) return false;
                                        res = res[0];
                                        res.rates = JSON.parse(res.rates);
                                        res.rates = this.calcRates(res.rates);
                                        resolve(res);
                                })
                                .catch(reject);
                });
        }

        calcRates(rates) {
                if (typeof rates['default'] === "undefined") rates['default'] = 1;
                const defaultRates = [
                        'TamingSpeedMultiplier',
                        'HarvestAmountMultiplier',
                        'XPMultiplier',
                        'MatingIntervalMultiplier',
                        'BabyMatureSpeedMultiplier',
                        'EggHatchSpeedMultiplier',
                        'CropGrowthSpeedMultiplier',
                        'CustomRecipeEffectivenessMultiplier',
                        'OverrideOfficialDifficulty',
                ];
                defaultRates.forEach(function (i) {
                        if (typeof rates[i] === "undefined") rates[i] = rates['default'];
                });
                return rates;
        }

        getRateChannels() {
                return new Promise((resolve, reject) => {
                        this.query('select discord_id guild, off_rates_channel channel\n' +
                                'from discord_servers\n' +
                                'where off_rates_channel is not null\n' +
                                '  and ark_active_to > NOW()')
                                .then(resolve)
                                .catch(reject);
                });
        }

        getVoiceSets(channel_id) {
                return new Promise((resolve, reject) => {
                        this.query(`SELECT *
                                    FROM t_voice_text_channel
                                    WHERE discord_voice_channel = $1
                                    LIMIT 1`,[String(channel_id)])
                                .then((res) => {
                                        resolve(res.rows && res.rows[0]);
                                })
                                .catch(reject);
                });
        }
}

module.exports = DiscordServersModel;
