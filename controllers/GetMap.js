const http = require('https'),
    sharp = require('sharp'),
    TranslateCreature = require('./TranslateCreature'),
    access = require('./GlobalControllers/access'),
    GetPhrases = require('./GetPhrases'),
    Discord = require('discord.js');

const fs = require('fs');
const path = require('path');



const db_badRequests_class	= require('./DB/bad_requests');
const db_badRequests	= new db_badRequests_class();

let allreactions = [
    '557553943572643862',
    '557554097054547969',
    '557555459280863234',
    '557555459146645525',
    '557555367240794122',
    '557555367240925184',
    '623118547211517952'
];
let allmaps = [
    'The_Island',
    'The_Center',
    'Scorched_Earth',
    'Ragnarok',
    'Aberration',
    'Extinction',
    'Valguero'
];

class GetMap {

    static controller(message, args, messageAccess){
        if(!access.isAccess(messageAccess)) return;

        if(args.length === 0) {
            message.channel.send('Эта команда не вызывается без параметров. Для справки используйте ``!помощь карта``')
                .catch(console.error);
            return;
        }
        let ismap = args.pop();
        let map = GetMap.getMapName(ismap);

        let name = args.join('');

        if(!name && map){
            const attachment = new Discord.Attachment('./maps/'+map+'.jpg', "map.jpg");
            let embed = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle('Карта ' + map.replace('_', ' '))
                .attachFile(attachment)
                .setImage('attachment://map.jpg');
            message.channel.send(embed)
                .catch(console.error);
            return;
        }

        if(!map){
            name = name+ismap;
            GetMap.getMapList(message, TranslateCreature.getENCreature_map(name), async function(err, res, msg) {
                let maps = GetMap.getMapsIcons(res);
                if(maps.length > 1) {
                    if(!msg) {
                        msg = await message.channel.send('Это существо есть на нескольких картах... Загружаю список карт...');
                        GetMap.sendAllReactions(msg, maps, () => {
                            msg.edit('Это существо есть на нескольких картах.');
                        });
                    } else {
                        msg.edit('Это существо есть на нескольких картах... Загружаю список карт...')
                            .then(() => {
                                GetMap.sendAllReactions(msg, maps, () => {
                                    msg.edit('Это существо есть на нескольких картах.');
                                });
                            })
                            .catch(console.error);
                    }
                    let reactionFilter = (reaction, user) => {
                        return allreactions.indexOf(reaction.emoji.id) !== -1 && user.id === message.author.id && !user.bot;
                    };
                    msg.awaitReactions(reactionFilter, {max: 1, time: 60000, errors: ['time']})
                        .then(collected => {
                            msg.delete()
                                .then(() => {
                                    /*msg.edit(GetPhrases.getWait())
                                        .then(() => {*/
                                            GetMap.getResult(message, name, allmaps[allreactions.indexOf(collected.first().emoji.id)]);
                                        /*})
                                        .catch(console.error);*/
                                })
                                .catch(console.error);
                        })
                        .catch((res) => {
                            if(res instanceof Discord.Collection){
                                msg.clearReactions()
                                    .catch(console.error);
                                msg.edit("Вы не указали карту для этого существа.")
                                    .catch(console.error);
                            } else console.error(res + 'error instanceof');
                        });
                } else if(maps.length === 1){
                    if(msg) msg.delete();
                    GetMap.getResult(message, name, res[0]);
                } else {
                    if(msg)
                        msg.edit('Карт для существа ``'+TranslateCreature.getENCreature_map(name)+'`` не нашлось.')
                            .then(()    => {
                                db_badRequests.putRequest(message, 'map', 'Нет карты: '+TranslateCreature.getENCreature_map(name), msg.id)
                                    .catch(console.error);
                            })
                            .catch(err => console.error(err));
                    else
                        msg.channel.send('Карт для этого существа не нашлось.')
                            .then((msg)    => {
                                db_badRequests.putRequest(message, 'map', 'Нет карты: '+TranslateCreature.getENCreature_map(name), msg.id)
                                    .catch(console.error);
                            })
                            .catch(err => console.error(err));
                }
                return;
            });
            return;
        }

        GetMap.getResult(message, name, map);
    }

    static getResult(message, name, map){
        GetMap.getMap(message, name, map, (err, res) => {
            if(err) {
                console.error(err);
                return;
            }
            const attachment = new Discord.Attachment(res, "map.jpg");
            let embed = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle(TranslateCreature.getRUCreature(TranslateCreature.getENCreature(name)) + ' на карте ' + map.replace('_', ' '))
                .attachFile(attachment)
                .addField('<:cave:557481898088333342> - Пещеры', '\u200B', true)
                .addField('<:untamed:557480015533441024> - Неприручаемые', '\u200B', true)
                .setImage('attachment://map.jpg');
            message.channel.send(embed)
                .catch(console.error);
        });
    }

    static getMapList(message, cname, callback){
        let mapsCash = fs.readFileSync(path.resolve(__dirname, '../data/map/spawnonmaps.json'), 'utf-8');
        let mapsCashObj = JSON.parse(mapsCash);

        if(typeof mapsCashObj[cname] !== 'undefined'){
            callback(null, mapsCashObj[cname], false);
        } else {
            message.channel.send(GetPhrases.getWait())
                .then((msg) => {let maps = allmaps.slice();
                    let resultMaps = [];
                    GetMap.getAllMapList(maps, cname, resultMaps, (err, res) => {
                        if(res.length !== 0) {
                            mapsCashObj[cname] = res;
                            fs.writeFileSync(path.resolve(__dirname, '../data/map/spawnonmaps.json'), JSON.stringify(mapsCashObj));
                        }
                        callback(err, res, msg);
                    });
                })
                .catch(console.error);

        }
    }

    static getAllMapList(maps, cname, resultMaps, callback){
        if(maps.length === 0) {
            callback(null, resultMaps);
            return;
        }
        let currentMap = maps.shift();

        http.get(GetMap.getMapLink(cname, currentMap), (res) => {
            if(res.statusCode === 200) resultMaps.push(currentMap);
            GetMap.getAllMapList(maps, cname, resultMaps, callback);
        });
    }

    static getMapLink(cname, map){
        cname = cname[0].toUpperCase() + cname.slice(1);
        return "https://ark.gamepedia.com/File:Spawning_"+encodeURIComponent(cname)+"_"+map+".svg";
    }

    static getWikiImageByName(cname, map, callback){
        let link = this.getMapLink(cname, map);
        http.get(link, (res) => {
            let { statusCode } = res;

            if(statusCode !== 200) {
                callback(404);
                return;
            }


            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => {
                let imageLink = GetMap.getActualLink(rawData);
                if(!imageLink) {
                    callback(400);
                    return;
                }
                http.get(imageLink, (res2) => {
                    let statusCode2 = res2.statusCode;

                    if(statusCode2 !== 200) {
                        console.error('Status code not 200: ' + statusCode2);
                        callback(400);
                        return;
                    }


                    res2.setEncoding('utf8');
                    let rawData2 = '';
                    res2.on('data', (chunk2) => rawData2 += chunk2);
                    res2.on('end', () => {
                        rawData2 = rawData2.replace(' width="300" height="300"', ' width="1024" height="1024"');
                        callback(null, rawData2);
                    });
                });
            });
        });
    }

    static getMap(message, cname_or, map, callback){
        let cname = TranslateCreature.getENCreature_map(cname_or);
        if(!cname){
            message.channel.send('Неверное название существа...');
            return;
        }
        cname = cname[0].toUpperCase() + cname.slice(1);

        fs.readFile(path.resolve(__dirname, '../cash/maps/'+cname+'-'+map+'.jpg'), (err, data) => {
            if(err) {
                message.channel.send(GetPhrases.getWait())
                    .then((msg) => {
                        GetMap.getWikiImageByName(cname, map, (err, res) => {
                            if (err) {
                                msg.edit('Не удалось найти карту для существа *``' + TranslateCreature.getRUCreature(TranslateCreature.getENCreature(cname_or)) + '``*, возможно оно не водится на карте *``' + map + '``*.')
                                    .then(()    => {
                                        db_badRequests.putRequest(message, 'map', 'Нет карты: '+TranslateCreature.getRUCreature(TranslateCreature.getENCreature(cname_or)) + ' для карты '+map, msg.id)
                                            .catch(console.error);
                                    })
                                    .catch(err => console.error(err));
                                return;
                            }
                            res = res.replace(' filter="url(#blur)"', '');
                            res = res.replace('opacity="0.7"', 'opacity="0.9"');
                            res = res.replace('</style>', 'rect { stroke: #000; stroke-width: 0.5px; stroke-linejoin: round }</style>');
                            res = res.replace(/<rect/g, '<rect rx="1" ry="1"');
                            sharp('./maps/' + map + '.jpg')
                                .overlayWith(Buffer.from(res))
                                .jpeg({"quality": 70, nearLossless: true})
                                .toBuffer((err, info) => {
                                    if (err){
                                        msg.edit('Произошла ошибка записи файла...');
                                        console.error(err);
                                        return;
                                    }
                                    else {
                                        fs.writeFileSync(path.resolve(__dirname, '../cash/maps/' + cname + '-' + map + '.jpg'), info);
                                        msg.delete()
                                            .then(()=>{
                                                callback(null, info);
                                            })
                                            .catch(console.error);
                                    }
                                });
                        });
                    })
                    .catch(console.error);
            } else {
                callback(null, data);
            }
        })

    }

    static getActualLink(text){
        let searchStart = '<div class="fullImageLink" id="file"><a href="';
        let pos = text.indexOf(searchStart);
        if(pos === -1) return false;
        text = text.substr(pos + searchStart.length);
        return text.substr(0, text.indexOf('"'));
    }

    static getMapName(text){
        if(typeof text !== 'string') return false;
        switch (text.toLowerCase()) {
            case 'island':
            case 'theisland':
            case 'остров':
            case 'i':
            case 'о':
                return 'The_Island';
            case 'aber':
            case 'aberr':
            case 'aberration':
            case 'абер':
            case 'аберр':
            case 'аберрация':
            case 'a':
            case 'а':
                return 'Aberration';
            case 'extinction':
            case 'вымирание':
            case 'e':
            case 'в':
                return 'Extinction';
            case 'scorched_earth':
            case 'scorchedearth':
            case 'scorched':
            case 'выжженные_земли':
            case 'выжженныеземли':
            case 'выжженка':
            case 'пустыня':
            case 'se':
            case 'вз':
                return 'Scorched_Earth';
            case 'center':
            case 'thecenter':
            case 'центр':
            case 'c':
            case 'ц':
                return 'The_Center';
            case 'ragnarok':
            case 'рагнарек':
            case 'рагнарёк':
            case 'рагнарь':
            case 'рага':
            case 'р':
            case 'r':
                return 'Ragnarok';
        }
        return false;
    }

    static sendAllReactions(msg, arrReactions, callback = false){
        msg.react(arrReactions.shift())
            .then((ms) => {
                if(!ms.message.content.startsWith('Это существо есть на нескольких картах.')){
                    ms.message.clearReactions()
                        .catch(console.error);
                    return;
                }
                if (arrReactions.length === 0){
                    if(typeof callback === 'function') callback(null);
                    return;
                }
                this.sendAllReactions(ms.message, arrReactions, callback);
            })
            .catch((err) => {console.error(err + '---')});
    }

    static getMapsIcons(arr){
        const icons = {
            "The_Island": '557553943572643862',
            "The_Center": '557554097054547969',
            "Scorched_Earth": '557555459280863234',
            "Ragnarok": '557555459146645525',
            "Aberration": '557555367240794122',
            "Extinction": '557555367240925184',
            "Valguero": '623118547211517952',
        };
        let res = [];
        for(let i=0;i<arr.length;i++){
            res.push(icons[arr[i]]);
        }
        return res;
    }
}

module.exports = GetMap;
