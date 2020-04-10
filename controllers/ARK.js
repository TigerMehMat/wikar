const ARK_api = require('./GlobalControllers/ARK_api');
const Discord = require('discord.js');
const access    = require('./GlobalControllers/access');

const GlobalVarsModel       = new (require('../Models/GlobalVarsModel'));
const DiscordServersModel   = new (require('../Models/DiscordServersModel'));

class ARK extends ARK_api {
    constructor(client){
        super();
        this.client = client;
    }

    async start() {
        this.rates = JSON.parse(await GlobalVarsModel.getItem('rates'));

        this.rateByType = {
            TamingSpeedMultiplier: 'Приручение',
            HarvestAmountMultiplier: 'Сбор ресурсов',
            XPMultiplier: 'Опыт',
            MatingIntervalMultiplier: 'Интервал спаривания',
            BabyMatureSpeedMultiplier: 'Скорость взросления',
            EggHatchSpeedMultiplier: 'Скорость инкубации / беременности',
            CropGrowthSpeedMultiplier: 'Скорость роста овощей и ягоды',
            CustomRecipeEffectivenessMultiplier: 'Эффективность пользовательских рецептов'
        };
        await this.getChannelsAndMessages();
    }

    updater() {
        return new Promise(async () => {
            while (1) {
                try {
                    await this.update();
                } catch (e) {
                    DiscordAlarm.send('Не обновляется логгер ARK')
                        .catch(console.error);
                    console.error(e);
                }
                await this.timeout(1000 * 60 * 3); // 3 минуты
            }
        });
    }

    update() {
        return new Promise(async (resolve, reject) => {
            let checkRes    = await this.check();
            if(checkRes) {
                await this.sendLog(checkRes);
            }
            await this.editStats();
            resolve();
        });
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getChannelsAndMessages() {
        const currentInfo   = await DiscordServersModel.getRatesChannels();
        this.info           = {};
        for(let i=0; i < currentInfo.length; i++) {
            this.info[currentInfo[i][0]]    = {channel: currentInfo[i][1]};
        }
    }

    async check(){
        let newRates;
        try {
            newRates = await ARK_api.getRates();
        } catch (e) {
            console.error('Error get ark_api');
            console.error(e);
            return;
        }
        let changedRates = {};
        let changes = 0;
        GlobalVarsModel.setItem('rates', JSON.stringify(newRates)).catch(console.error);
        for(let rate in this.rates) {
            if(newRates[rate] !== this.rates[rate]){
                changedRates[rate] = {"old": this.rates[rate], "new": newRates[rate]};
                changes++;
            }
        }
        if(changes === 0) return false;
        this.rates = newRates;
        return changedRates;
    }

    async sendLog(changedRates){
        for (let j in this.info) {
            let guild   = this.client.guilds.cache.get(j);
            let channel = guild.channels.cache.get(this.info[j].channel);
            let text = '';
            for (let i in changedRates) {
                text += this.rateByType[i] + ': ' + changedRates[i].old + ' → ' + changedRates[i].new + '\n';
            }
            let roleId = ARK.getRoleId(guild);
            let roleText = roleId ? '<@&' + roleId + '>' : '';
            let embed = new Discord.MessageEmbed()
                .setTitle('Изменение множителей')
                .setTimestamp(Date.now())
                .setFooter((new Date()).toTimeString())
                .setDescription(text);
            await channel.send(roleText, embed);
            await this.timeout(3000);
        }
    }

    async editStats(){
        for(let j in this.info) {
            let guild   = this.client.guilds.cache.get(j);
            if(!guild) {
                console.error("Guild "+j+" not found for ARK api");
                continue;
            }

            let channel = guild.channels.cache.get(this.info[j].channel);
            if(!channel) return;
            let messages    = await this.fetchAllMessagesByAuthor(channel, this.client.user.id, 1);

            let res         = messages[0];

            let text = '';
            for (let i in this.rates) {
                text += this.rateByType[i] + ' = ' + this.rates[i] + '\n';
            }
            let embed = new Discord.MessageEmbed()
                .setTitle('Множители официальных серверов')
                .setTimestamp(Date.now())
                .setFooter((new Date()).toTimeString())
                .setDescription(text);
            try {
                if (res) {
                    await res.edit(embed);
                } else {
                    await channel.send(embed);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    getFirstIdInChannel(channel, firstID = null) {
        return new Promise((resolve, reject) => {
            let options	= { limit: 100 };
            if(firstID) {
                options.before	= firstID;
            }
            channel.fetchMessages(options)
                .then(msgs	=> {
                    if(msgs.size === 0) resolve(false);
                    else {
                        this.getFirstIdInChannel(channel, msgs.last().id)
                            .then(res => {
                                if(!res)	resolve(msgs.last().id);
                                else		resolve(res);
                            })
                            .catch(reject);
                    }
                })
                .catch(reject)
        });
    }
    fetchAllMessagesByAuthor(channel, author, limit = 50, firstID = null){
        return new Promise((resolve, reject) => {
            let options	= { limit: 100 };
            if(firstID) {
                options.after	= firstID;
            }
            channel.messages.fetch(options)
                .then(msgs	=> {
                    if(msgs.size === 0) resolve(false);
                    let currentMessages	= msgs.filter(m => m.author.id === author && !m.system);

                    if(currentMessages.size >= limit || msgs.size < 100) resolve(currentMessages.last(limit));
                    else {
                        this.fetchAllMessagesByAuthor(channel, author, limit - currentMessages.size, msgs.last().id)
                            .then(moreMessages	=> {
                                if(!moreMessages) resolve(currentMessages);
                                else {
                                    resolve(new Discord.Collection().concat(currentMessages, moreMessages));
                                }
                            })
                            .catch(reject);
                    }
                })
                .catch(reject);
        });
    }

    static getRoleId(guild) {
        let roles = guild.roles;
        let myRole  = roles.cache.find(val => val.name === 'множители');
        if(myRole) return myRole.id;
        return false;
    }
}

module.exports = ARK;
