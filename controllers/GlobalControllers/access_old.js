const config = require('../../configbot');

class Access {
	static isAccess(message, type = 'normal'){
		/* Проверяем адекватность запроса */
		if(!message) return false;
		if(!message.guild) return false;

		let guildID		= message.guild.id;
		let channelID	= message.channel.id;

		/* Проверяем наличие в базе и срок обслуживания */
		if(!this.getSuccessTime(guildID)) return false;

		/* Определяем надо ли отвечать в этот канал */
		let data = config.access.guilds;

		if(typeof data[guildID][channelID] === "undefined") data[guildID][channelID] = data[guildID].default;

		if(!data[guildID][channelID]) return false;

		switch (type) {
			case 'normal':
				return true;
			case 'tribe':
				return (typeof data[guildID].options.tribeFunctions === "undefined") ? false : data[guildID].options.tribeFunctions;
		}

		return false;





		// if(!(message.guild.id in access.guilds)) return access.guilds.default;
		//
		// if(!(message.channel.id in access.guilds[message.guild.id])) return (access.guilds[message.guild.id].default || access.guilds.default);
		//
		// return access.guilds[message.guild.id][message.channel.id];
	}

	static getSuccessTime(guildID){
		let data = config.access.guilds;
		if(typeof data[guildID] === "undefined") return false;
		return data[guildID].options.timeTo > Date.now();
	}


	/* For BattleMetrics */

	static getActualBMKey(message) {
		if(!message) return false;
		if(!message.guild) return false;

		let guildID		= message.guild.id;
		let channelID	= message.channel.id;
		return this.searchBMByGuildAndChannel(guildID, channelID);
	}

	static searchBMByGuildAndChannel(guild, channel) {
		for(let i = 0; i < config.bm.length; i++) {
			for(let j = 0; j < config.bm[i].info.length; j++) {
				let currentInfo = config.bm[i].info[j];
				if(currentInfo.guild !== guild || currentInfo.channel !== channel) continue;

				let now = +new Date;
				if(now > currentInfo.timeTo) return 0;
				return currentInfo.id;
			}
		}
		return false;
	}

	static getBMTimeByGuildAndChannel(guild, channel) {
		for(let i = 0; i < config.bm.length; i++) {
			for(let j = 0; j < config.bm[i].info.length; j++) {
				let currentInfo = config.bm[i].info[j];
				if(currentInfo.guild !== guild || currentInfo.channel !== channel) continue;

				return currentInfo.timeTo;
			}
		}
		return false;
	}
}

module.exports = Access;
