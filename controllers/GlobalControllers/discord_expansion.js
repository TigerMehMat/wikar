const Discord	= require("discord.js");

class DE {
	static fetchAllMessagesByAuthor(channel, author, limit = 50, isPinned = 0, firstID = null){
		return new Promise( async (resolve, reject) => {
			let options	= { limit: 100 }, msgs;
			if(firstID) {
				options.after	= firstID;
			}
			if(isPinned === 1) {
				msgs	= await channel.fetchPinnedMessages();
			} else {
				msgs	= await channel.fetchMessages(options);
			}

			/* Если нет сообщений, возвращаем false */
			if(!msgs || msgs.size === 0) {
				reject(false);
				return;
			}

			let messageFilter			= m => m.author.id === author && !m.system;
			let messagePinnedFilter		= m => m.author.id === author && !m.system && m.pinned === true;
			let messageUnpinnedFilter	= m => m.author.id === author && !m.system && m.pinned === false;

			if(isPinned === -1)	messageFilter	= messageUnpinnedFilter;
			if(isPinned === 1)	messageFilter	= messagePinnedFilter;

			let currentMessages	= msgs.filter(messageFilter);

			/* Если набрано достаточно сообщений, возвращаем их */
			if(currentMessages.size >= limit) {
				resolve(currentMessages.last(limit));
				return;
			}

			let moreMessages	= this.fetchAllMessagesByAuthor(channel, author, limit - currentMessages.size, msgs.last().id);

			if(!moreMessages){
				resolve(currentMessages);
				return;
			}
			resolve(new Discord.Collection().concat(currentMessages, moreMessages));
		});
	}

	static async pinAllMessages(messages) {
		for(let message in messages) {
			await message.pin();
		}
	}

	static async fetchMessagesForLog(channel, author, limit = 50) {
		let pinnedMessages	= this.fetchAllMessagesByAuthor(channel, author, limit, 1);
		if(pinnedMessages.size < limit) {
			let newMessages	= this.fetchAllMessagesByAuthor(channel, author, limit, -1);
			await this.pinAllMessages(newMessages);
			pinnedMessages	= pinnedMessages.concat(newMessages);
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

	/* Получить заведомо N сообщений из канала и, если их меньше чем надо, записать. */
	static async getMessagesForLog(channel, author, quantity) {
		let pinnedMessages	= await this.fetchAllMessagesByAuthor(channel, author, quantity, 1);
		console.log(pinnedMessages);
		console.log(pinnedMessages[0].createdTimestamp);
		console.log(pinnedMessages[pinnedMessages.length-1].createdTimestamp);
		console.log(this.getLastMessageId(pinnedMessages));
	}

	static getLastMessageId(messages) {
		let lastId			= false;
		let biggerTimestamp	= 0;
		messages.forEach((msg) => { if(msg.createdTimestamp > biggerTimestamp) { biggerTimestamp = msg.createdTimestamp; lastId = msg.id } });
		return lastId;
	}
}

module.exports	= DE;