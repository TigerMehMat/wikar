const DiscordServerModelClass = require('../../Models/DiscordServersModel.js');

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

	/**
	 * @return {Promise<ActiveServerData>}
	 */
	async getAccessParameters() {
		return await this.discord_model.isActiveServer(this.guild_id, this.channel_id, 'active');
	}

	/**
	 * Аналог - getAccessParameters
	 * @deprecated
	 * @return {Promise<ActiveServerData>}
	 */
	async getMainCheck() {
		return this.discord_model.isActiveServer(this.guild_id, this.channel_id);
	}

	/**
	 * @deprecated
	 * @param messageAccess {ActiveServerData}
	 * @param type {'normal'|'tribe'}
	 * @return {boolean}
	 */
	static isAccess(messageAccess, type = 'normal') {
		switch (type) {
			case 'normal':
				return true;
			case 'tribe':
				return !!messageAccess.tribe_functions;
		}
		return false;
	}
}

module.exports = Access;
