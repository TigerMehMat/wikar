const bm_api	= require("./GlobalControllers/BM_api.js");
const Discord	= require('discord.js');
const fs		= require('fs');
const path		= require('path');
const Access	= require('./GlobalControllers/access.js');
const DE		= require('./GlobalControllers/discord_expansion.js');

const BattleMetricsModel	= new (require('../Models/BattleMetricsModel.js'));

const statusColor = [0x666666, 0xFFA61A, 0xFF1D05];

class BM extends bm_api {

	/**
	 *
	 * @param {string} token
	 * @param client
	 */
    constructor(token, client){
        super(token);
        this.client = client;
    }

	/**
	 * Раз в 3 мин + время работы функции обновляет бм
	 * @returns {Promise<void>}
	 */
	serversUpdater() {
    	return new Promise(async () => {
			while (1) {
				try {
					await this.serversUpdate();
				} catch (e) {
					DiscordAlarm.send('Не обновляется логгер BM')
						.catch(console.error);
					console.error(e);
				}
				await this.timeout(1000 * 60 * 5); // 5 минут
			}
		});
	}

    async serversUpdate(){
		let arrayServers	= await BattleMetricsModel.getAllActiveBMServers();
		let res				= await this.getPlayersByAllServers(arrayServers);
		await this.updateServers(res);
		await this.updateDiscordServers();
    }

    async updateServers(players) {
    	for(let k in players) {
			await BattleMetricsModel.updateServerOnline(k, players[k]);
		}
	}

	async updateDiscordServers(firstStart	= false) {
    	let discordServers	= await BattleMetricsModel.getAllActiveDiscordServers();
    	for(let i=0; i<discordServers.length; i++) {
			let guild   = this.client.guilds.get(discordServers[i].guild);
			if(!guild) {
				console.error("Guild for " + discordServers[i].guild + " not found");
				continue;
			}
			let channel = guild.channels.get(discordServers[i].channel);
			if(!channel) {
				console.error("Channel for " + discordServers[i].channel + " not found");
				continue;
			}

    		let serversInfo		= await BattleMetricsModel.getServersInfoByDiscordServer(discordServers[i].guild);

			let infoMessages	= await DE.getMessagesForLog(channel, this.client.user.id, serversInfo.length);


			let names	= await BattleMetricsModel.getNamesByDiscordServer(discordServers[i].guild);
    		for(let j=0; j<serversInfo.length;j++) {
				serversInfo[j].current_players	= this.getPlayersState(serversInfo[j].current_players, names);
				serversInfo[j].last_players		= this.getPlayersState(serversInfo[j].last_players, names);
    			await this.updateServerInfo(infoMessages[j], serversInfo[j]);
    			await this.sendServerAlerts(channel, serversInfo[j]);
			}
		}
	}

	async updateServerInfo(message, serverInfo) {
		let embed	= new Discord.MessageEmbed()
			.setTitle(serverInfo.name)
			.setURL('https://www.battlemetrics.com/servers/ark/'+serverInfo.bm_id+'/')
			.setTimestamp(Date.now())
			.setColor(statusColor[serverInfo.state]);
		let text	= await this.text__nameList(serverInfo.current_players);
		if(text === '') text = '*сервер пуст*';
		embed.setDescription(text);
		await message.edit(embed);
		if(!message.pinned) {
			await message.pin();
			let systemMsg	= await message.channel.fetchMessages({limit: 1});
			systemMsg		= systemMsg.find(el => el.system === true);
			if(systemMsg) {
				await systemMsg.delete();
			}
		}
		await this.timeout(1000);
	}

	async sendServerAlerts(channel, serverInfo) {
    	if(serverInfo.state === 0) return;


    	let currentPlayers	= serverInfo.current_players;
    	let lastPlayers		= serverInfo.last_players;

    	if(serverInfo.state === 1) {
			currentPlayers	= currentPlayers.filter(pl	=> pl.state === 2);
			lastPlayers		= lastPlayers.filter(pl	=> pl.state === 2);
		}

		currentPlayers	= currentPlayers.sort((a,b)	=> a>b);
		lastPlayers		= lastPlayers.sort((a,b)	=> a>b);

		if(this.compareArrays(currentPlayers, lastPlayers)) return;

    	let change_in	= this.getDiff(currentPlayers, lastPlayers);
    	let change_out	= this.getDiff(lastPlayers, currentPlayers);

    	if(change_in.length === 0 && change_out.length === 0) return;



		let embed	= new Discord.MessageEmbed()
			.setTitle(serverInfo.name)
			.setURL('https://www.battlemetrics.com/servers/ark/'+serverInfo.bm_id+'/')
			.setTimestamp(Date.now())
			.setColor(statusColor[serverInfo.state]);

		let text = '';
		if(change_in.length > 0) {
			text += await this.text__nameList(change_in, 1, ' зашел(ла) сервер');
		}
		if(change_out.length > 0) {
			text += await this.text__nameList(change_out, 1, ' покинул(а) сервер');
		}



		embed.setDescription(text);
		await channel.send(embed);
		await this.timeout(1000);
	}

	getPlayersState(players, names) {
    	if(typeof players === "string") players = JSON.parse(players);
		players.forEach((elem, i) => {
			let player	= names.find(el => el.name === elem.name);
			if(!player) player = {name: elem.name, state: 0, id: elem.id};
			else player = {name: elem.name, state: player.state, id: elem.id};
			players[i] = player;
		});
		return players;
	}

	getDiff(a, b){
		let res = [];
		a.forEach(function(i){
			if(!b.find(elem => elem.name === i.name)) {
				res.push(i);
			}
		});
		return res;
	}

	async getPlayerStateByCode(code) {
		let states = await this.getStates();
		return (typeof states[code] !== "undefined") ? states[code] : 'Неизвестный тип';
	}

	async getStates() {
		if(typeof this.lastUpdateStates !== "undefined" && this.lastUpdateStates - (Date.now() - 1000 * 60 * 10) > 0) {
			return this.lastStates;
		} else {
			this.lastStates = await BattleMetricsModel.getStates();
			this.lastUpdateStates = Date.now();
			return this.lastStates;
		}
	}

    changeState(message, args){
        let clientId = Access.getActualBMKey(message);
        if(clientId === false) return;
        if(clientId === 0) {
        	message.reply('Срок лицензии модуля BM истек');
        	return;
		}
        if(args.length < 2) {
            message.reply('Нужно указать минимум 2 параметра: сперва название карты (можно с пробелами), затем цифру статуса сервера от 0 до 2')
                .catch(console.error);
            return;
        }
        let status = parseInt(args.pop());
        let serv = args.join('').toLowerCase();
        if(isNaN(status)) status = 0;
        if(status<0) status = 0;
        if(status>2) status = 2;
        switch (serv) {
            case 'island':
            case 'theisland':
            case 'the_island':
            case 'остров':
            case 'i':
            case 'о':
                serv = 'The Island';
                break;
            case 'aber':
            case 'aberr':
            case 'aberration':
            case 'абер':
            case 'аберр':
            case 'аберрация':
            case 'a':
            case 'а':
                serv = 'Aberration';
                break;
            case 'extinction':
            case 'вымирание':
            case 'e':
            case 'в':
                serv = 'Extinction';
                break;
            case 'scorched_earth':
            case 'scorchedearth':
            case 'scorched':
            case 'выжженные_земли':
            case 'выжженныеземли':
            case 'выжженка':
            case 'se':
            case 'вз':
                serv = 'Scorched Earth';
                break;
            case 'center':
            case 'thecenter':
            case 'the_center':
            case 'центр':
            case 'c':
            case 'ц':
                serv = 'The Center';
                break;
            case 'ragnarok':
            case 'рагнарек':
            case 'рагнарёк':
            case 'рагнарь':
            case 'р':
            case 'r':
                serv = 'Ragnarok';
                break;
            case 'valguero':
            case 'вальгуэро':
            case 'вальгуеро':
            case 'валгуэро':
            case 'валгуеро':
            case 'вальга':
            case 'вал':
            case 'v':
                serv = 'Valguero';
                break;
            default:
                message.reply('Сервер ' + serv + ' не найден');
                return;
        }
        this.servers[clientId][serv].status = status;
        let state = {};
        for(let i in this.servers) {
			state[i] = {};
        	for(let j in this.servers[i]) {
				state[i][j] = {
					"status": this.servers[i][j].status,
					// "currentPlayers": [],
				};
			}
        }
        fs.writeFileSync(path.resolve(__dirname, '../data/'+process.env.PATH_BM_DIRECTORY+'/states.json'), JSON.stringify(state));
        message.reply('Статус сервера ' + serv + ' изменен на ' + status)
            .catch(console.error);
    }


    /* Функции внешнего вида */



	async text__nameList(arrPlayers, type = 0, postfix = '') {
		let text	= '';
		for(let i = 0; i < arrPlayers.length; i++) {
			let newAdd = await this.text__player(arrPlayers[i], type, postfix);
			if((text + newAdd).length >= 1900) {
				text += '*И ещё ' + (arrPlayers.length - i) + ' ' + this.getNamePlayers(arrPlayers.length - i) + '*';
				break;
			} else {
				text += newAdd;
			}
		}
		return text;
	}

	getNamePlayers(q) {
		if((q % 10 >= 5 && q % 10 <= 9) || q % 10 === 0 || (q > 10 && q < 20)) return 'игроков';
		if(q % 10 >= 2 && q % 10 <= 4) return 'игрока';
		if(q % 10 === 1) return 'игрок';
	}

	async text__player(player, type = 0, postfix2 = '') {
		let postfix	= '';
		if(type === 0) {
			postfix = ' - ' + await this.getPlayerStateByCode(player.state);
		} else if(type === 1) {
			postfix = ' (' + await this.getPlayerStateByCode(player.state) + ')';
		}
		return '[``' + Discord.Util.escapeMarkdown(player.name, false, true).replace('[', '\\[') + '``](https://www.battlemetrics.com/players/'+player.id+')' + postfix + postfix2 + '\n';
	}


	/* Вспомогательные функции */

	timeout(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	compareArrays(array1, array2) {
		let i, isA1, isA2;
		isA1 = Array.isArray(array1);
		isA2 = Array.isArray(array2);

		if (isA1 !== isA2) { // is one an array and the other not?
			return false;      // yes then can not be the same
		}
		if (! (isA1 && isA2)) {      // Are both not arrays
			return array1 === array2;  // return strict equality
		}
		if (array1.length !== array2.length) { // if lengths differ then can not be the same
			return false;
		}
		// iterate arrays and compare them
		for (i = 0; i < array1.length; i += 1) {
			if (!this.compareArrays(array1[i], array2[i])) { // Do items compare recursively
				return false;
			}
		}
		return true; // must be equal
	}

	addPlayer() {
		// todo: Добавление игрока в список
	}

	sendPlayersList(message, args, messageAccess) {
		BattleMetricsModel.getPlayerListWithStatus();
	}
}

module.exports = BM;
