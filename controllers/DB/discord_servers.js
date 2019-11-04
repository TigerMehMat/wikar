const DB	= require('./DB');

class DB_dserver extends DB {
	constructor(){
		super();
	}

	getServers(servers = null) {
		return new Promise((resolve, reject) => {
			let where	= '';
			if(servers !== null) {
				if (!Array.isArray(servers)) {
					servers	= [servers];
				}
				where = ' WHERE `discord_id` IN (' + servers.join(',') + ')';
			}
			this.query('SELECT * FROM `discord_servers`' + where)
				.then(resolve)
				.catch(reject);
		});
	}

	getRatesChannels() {
		return new Promise((resolve, reject) => {
			this.query('SELECT `off_rates_channel`,`discord_id` FROM `discord_servers` WHERE `off_rates_channel` IS NOT NULL AND `off_rates_channel` <> "DELETED"')
				.then((res)	=> {
					let rs	= [];
					res.forEach((el, i)	=> {
						let curRes	= el.off_rates_channel.split(',');
						curRes.unshift(el.discord_id);
						rs.push(curRes);
					});
					resolve(rs);
				})
				.catch(reject);
		});
	}

	setNewServerNameByServerId(serverId, name) {
		return new Promise((resolve, reject) => {
			this.query('UPDATE `discord_servers` SET `last_name` = ? WHERE `discord_id`= ?', [name, serverId])
				.then((res)	=> {
					resolve(res);
				})
				.catch(reject);
		});
	}

	deleteRatesAlertByServerId(serverId) {
		return new Promise((resolve, reject) => {
			this.query('UPDATE `discord_servers` SET `off_rates_channel` = "DELETED" WHERE `discord_id`=' + serverId)
				.then((res)	=> {
					resolve(res);
				})
				.catch(reject);
		});
	}

	isActiveServer(serverId, channelId) {
		return new Promise((resolve, reject) => {
			this.query('SELECT `tribe_functions`, `prefix`, `rates` FROM `discord_servers` WHERE ark_active_to >= NOW() AND `discord_id`= ? AND (`active_channel`= ? OR `active_channel`="*") LIMIT 1', [serverId, channelId])
				.then((res)	=> {
					if(!(res.length > 0)) return false;
					res	= res[0];
					res.rates	= JSON.parse(res.rates);
					res.rates	= this.calcRates(res.rates);
					resolve(res);
				})
				.catch(reject);
		});
	}

	calcRates(rates) {
		if(typeof rates['default'] === "undefined") rates['default']	= 1;
		const defaultRates	= [
			'TamingSpeedMultiplier',
			'HarvestAmountMultiplier',
			'XPMultiplier',
			'MatingIntervalMultiplier',
			'BabyMatureSpeedMultiplier',
			'EggHatchSpeedMultiplier',
			'CropGrowthSpeedMultiplier',
			'CustomRecipeEffectivenessMultiplier',
			'OverrideOfficialDifficulty',
		];
		defaultRates.forEach(function(i) {
			if(typeof rates[i] === "undefined") rates[i]	= rates['default'];
		});
		return rates;
	}

	getRateChannels(){
		return new Promise((resolve, reject) => {
			this.query('select discord_id guild, off_rates_channel channel\n' +
				'from discord_servers\n' +
				'where off_rates_channel is not null\n' +
				'  and ark_active_to > NOW()')
				.then(resolve)
				.catch(reject);
		});
	}
}

module.exports	= DB_dserver;
