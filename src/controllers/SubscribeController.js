const DiscordSubscribesModel = new (require('../Models/DiscordSubscribesModel.js'));

class SubscribeController {
        /**
         * Конструктор
         */
        constructor() {
                let instance = this;
                DiscordSubscribesModel.getSubscribes()
                        .then((res) => {
                                instance.subscribeInfo = res.rows;
                                if (instance.runAfterLoad) instance.activateNow();
                        })
                        .catch(console.error);
        }

        /**
         * Активация подписок
         * @param client
         */
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
                        let guild = this.client.guilds.cache.get(el.guild);

                        if (!guild) return;

                        let channel = guild.channels.cache.get(el.channel);

                        if (!channel) return;

                        channel.messages.fetch(el.message)
                                .then(message => {
                                        // Вешаем события
                                        let filter = instance.getFinder([el.emoji, '❌']);
                                        let collector = message.createReactionCollector(filter);
                                        collector.on('collect', (res, user) => {
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
                                        let closeReaction = message.reactions.cache.find(reaction => reaction.emoji.name === '❌');
                                        if(closeReaction) {
                                                closeReaction.users.fetch()
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

        /**
         * Отписать
         * @param message Сообщение
         * @param user Юзер
         * @param emoji Эмоция
         * @param role Роль
         * @return {Promise<unknown>}
         */
        unsubscribe(message, user, emoji, role) {
                return new Promise((resolve, reject) => {
                        let currentReaction = message.reactions.cache.find(reaction => reaction.emoji.name === emoji);
                        let deleteReaction = message.reactions.cache.find(reaction => reaction.emoji.name === '❌');
                        let member = message.guild.member(user);
                        member.roles.remove(role)
                                .then(() => {
                                        return currentReaction.users.remove(user.id);
                                })
                                .then(() => {
                                        return deleteReaction.users.remove(user.id);
                                })
                                .then(resolve)
                                .catch(reject);
                })
        }

        /**
         * Подписать
         * @param message Объект сообщения
         * @param user Юзер
         * @param {string} role Название роли
         */
        subscribe(message, user, role) {
                let member = message.guild.member(user);
                if(member) {
                        member.roles.add(role)
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
