// const bm_config = {
//     "claster": {
//         "2384486": {
//             "map": "The Island",
//         },
//         "73216": {
//             "map": "The Center",
//         },
//         "2384459": {
//             "map": "Scorched Earth",
//         },
//         "73166": {
//             "map": "Ragnarok",
//         },
//         "2384456": {
//             "map": "Aberration",
//         },
//         "2808747": {
//             "map": "Extinction",
//         },
//         "73077": {
//             "map": "Valguero",
//         },
//     }
// };
// const bm_config2 = {
//     "claster": {
//         "The Island": {
//             "id": "2384486",
//             "map": "The Island",
//         },
//         "The Center": {
//             "id": "73216",
//             "map": "The Center",
//         },
//         "Scorched Earth": {
//             "id": "2384459",
//             "map": "Scorched Earth",
//         },
//         "Ragnarok": {
//             "id": "73166",
//             "map": "Ragnarok",
//         },
//         "Aberration": {
//             "id": "2384456",
//             "map": "Aberration",
//         },
//         "Extinction": {
//             "id": "2808747",
//             "map": "Extinction",
//         },
//         "Valguero": {
//             "id": "73077",
//             "map": "Valguero",
//         },
//     }
// };
//
// const http = require("https");
// const Discord = require('discord.js');
// const fs = require('fs');
// const path = require('path');
//
// const config = require('../configbot');
//
// let enemyRaw =fs.readFileSync(path.resolve(__dirname,'../data/bm/players.json'), 'utf8');
// const enemyNames = JSON.parse(enemyRaw);
//
// let mapRaw =fs.readFileSync(path.resolve(__dirname,'../data/bm/maps_old.json'), 'utf8');
// const mapNames = JSON.parse(mapRaw);
//
// let onlinePlayers = [];
//
//
// class BattleMetrics {
//     static controller(message, args){
//         if(!args) return;
//         switch (args[0]) {
//             case 'pid':
//             case 'playerid':
//                 if(!args[1]) return;
//                 BattleMetrics.getTextServerInformationByPlayerID(args[1])
//                     .then((res) => {
//                         let embed = new Discord.RichEmbed()
//                             .setTitle('Информация об игроке с id '+args[1])
//                             .setDescription(res);
//                         message.channel.send(embed);
//                     });
//                 break;
//         }
//     }
//
//     static getInfoByPlayerID(playerID){
//         return new Promise((resolve, reject) => {
//             let link = "https://www.battlemetrics.com/players/"+playerID;
//             http.get(link, (res) => {
//                 if(res.statusCode !== 200){
//                     reject('Get error:' + res.statusCode);
//                     return;
//                 }
//
//
//                 res.setEncoding('utf8');
//                 let rawData = '';
//                 res.on('data', (chunk) => rawData += chunk);
//                 res.on('end', () => {
//                     resolve(BattleMetrics.getJSONByContent(rawData));
//                 });
//             }).on('error', (res) => {
//                 reject(res);
//             });
//         });
//
//     }
//
//     static getInfoByServerID(serverID){
//         return new Promise((resolve, reject) => {
//             let link = "https://www.battlemetrics.com/servers/ark/"+serverID;
//             http.get(link, (res) => {
//                 if(res.statusCode !== 200){
//                     reject('Get error:' + res.statusCode);
//                     return;
//                 }
//
//
//                 res.setEncoding('utf8');
//                 let rawData = '';
//                 res.on('data', (chunk) => rawData += chunk);
//                 res.on('end', () => {
//                     resolve(BattleMetrics.getJSONByContent(rawData));
//                 });
//             }).on('error', (res) => {
//                 reject(res);
//             });
//         });
//     }
//
//     static getPlayersByServerID(serverID){
//         return new Promise((resolve, reject) => {
//             BattleMetrics.getInfoByServerID(serverID)
//                 .then((res) => {
//                     if(!res.sessions){
//                         resolve([]);
//                     } else {
//                         let sessions = res.sessions.sessions;
//                         let players = [];
//                         for (let key in sessions) {
//                             players.push({
//                                 name: sessions[key].name,
//                                 id: sessions[key].player_id,
//                             });
//                         }
//                         resolve(players);
//                     }
//                 })
//                 .catch(reject);
//         });
//     }
//
//     static getJSONByContent(content){
//         let search = '<script id="storeBootstrap" type="application/json">';
//         let ind  = content.indexOf(search) + search.length;
//         content = content.substr(ind);
//         ind = content.indexOf('</script>');
//         content = content.substr(0, ind);
//         return JSON.parse(content);
//     }
//
//     static getFullInformationServersByPlayerID(playerID){
//         return new Promise((resolve, reject) => {
//             BattleMetrics.getInfoByPlayerID(playerID)
//                 .then((res) => {
//                     let result = {};
//                     for(let key in bm_config.claster) {
//                         if (key in res.players.serverInfo[playerID])
//                             result[bm_config.claster[key].map] = res.players.serverInfo[playerID][key];
//                         else
//                             result[bm_config.claster[key].map] = false;
//                     }
//                     resolve(result);
//                 })
//                 .catch(reject);
//         });
//     }
//
//     static getTextServerInformationByPlayerID(playerID){
//         return new Promise((resolve, reject) => {
//             BattleMetrics.getFullInformationServersByPlayerID(playerID)
//                 .then((res) => {
//                     let cd  =new Date();
//                     let resultText = '';
//                     for(let key in res){
//                         if(!res[key]){
//                             resultText += '*'+key + ': на сервере не был обнаружен*\n\n';
//                             continue;
//                         } else if(res[key].online) {
//                             resultText += '__**'+key + ': online**__\n\n';
//                             continue;
//                         }
//                         let dt = new Date(res[key].lastSeen);
//                         let timeLess = cd - dt;
//                         let timeDay = parseInt(timeLess / (1000 * 60 * 60 * 24));
//                         timeLess -= timeDay * 24 * 60 * 60 * 1000;
//                         let timeHour = parseInt(timeLess / (1000 * 60 * 60));
//                         timeLess -= timeHour * 60 * 60 * 1000;
//                         let timeMin = parseInt(timeLess / (1000 * 60));
//
//                         resultText += key + ': '+BattleMetrics.getTimeText(timeDay, timeHour, timeMin, 'назад') + '\n\n';
//                     }
//                     resolve(resultText);
//                 })
//                 .catch(reject);
//         });
//     }
//
//     static getTimeText(days, hours, minutes, pref = ''){
//         if(days>1||hours>2) minutes = 0;
//         if(days>2) hours = 0;
//
//         let text = '';
//         if(days)
//             text += days + 'д ';
//         if(hours)
//             text += hours + 'ч ';
//         if(minutes)
//             text += minutes + 'м ';
//         return text + pref;
//     }
//
//
//     /* Main logger */
//
//     static logServer(client, map){
//         return new Promise((resolve, reject) => {
//             BattleMetrics.getPlayersByServerID(bm_config2['claster'][map].id)
//                 .then((onlinePlayers) => {
//                     let msg = client.guilds.get(config.bm_guild);
//                     msg = msg.channels.get(config.bm_channel);
//                     msg.fetchMessage(config.bm_logMessages[map])
//                         .then((res) => {
//                             let players = '';
//                             if(onlinePlayers.length>0){
//                                 for(let i=0;i<onlinePlayers.length;i++){
//                                     if(enemyNames.indexOf(onlinePlayers[i].name)!==-1){
//                                         players += '__**['+onlinePlayers[i].name+'](https://www.battlemetrics.com/players/'+onlinePlayers[i].id+'/)**__\n';
//                                     } else {
//                                         players += '['+onlinePlayers[i].name+'](https://www.battlemetrics.com/players/'+onlinePlayers[i].id+'/)\n';
//                                     }
//                                 }
//                             } else {
//                                 players = 'Игроков нет на карте';
//                             }
//                             let embed = new Discord.RichEmbed()
//                                 .setTitle(map)
//                                 .setDescription(players)
//                                 .setURL("https://www.battlemetrics.com/servers/ark/"+bm_config2['claster'][map].id+'/')
//                                 .setTimestamp(Date());
//                             res.edit(embed)
//                                 .then(() => {
//                                     resolve(onlinePlayers);
//                                 })
//                                 .catch(reject);
//                         })
//                         .catch(reject);
//                 })
//                 .catch(reject);
//         });
//     }
//
//     static startLogServer(client, map){
//         let interv;
//         BattleMetrics.logServer(client, map)
//             .then((onlinePlayersRes) => {
//                 let onlinePlayers = onlinePlayersRes;
//                 interv = setInterval(() => {
//                     BattleMetrics.logServer(client, map)
//                         .then((onlinePlayersRes) => {
//                             BattleMetrics.sendChanges(client, onlinePlayersRes, onlinePlayers, map);
//                             onlinePlayers = onlinePlayersRes;
//                         })
//                         .catch((err) => {BattleMetrics.getError(err, interv)});
//                 }, 1000 * 60 * 10);
//             })
//             .catch((err) => {BattleMetrics.getError(err, interv)});
//     }
//
//     static getError(err, interv){
//         if(err === 'Get error:503'){
//             if(interv) {
//                 clearInterval(interv);
//             }
//             console.error('Перехожу в аварийный режим');
//         } else {
//             console.error('Неизвестная ошибка: '+err);
//         }
//     }
//
//     static sendChanges(client, onlineNow, onlineOld, map){
//         return new Promise((resolve, reject) => {
//             let newPlayers = onlineNow.map((val) => {
//                 if (BattleMetrics.searchNameInArray(val.name, onlineOld)) return null;
//                 return val;
//             });
//             let leftPlayers = onlineOld.map((val) => {
//                 if (BattleMetrics.searchNameInArray(val.name, onlineNow)) return null;
//                 return val;
//             });
//             let text = '';
//             newPlayers.forEach((val) => {
//                 if (val && enemyNames.indexOf(val.name) !== -1) {
//                     text += val.name + ' зашел на сервер\n';
//                 }
//             });
//             leftPlayers.forEach((val) => {
//                 if (val && enemyNames.indexOf(val.name) !== -1) {
//                     text += val.name + ' покинул сервер\n';
//                 }
//             });
//             if (!text) {
//                 resolve();
//                 return;
//             }
//             let embed = new Discord.RichEmbed()
//                 .setTitle(map)
//                 .setDescription(text)
//                 .setTimestamp(Date());
//             client.guilds.get(config.bm_guild).channels.get(config.bm_channel).send(embed)
//                 .then(resolve)
//                 .catch(reject);
//         });
//     }
//
//     static searchNameInArray(name, online){
//         for(let i=0;i<online.length;i++){
//             if(online[i].name === name) return true;
//         }
//         return false;
//     }
//
//
//     /* Новая система запросов */
//
//     static start(client){
//         BattleMetrics.sendQuery(client);
//     }
//
//     static sendQuery(client, n = 0){
//         BattleMetrics.logServer(mapNames[n]['id'])
//             .then((onlinePlayersRes) => {
//                 BattleMetrics.sendChanges(client, onlinePlayersRes, onlinePlayers[n], mapNames[n]['map'])
//                     .then(() => {
//                         let time = 3 * 1000;
//                         n++;
//                         if(n>6){
//                             n = 0;
//                             time = 1000 * 60 * 10;
//                         }
//                         setTimeout(() => {
//                             BattleMetrics.sendQuery(client, n);
//                         }, time);
//                     });
//                 onlinePlayers[n] = onlinePlayersRes;
//                 BattleMetrics.sendStatus(client);
//             })
//             .catch((err) => { BattleMetrics.errorSend(client, err) });
//     }
//
//     static errorSend(client, err){
//         console.log('Аварийное ожидание 1 час...');
//         BattleMetrics.sendStatus(client, 1);
//         setTimeout(() => {
//             BattleMetrics.start(client);
//         }, 1000 * 60 * 60); // 1 час
//     }
//
//     static sendStatus(client, isWar = 0){
//         let status = (isWar) ? 'Аварийное ожидание...' : 'Рабочий режим.';
//         let msg = client.guilds.get(config.bm_guild);
//         msg = msg.channels.get(config.bm_channel);
//         msg.fetchMessage(config.bm_status)
//             .then((res) => {
//                 let embed = new Discord.RichEmbed()
//                     .setTimestamp(new Date())
//                     .setTitle('Статус BM')
//                     .setDescription(status);
//                 res.edit(embed)
//                     .catch(console.error);
//             })
//             .catch(console.error);
//     }
// }
//
// module.exports = BattleMetrics;
