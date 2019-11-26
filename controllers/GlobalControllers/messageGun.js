// разработка остановлена ввиду неожиданного поведения при передаче функции объекта.
// одно из возможных решений: передать объект и указать какую функцию запустить.

let messagesList		= [];
let priorityMessageList	= [];
let isActive			= false;
const Discord			= require('discord.js');

class MessageGun {
	/**
	 * Лениво отправляет сообщения
	 * @param {function} func
	 * @param {string|Discord<RichEmbed>} message
	 * @param {'normal'|'high'} priority
	 * @param {'last','first'} place
	 * @returns {Promise<unknown>}
	 */
	static send(func, message, priority = 'normal', place = 'last') {
		console.log('Вызван сенд гана');
		return new Promise((resolve, reject) => {
			let currentList	= messagesList;

			switch (priority) {
				case "normal":
					currentList	= messagesList;
					break;
				case "high":
					currentList	= priorityMessageList;
					break;
			}

			currentList.push({func: func, message: message, resolve: resolve, reject: reject});
			this.messageRun();
		});
	}

	/**
	 * Запуск сообщений
	 */
	static messageRun() {
		console.log('Вызван ран гана');
		if(isActive === true) return;
		if(messagesList.length === 0 && priorityMessageList.length === 0) {
			console.log('Ган закончил работу');
			isActive = false;
			return;
		}
		console.log('Ган работает');
		isActive = true;
		let currentList		= (priorityMessageList.length > 0) ? priorityMessageList : messagesList;
		console.log(currentList);
		let currentMessage	= currentList.shift();

		console.log(currentMessage);
		console.log(currentMessage.func);

		currentMessage.func(currentMessage.message)
			.then(currentMessage.resolve)
			.catch((e) => {
				console.log('не удалось отправить сообщение');
				currentMessage.reject(e);
			});
	}

	/**
	 * Подождать N милисекунд
	 * @param {number} milliseconds
	 * @return Promise<void>
	 */
	static timer(milliseconds) {
		return new Promise(resolve => {
			setTimeout(resolve, milliseconds);
		});
	}
}

module.exports	= MessageGun;