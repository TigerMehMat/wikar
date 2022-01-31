const Discord	= require('discord.js');


class DiscordAlarm {
	constructor() {
	}

	/**
	 * Устанавливаем запущенный клиент
	 * @param clientObject
	 * @return {Promise<DiscordAlarm>}
	 */
	async setClient(clientObject) {
		this.alarmUser	= await clientObject.users.fetch('271339139679387648');
		if(!this.alarmUser) {
			console.error('Не удалось получить юзера-администратора');
		}
		return this;
	}

	/**
	 * Сообщение о критическо ошибке / сбое в работе фоновых систем
	 * @param {string} message
	 * @returns {Promise<void>}
	 */
	send(message) {
		return new Promise((resolve, reject) => {
			this.alarmUser.send(message)
				.then(resolve)
				.catch(reject);
		});
	}
}

module.exports	= DiscordAlarm;