const Timer = require('./Timer.js');

class SenderReactions {
        constructor() {
                this.stoped = false;
                this.message = undefined;
                this.reactions = undefined;
        }

        setMessage(message) {
                this.message = message;
                return this;
        }

        setReactions(reactions) {
                this.reactions = reactions;
                return this;
        }

        stop() {
                this.stoped = true;
                return this;
        }

        async execute() {
                for (let i = 0; i < this.reactions.length; i++) {
                        if (this.stoped) break;
                        await this.message.react(this.reactions[i]);
                }
                return this;
        }
}

class DiscordHelper {
        static reactionsSender() {
                return new SenderReactions();
        }

        /**
         * N сообщений автора в канале
         * @param channel string ID канала
         * @param author string ID автора
         * @param limit integer Количество требуемых сообщений
         * @param isPinned integer Искать во всех (0) в закрепленных (1) или только в не закрепленных (-1)
         * @param firstID string id сообщения, начиная с которого искать (не включает это сообщение)
         * @returns {Promise<Array>}
         */
        static fetchAllMessagesByAuthor(channel, author, limit = 50, isPinned = 0, firstID = null) {
                return new Promise(async (resolve, reject) => {
                        let options = {limit: 100}, msgs;
                        if (firstID) {
                                options.after = firstID;
                        }
                        if (isPinned === 1) {
                                msgs = await channel.messages.fetchPinned();
                        } else {
                                msgs = await channel.messages.fetch(options);
                        }

                        /* Если нет сообщений, возвращаем false */
                        if (!msgs || msgs.size === 0) {
                                reject(false);
                                return;
                        }

                        let messageFilter = m => m.author.id === author && !m.system;
                        let messagePinnedFilter = m => m.author.id === author && !m.system && m.pinned === true;
                        let messageUnpinnedFilter = m => m.author.id === author && !m.system && m.pinned === false;

                        if (isPinned === -1) messageFilter = messageUnpinnedFilter;
                        if (isPinned === 1) messageFilter = messagePinnedFilter;

                        let currentMessages = msgs.filter(messageFilter);

                        /* Если набрано достаточно сообщений, возвращаем их */
                        if (currentMessages.size >= limit) {
                                resolve(currentMessages.last(limit));
                                return;
                        }

                        let moreMessages = await this.fetchAllMessagesByAuthor(channel, author, limit - currentMessages.size, msgs.last().id);

                        if (!moreMessages) {
                                resolve(currentMessages.array());
                                return;
                        }
                        currentMessages = currentMessages.array();
                        currentMessages = currentMessages.concat(moreMessages);
                        resolve(currentMessages);
                });
        }

        /**
         * Закрепить все сообщения
         * @param messages array Сообщения для закрепления
         * @returns {Promise<void>}
         */
        static async pinAllMessages(messages) {
                for (let message in messages) {
                        await message.pin();
                }
        }

        static async fetchMessagesForLog(channel, author, limit = 50) {
                let pinnedMessages = this.fetchAllMessagesByAuthor(channel, author, limit, 1);
                if (pinnedMessages.size < limit) {
                        let newMessages = this.fetchAllMessagesByAuthor(channel, author, limit, -1);
                        await this.pinAllMessages(newMessages);
                        pinnedMessages = pinnedMessages.concat(newMessages);
                }
                return pinnedMessages;
        }

        /* Найти первое сообщение в канале */

        /*static fetchFirstMessage(channel, firstID = null) {
            return new Promise((resolve, reject) => {
                let options	= { limit: 100 };
                if(firstID) {
                    options.before	= firstID;
                }
                channel.fetchMessages(options)
                    .then(msgs	=> {
                        if(msgs.size === 0) resolve(false);
                        else {
                            this.fetchFirstMessage(channel, msgs.last().id)
                                .then(res => {
                                    if(!res)	resolve(msgs.last().id);
                                    else		resolve(res);
                                })
                                .catch(reject);
                        }
                    })
                    .catch(reject)
            });
        }*/

        /**
         * Получить заведомо N сообщений из канала и, если их меньше чем надо, отправить в канал и вернуть их id.
         * @param channel MessageChannel Объект канала
         * @param author string ID автора
         * @param quantity number Количество сообщений
         * @returns {Promise<array>}
         */
        static async getMessagesForLog(channel, author, quantity) {

                let messagesArray = [];

                let pinned = await this.fetchAllMessagesByAuthor(channel, author, quantity, 1);

                // Находим все закрепленные сообщения
                messagesArray = messagesArray.concat(pinned);

                if (messagesArray.length !== 0) {
                        // Находим последнее по времени из закрепленных сообщение
                        let lastMessageId = this.getLastMessageId(messagesArray);
                        let unpinnedMessages = await channel.messages.fetch({limit: quantity, before: lastMessageId});
                        unpinnedMessages = unpinnedMessages.filter(m => m.author.id === author).array();
                        messagesArray = messagesArray.concat(unpinnedMessages);
                        messagesArray = messagesArray.slice(0, quantity);
                }

                if (messagesArray.length === quantity) {
                        return messagesArray;
                }

                for (let i = 0; i < quantity - messagesArray.length; i++) {
                        let mess = await channel.send('Message for Bot. Сообщение для Бота.');
                        messagesArray.push(mess);
                        await this.wait(2000);
                }

                return messagesArray;
        }

        /**
         * Последнее по дате создания сообщение
         * @param messages array Массив сообщений
         * @returns number|boolean id последнего сообщения или false, если нет такого
         */
        static getLastMessageId(messages) {
                if (messages.length === 0) return false;
                let lastId = false;
                let biggerTimestamp = 0;
                messages.forEach((msg) => {
                        if (msg.createdTimestamp > biggerTimestamp) {
                                biggerTimestamp = msg.createdTimestamp;
                                lastId = msg.id;
                        }
                });
                return lastId;
        }

        /**
         * Подождать N секунд (использовать с await)
         * @param time integer Милисекунды
         * @returns {Promise<void>}
         */
        static wait(time) {
                return new Promise((resolve) => {
                        setTimeout(resolve, time);
                });
        }


        /**
         *
         * @param {number} time
         * @return {string}
         */
        static getTime(time) {
                if (isNaN(time)) return '&nbsp;';
                time = Math.floor(time);
                if (time < 1) return '< 1 сек';
                return Timer.timeFormat(time, false);
        }
}

module.exports = DiscordHelper;
