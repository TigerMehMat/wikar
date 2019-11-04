const DB	= require('./DB');

class DB_bm extends DB {
	constructor(){
		super();
	}

	getServers() {
		return new Promise((resolve, reject) => {
			this.query('select `as`.name, ds.discord_id, `as`.bm_id, bm_s.state\n' +
				'from bm_states bm_s\n' +
				'         inner join discord_servers ds on ds.id = bm_s.discord\n' +
				'         inner join ark_servers `as` on `as`.id = bm_s.server_id\n' +
				'where ds.bm_active_to > NOW() and ds.bm_channel is not NULL\n')
				.then(resolve)
				.catch(reject);
		});
	}

	getAllActiveBMServers() {
		return new Promise((resolve, reject)	=> {
			this.query('select `as`.bm_id\n' +
				'from bm_states bm_s\n' +
				'         inner join discord_servers ds on ds.id = bm_s.discord\n' +
				'         inner join ark_servers `as` on `as`.id = bm_s.server_id\n' +
				'where ds.bm_active_to > NOW() and ds.bm_channel is not NULL\n' +
				'group by `as`.bm_id\n' +
				'order by `as`.bm_id\n')
				.then((res)	=> {
					let result	= [];
					res.forEach((el)	=> {
						result.push(el.bm_id);
					});
					resolve(result);
				})
				.catch(reject);
		});
	}

	getServersInfoByBMServer(bm_server) {
		return new Promise((resolve, reject)	=> {
			this.query('select ds.bm_channel `channel`, ds.discord_id `guild`\n' +
				'from bm_states bm_s\n' +
				'         inner join discord_servers ds on ds.id = bm_s.discord\n' +
				'         inner join ark_servers `as` on `as`.id = bm_s.server_id\n' +
				'where ds.bm_active_to > NOW() and ds.bm_channel is not NULL and `as`.bm_id = ?\n' +
				'order by ds.bm_channel\n', [bm_server])
				.then(resolve)
				.catch(reject);
		});
	}

	updateServerOnline(bm_server, players) {
		return new Promise((resolve, reject)	=> {
			this.query('update ark_servers\n' +
				'set last_players    = current_players,\n' +
				'    current_players = ?,\n' +
				'	 last_check		 = NOW()\n' +
				'where bm_id = ?', [JSON.stringify(players), bm_server])
				.then(resolve)
				.catch(reject);
		});
	}

	getAllActiveDiscordServers() {
		return new Promise((resolve, reject)	=> {
			this.query('select ds.discord_id guild, ds.bm_channel channel\n' +
				'from discord_servers ds\n' +
				'where ds.bm_active_to > NOW() and ds.bm_channel is not NULL')
				.then(resolve)
				.catch(reject);
		});
	}

	getServersInfoByDiscordServer(discord_id) {
		return new Promise((resolve, reject)	=> {
			this.query('select bm_s.state, `as`.bm_id, `as`.current_players, `as`.last_players, `as`.name\n' +
				'from bm_states bm_s\n' +
				'    inner join discord_servers ds\n' +
				'    inner join ark_servers `as`\n' +
				'        on ds.id = bm_s.discord and `as`.id = bm_s.server_id\n' +
				'where ds.discord_id = ? ', [discord_id])
				.then(resolve)
				.catch(reject);
		});
	}

	getNamesByDiscordServer(discord_id) {
		return new Promise((resolve, reject)	=> {
			this.query('select ap.steam_name name, aps.state\n' +
				'from ark_players_state aps\n' +
				'    inner join ark_players ap\n' +
				'    inner join discord_servers ds\n' +
				'        on aps.discord_id = ds.id and aps.player_id = ap.id\n' +
				'where ds.discord_id = ?', [discord_id])
				.then(resolve)
				.catch(reject);
		});
	}
}

module.exports	= DB_bm;
