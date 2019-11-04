const DB	= require('./DB');

class DB_badrequests extends DB {
	constructor(){
		super();
	}

	putRequest(message, func = null, comment = null, answer_id = null, important = null) {
		return new Promise((resolve, reject) => {
			this.query('INSERT INTO `bad_requests` (`discord_id`, `message_id`, `answer_id`, `request`, `func`, `comment`, `important`,`create`) VALUES ((SELECT `id` FROM `discord_servers` WHERE `discord_id`=?),?,?,?,?,?,?,NOW())', [message.guild.id,message.id,answer_id, message.content, func, comment, important])
				.then(resolve)
				.catch(reject);
		});
	}
}

module.exports	= DB_badrequests;
