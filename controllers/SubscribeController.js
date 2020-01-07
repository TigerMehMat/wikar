const DiscordSubscribesModel = new (require('../Models/DiscordSubscribesModel'));
const Discord = require('discord.js');

class SubscribeController {
        /**
         * Конструктор
         */
        constructor() {
                let instance = this;
                DiscordSubscribesModel.getSubscribes()
                        .then((res) => {
                                instance.subscribeInfo = res;
                                if (instance.runAfterLoad) instance.activateNow();
                        })
                        .catch(console.error);
        }

        activate(client) {
                this.client = client;
                if (!this.subscribeInfo) this.runAfterLoad = true;
                else this.activateNow();
        }

        /**
         * Активация и запуск основых систем слежки
         */
        activateNow() {
                let instance = this;
                this.subscribeInfo.forEach((el) => {
                        let guild = this.client.guilds.get(el.guild);
                        let channel = guild.channels.get(el.channel);
                        channel.fetchMessage(el.message)
                                .then(message => {
                                        // Вешаем события
                                        let filter = instance.getFinder([el.emoji, '❌']);
                                        let collector = message.createReactionCollector(filter);
                                        collector.on('collect', (res) => {
                                                let user = res.users.last();
                                                if (res.emoji.name === '❌') {
                                                        instance.unsubscribe(message, user, el.emoji, el.role_id);
                                                } else {
                                                        instance.subscribe(message, user, el.role_id)
                                                }
                                        });

                                        // Восстанавливаем реакции на сообщении, если их нет
                                        message.react(el.emoji)
                                                .catch(console.error);
                                        message.react('❌')
                                                .catch(console.error);

                                        // Удаляем подписки, если они накопились
                                        let closeReaction = message.reactions.find(reaction => reaction.emoji.name === '❌');
                                        if(closeReaction) {
                                                closeReaction.fetchUsers()
                                                        .then(res => {
                                                                res = res.filter(user => user.bot === false);
                                                                res.forEach((user) => {
                                                                        instance.unsubscribe(message, user, el.emoji, el.role_id);
                                                                });
                                                        })
                                                        .catch(console.error);
                                        }
                                })
                                .catch(console.error);
                });
        }

        unsubscribe(message, user, emoji, role) {
                return new Promise((resolve, reject) => {
                        let currentReaction = message.reactions.find(reaction => reaction.emoji.name === emoji);
                        let deleteReaction = message.reactions.find(reaction => reaction.emoji.name === '❌');
                        let member = message.guild.member(user);
                        member.removeRole(role)
                                .then(() => {
                                        return currentReaction.remove(user.id);
                                })
                                .then(() => {
                                        return deleteReaction.remove(user.id);
                                })
                                .then(resolve)
                                .catch(reject);
                })
        }

        subscribe(message, user, role) {
                let member = message.guild.member(user);
                if(member) {
                        member.addRole(role)
                                .catch(console.error);
                }
        }

        /**
         * Фильтр
         * @param {string[]} emoji Искомая эмодзи
         * @return {function(string, *): boolean}
         */
        getFinder(emoji) {
                return (reaction, user) => {
                        return emoji.indexOf(reaction.emoji.name) !== -1 && !user.bot;
                };
        }
}

module.exports = SubscribeController;
