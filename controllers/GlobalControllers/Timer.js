const Discord = require('discord.js');
const staticTextModule = require('./staticTextModule');
const config = require('../../configbot');

class Timer {
        static controller(message, args) {
                if (!staticTextModule.isAccess(message, config.accessFotTribe)) return;

                if (isNaN(+args[0])) {
                        message.channel.send('Укажите время...');
                        return;
                }
                let timer = args.shift();
                let title = (typeof args[0] != 'undefined') ? args.join(' ') : 'Таймер';
                Timer.startTimer(message, timer, {
                        'title': title
                })
        }

        static startTimer(message, timer, custumoptions = {}) {
                let options = {
                                'title': 'Таймер',
                                'body': (timer) => {
                                        return 'Закончится через через ' + timer + ' мин';
                                },
                        },
                        timerMessage = null;
                let intervalTimer;
                Object.assign(options, custumoptions);
                if (!options.end)
                        options.end = 'Время таймера "' + options.title + '" закончилось!';
                this.sendMessage(options.title, options.body(timer), message, true, (msg) => {
                        timerMessage = msg;
                        let reactionFilter = (reaction, user) => {
                                return reaction.emoji.name === '🛑' && !user.bot;
                        };
                        timerMessage.awaitReactions(reactionFilter, {max: 1, time: timer * 60 * 1000, errors: ['time']})
                                .then((res) => {
                                        clearInterval(intervalTimer);
                                        this.sendMessage('Таймер отменен', 'Пользователь ' + res.find((reac) => {
                                                return reac.me === true
                                        }).users.last().username + ' отменил таймер "' + options.title + '"', timerMessage, false, () => {
                                                return;
                                        });
                                        timerMessage.reactions.removeAll()
                                                .catch(console.error);
                                })
                                .catch((res) => {
                                        if (!(res instanceof Discord.Collection))
                                                console.error(res + 'error instanceof');
                                });
                        timerMessage.react('🛑')
                                .catch(console.error)
                });

                intervalTimer = setInterval(() => {
                        timer--;
                        if (timer < 1) {
                                clearInterval(intervalTimer);
                                timerMessage.delete()
                                        .then(() => {
                                                timerMessage.channel.send(options.end);
                                        });
                        } else {
                                Timer.sendMessage(options.title, options.body(timer), timerMessage);
                        }
                }, 60000);
        }

        static sendMessage(title, text, msg, newMessage, callback) {
                let embed = new Discord.MessageEmbed()
                        .setTitle(title)
                        .setDescription(text);
                if (newMessage) {
                        msg.channel.send(embed)
                                .then(callback)
                                .catch(console.error);
                } else {
                        msg.edit(embed)
                                .catch(console.error);
                }
        }

        /**
         * Форматирование даты
         * @param {number} sec
         * @param {boolean} nules
         * @return {string}
         */
        static timeFormat(sec, nules = true) {
                let y = Math.floor(sec / 31536000);
                let d = Math.floor((sec - y * 31536000) / 86400);
                let h = Math.floor((sec - y * 31536000 - d * 86400) / 3600);
                let m = Math.floor((sec - y * 31536000 - d * 86400 - h * 3600) / 60);
                let s = Math.floor(sec - y * 31536000 - d * 86400 - h * 3600 - m * 60);
                let res = '';
                if (y !== 0) {
                        res += y + " г. ";
                }
                if (d !== 0 || (y > 0 && h + m + s > 0)) {
                        res += d + " дн. ";
                }
                if (h !== 0 || (y + d > 0 && m + s > 0)) {
                        res += h + " ч. ";
                }
                if (m !== 0 || (y + d + h > 0 && s > 0)) {
                        res += m + " мин. ";
                }
                if (s !== 0) {
                        res += s + " сек. ";
                }
                return res;
        }
}

module.exports = Timer;
