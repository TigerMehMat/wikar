const Discord	= require('discord.js');


class DiscordAlarm {
	/**
	 *
	 * @param {Discord/Client} clientObject запущенный клиент
	 */
	constructor(clientObject) {
		this.alarmUser	= clientObject.users.find(user => user.id === '271339139679387648');
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