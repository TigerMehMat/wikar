const ARK_api = require('./GlobalControllers/ARK_api');
const Discord = require('discord.js');
const access    = require('./GlobalControllers/access');

const DB_disc        = require('./DB/discord_servers');
const db_dis        = new DB_disc();

class ARK extends ARK_api {
    constructor(client){
        super();
        this.client = client;
        this.rates = {
            TamingSpeedMultiplier: '1.0',
            HarvestAmountMultiplier: '1.0',
            XPMultiplier: '1.0',
            MatingIntervalMultiplier: '1.0',
            BabyMatureSpeedMultiplier: '1.0',
            EggHatchSpeedMultiplier: '1.0',
            CropGrowthSpeedMultiplier: '1.0',
            CustomRecipeEffectivenessMultiplier: '1.0'
        };

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

        this.getChannelsAndMessages();
    }

    update(firstUse = false) {
        return new Promise((resolve, reject) => {
            this.check()
                .then((res)=>{
                    if(res && !firstUse) {
                        this.sendLog(res);
                    }
                    this.editStats()
                        .then(() => {
                            resolve();
                            setTimeout(() => {
                                this.update()
                                    .catch(console.error)
                            }, 180000);
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    async getChannelsAndMessages() {
        const currentInfo   = await db_dis.getRatesChannels();
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

    sendLog(changedRates){
        for (let j in this.info) {
            let guild   = this.client.guilds.get(j);
            let channel = guild.channels.get(this.info[j].channel);
            let text = '';
            for (let i in changedRates) {
                text += this.rateByType[i] + ': ' + changedRates[i].old + ' → ' + changedRates[i].new + '\n';
            }
            let roleId = ARK.getRoleId(guild);
            let roleText = roleId ? '<@&' + roleId + '>' : '';
            let embed = new Discord.RichEmbed()
                .setTitle('Изменение множителей')
                .setTimestamp(Date.now())
                .setFooter((new Date()).toTimeString())
                .setDescription(text);
            channel.send(roleText, embed)
                .catch(console.error);
        }
    }

    async editStats(){
        for(let j in this.info) {
            let guild   = this.client.guilds.get(j);
            if(!guild) {
                console.error("Guild "+j+" not found for ARK api");
                continue;
            }

            let channel = guild.channels.get(this.info[j].channel);
            if(!channel) return;
            let messages    = await this.fetchAllMessagesByAuthor(channel, this.client.user.id, 1);

            let res         = messages[0];

            let text = '';
            for (let i in this.rates) {
                text += this.rateByType[i] + ' = ' + this.rates[i] + '\n';
            }
            let embed = new Discord.RichEmbed()
                .setTitle('Множители официальных серверов')
                .setTimestamp(Date.now())
                .setFooter((new Date()).toTimeString())
                .setDescription(text);
            if(res) {
                res.edit(embed)
                    .catch(console.error);
            } else {
                channel.send(embed)
                    .catch(console.error);
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
            channel.fetchMessages(options)
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
        let myRole  = roles.find(val => val.name === 'множители');
        if(myRole) return myRole.id;
        return false;
    }

    static getRoleToMe(message, args){
        if(!access.isAccess(message)) return;
        let roleId  = this.getRoleId(message.guild);
        if(!roleId) return;
        let isRole  = !('roles' in message.member) ? false : message.member.roles.find(value => value.id === roleId);
        if(isRole) {
            message.member.removeRole(isRole)
                .then(function(){ message.reply('Роль для оповещения о множителях была с Вас снята, Вас более не будут упоминать при изменении множителей.'); })
                .catch(function(){console.error("Роль не может быть удалена")})
        } else {
            message.member.addRole(roleId)
                .then(function(){ message.reply('Роль для оповещения о множителях была Вам присвоена, теперь Вы получите оповещение при изменении множителей на __официальных серверах__.'); })
                .catch(function(){console.error("Роль не может быть поставлена")})
        }
    }

    async initGetRates() {
        let messages    = this.fetchAllMessagesByAuthor(channel, this.client.user.id, 2);

    }
/*
    firstStart(){
        let guild = this.client.guilds.get('304855554705063936');
        guild.channels.get('566280273398988832').send('Hi!');
    }

*/
}

module.exports = ARK;
