const config = require('../../configbot');
const DiscordServerModelClass = require('../../Models/DiscordServersModel');

// class Access_old {
// 	/**
// 	 *
// 	 * @param {object} messageAccess
// 	 * @param {'normal'|'tribe'} type
// 	 * @returns {boolean}
// 	 */
//     static isAccess(messageAccess, type = 'normal'){
// 		switch (type) {
// 			case 'normal':
// 				return true;
// 			case 'tribe':
// 				return !!messageAccess.tribe_functions;
// 		}
//
// 		return false;
//     }
//
//     static getMainCheck(message, db) {
// 		return db.isActiveServer(message.guild.id, message.channel.id);
// 	}
//
//
//     /* For BattleMetrics */
//
//     static getActualBMKey(message) {
//         if(!message) return false;
//         if(!message.guild) return false;
//
//         let guildID		= message.guild.id;
//         let channelID	= message.channel.id;
//         return this.searchBMByGuildAndChannel(guildID, channelID);
//     }
//
//     static searchBMByGuildAndChannel(guild, channel) {
//     	for(let i = 0; i < config.bm.length; i++) {
// 			for(let j = 0; j < config.bm[i].info.length; j++) {
// 				let currentInfo = config.bm[i].info[j];
// 				if(currentInfo.guild !== guild || currentInfo.channel !== channel) continue;
//
// 				let now = +new Date;
// 				if(now > currentInfo.timeTo) return 0;
// 				return currentInfo.id;
// 			}
// 		}
//     	return false;
// 	}
//
// 	static getBMTimeByGuildAndChannel(guild, channel) {
// 		for(let i = 0; i < config.bm.length; i++) {
// 			for(let j = 0; j < config.bm[i].info.length; j++) {
// 				let currentInfo = config.bm[i].info[j];
// 				if(currentInfo.guild !== guild || currentInfo.channel !== channel) continue;
//
// 				return currentInfo.timeTo;
// 			}
// 		}
// 		return false;
// 	}
// }

class Access {
	constructor(guild_id, channel_id) {
		this.discord_model = new DiscordServerModelClass();
		this.guild_id = guild_id;
		this.channel_id = channel_id;
		this.is_validate = false;
	}

	validate() {
		this.is_validate = (typeof this.guild_id === "string" && typeof this.channel_id === "string");
		return this;
	}

	async getAccessParameters() {
		let res = await this.discord_model.isActiveServer(this.guild_id, this.channel_id, 'active');
		return res;
	}

	async isAccessBM() {
		return await this.discord_model.isActiveServer(this.guild_id, this.channel_id, 'bm');
	}
}

module.exports = Access;
