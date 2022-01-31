const standartReact = '⏲';// Часики

class WaitReaction {
	static react(message) {
		return new Promise((resolve, reject) => {
			let emoji = this.getReact(message);
			message.react(emoji)
				.then(resolve)
				.catch(reject);
		});
	}

	static getReact(message) {
		let emoji   = message.guild.emojis.find(val => val.name === 'mytime');
		return emoji ? emoji : standartReact;
	}
}

module.exports = WaitReaction;
