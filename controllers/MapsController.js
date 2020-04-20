const http = require('https');
const sharp = require('sharp');
const CreaturesModel = require('../Models/CreaturesModel');
const Discord = require('discord.js');
const DiscordHelper = require('./GlobalControllers/DiscordHelper');

const fs = require('fs');
const path = require('path');

const BadRequestsModel = new (require('../Models/BadRequestsModel'));
const MapsModel = new (require('../Models/MapsModel'));

/**
 * Класс, отвечающий за ответ на команду !карта
 */
class MapsController {
        map;
        creature;
        message;

        /**
         * Установить данные по аргументам
         * @param {string[]} args
         * @return {Promise<MapsController>}
         */
        async setArgs(args) {
                let is_map = args.pop();
                let map = await MapsModel.searchMap(is_map, true);
                if (map.length === 0) {
                        this.map = undefined;
                        args.push(is_map);
                } else {
                        this.map = map[0];
                }
                if (args.length > 0) {
                        this.creature = await (new CreaturesModel())
                                .setCreatureName(args.join(' '))
                                .searchOne();
                }
                return this;
        }

        async setMessage(message) {
                this.message = message;
                return this;
        }

        /**
         *
         * @return {MapsController}
         */
        validate() {
                this.valid = !(!this.message || (!this.creature && !this.map));
                return this;
        }

        async process() {
                this.message.channel.startTyping();

                if (this.map && this.creature === null) {
                        await this.message.channel.send('В нашей базе не нашлось существа.');
                } else if (this.map && !this.creature) {
                        await this.processOnlyMap();
                } else if (this.creature && !this.map) {
                        await this.processCreature();
                } else if (this.creature && this.map) {
                        await this.processMapAndCreature();
                } else {
                        await this.message.channel.send('По вашему запросу не нашлось карт или существ.');
                }

                this.message.channel.stopTyping();
        }

        async processMapAndCreature() {
                let map = await this.getMap();
                let embed = new Discord.MessageEmbed()
                        .setAuthor(this.message.author.username, this.message.author.avatarURL())
                        .setTitle(this.creature.ru_name_mn + ' на карте ' + this.map.name);
                try {
                        await this.message.react(this.map.reaction);
                } catch (e) {
                        console.log(e);
                }
                if (!map && !this.creature.map_comment) {
                        embed
                                .setTitle(this.creature.ru_name)
                                .setDescription('Скорее всего не водится на карте ' + this.map.name);
                }
                if (map) {
                        const attachment = new Discord.MessageAttachment(map, "map.jpg");
                        embed
                                .attachFiles([attachment])
                                .addField('<:cave:557481898088333342> - Пещеры', '\u200B', true)
                                .addField('<:untamed:557480015533441024> - Неприручаемые', '\u200B', true)
                                .setImage('attachment://map.jpg');
                }
                if (this.creature.map_comment) {
                        embed
                                .setDescription(this.creature.map_comment);
                }
                this.message.channel.stopTyping();
                this.message.channel.send(embed)
                        .catch(console.error);
        }

        async getMap() {
                return new Promise(async (resolve, reject) => {
                        let buffer;
                        try {
                                buffer = fs.readFileSync(path.resolve(__dirname, '../cash/maps/' + this.creature.map_alias + '-' + this.map.name + '.jpg'));
                                resolve(buffer);
                        } catch (e) {
                                let res;
                                try {
                                        res = await this.getWikiImage();
                                } catch (e1) {
                                        resolve(false);
                                        return;
                                }
                                res = res.replace(' filter="url(#blur)"', '');
                                res = res.replace('opacity="0.7"', 'opacity="0.9"');
                                res = res.replace('</style>', 'rect { stroke: #000; stroke-width: 0.5px; stroke-linejoin: round }</style>');
                                res = res.replace(/<rect/g, '<rect rx="1" ry="1"');
                                sharp('./maps/' + this.map.url + '.jpg')
                                        .composite([{'input': Buffer.from(res)}])
                                        .jpeg({"quality": 70, nearLossless: true})
                                        .toBuffer((err, info) => {
                                                if (err) {
                                                        console.error(err);
                                                        reject('Произошла ошибка записи файла...');
                                                } else {
                                                        try {
                                                                fs.readdirSync(path.resolve(__dirname, '../cash/maps'));
                                                        } catch (e) {
                                                                fs.mkdirSync(path.resolve(__dirname, '../cash/maps'));
                                                        }
                                                        fs.writeFileSync(path.resolve(__dirname, '../cash/maps/' + this.creature.map_alias + '-' + this.map.name + '.jpg'), info);
                                                        resolve(info);
                                                }
                                        });
                        }
                });

        }

        getWikiImage() {
                return new Promise((resolve, reject) => {
                        let link = this.generateLink(this.map);
                        http.get(link, (res) => {
                                let {statusCode} = res;

                                if (statusCode !== 200) {
                                        reject(404);
                                        return;
                                }


                                res.setEncoding('utf8');
                                let rawData = '';
                                res.on('data', (chunk) => rawData += chunk);
                                res.on('end', () => {
                                        let imageLink = this.getActualLink(rawData);
                                        if (!imageLink) {
                                                reject(400);
                                                return;
                                        }
                                        http.get(imageLink, (res2) => {
                                                let statusCode2 = res2.statusCode;

                                                if (statusCode2 !== 200) {
                                                        console.error('Status code not 200: ' + statusCode2);
                                                        reject(400);
                                                        return;
                                                }


                                                res2.setEncoding('utf8');
                                                let rawData2 = '';
                                                res2.on('data', (chunk2) => rawData2 += chunk2);
                                                res2.on('end', () => {
                                                        rawData2 = rawData2.replace(' width="300" height="300"', ' width="1024" height="1024"');
                                                        resolve(rawData2);
                                                });
                                        });
                                });
                        });
                });
        }

        /**
         *
         * @return {Promise<void>}
         */
        async processOnlyMap() {
                const attachment = new Discord.MessageAttachment('./maps/' + this.map.url + '.jpg', "map.jpg");
                try {
                        await this.message.react(this.map.reaction);
                } catch (e) {
                        console.error(e);
                }
                let embed = new Discord.MessageEmbed()
                        .setAuthor(this.message.author.username, this.message.author.avatarURL())
                        .setTitle('Карта ' + this.map.name)
                        .attachFiles([attachment])
                        .setImage('attachment://map.jpg');
                this.message.channel.stopTyping();
                await this.message.channel.send(embed);
        }

        async processCreature() {
                let maps = await this.getMapListForCreature();
                if (maps.length === 1) {
                        this.map = maps[0];
                        await this.processMapAndCreature();
                } else if (maps.length > 1) {
                        let reactions = maps.map(el => el.reaction);
                        let reactionFilter = (reaction, user) => {
                                return reactions.indexOf(reaction.emoji.id) !== -1 && user.id === this.message.author.id && !user.bot;
                        };
                        this.message.awaitReactions(reactionFilter, {
                                max: 1,
                                time: 60000,
                                errors: ['time']
                        })
                                .then((collected) => {
                                        this.reactions_sender.stop();
                                        this.message.reactions.removeAll()
                                                .then(() => {
                                                        this.map = maps.find(el => el.reaction === collected.first().emoji.id);
                                                        this.processMapAndCreature();

                                                })
                                                .catch(console.error);
                                })
                                .catch((res) => {
                                        if (res instanceof Discord.Collection) {
                                                this.message.reactions.removeAll()
                                                        .catch(console.error);
                                                let embed = new Discord.MessageEmbed()
                                                        .setDescription("Вы не указали карту для " + this.creature.ru_name_rp + " в [сообщении](" + this.message.url + ").");
                                                this.message.channel.send(embed)
                                                        .catch(console.error);
                                        } else {
                                                console.error(res + ' error instanceof');
                                        }
                                });
                        this.reactions_sender = DiscordHelper.reactionsSender();
                        await (this.reactions_sender
                                .setMessage(this.message)
                                .setReactions(reactions)
                                .execute());

                        this.message.channel.stopTyping();
                } else {
                        let message_to_send = (this.creature.map_comment)
                                ? this.creature.map_comment
                                : "Не получилось найти карту для этого существа";
                        let embed = (new Discord.MessageEmbed())
                                .setAuthor(this.message.author.username, this.message.author.avatarURL())
                                .setTitle(this.creature.ru_name)
                                .setDescription(message_to_send);
                        await this.message.channel.send(embed);
                }
        }

        async getMapListForCreature() {
                let mapsCash = fs.readFileSync(path.resolve(__dirname, '../data/map/spawnonmaps.json'), 'utf-8');
                let mapsCashObj = JSON.parse(mapsCash);

                if (typeof mapsCashObj[this.creature.map_alias] !== 'undefined') {
                        return await MapsModel.getInfoByMaps(mapsCashObj[this.creature.map_alias]);
                } else {
                        let maps = await MapsModel.getAllMaps(true);
                        /** @var {Array} */
                        let all_maps = await this.getAllMapsListForCreature(maps);
                        if (all_maps.length !== 0) {
                                mapsCashObj[this.creature.map_alias] = all_maps.map(el => el.name);
                                fs.writeFileSync(path.resolve(__dirname, '../data/map/spawnonmaps.json'), JSON.stringify(mapsCashObj));
                        }
                        return all_maps;
                }
        }

        getAllMapsListForCreature(maps, resultMaps = []) {
                return new Promise((resolve, reject) => {
                        if (maps.length === 0) {
                                resolve(resultMaps);
                        }
                        let currentMap = maps.shift();

                        http.get(this.generateLink(currentMap), async map_request => {
                                if (map_request.statusCode === 200) resultMaps.push(currentMap);
                                resolve(await this.getAllMapsListForCreature(maps, resultMaps));
                        });
                });
        }

        generateLink(map) {
                if (map.name === 'Genesis') map.url = 'Genesis_Part_1';
                return "https://ark.gamepedia.com/File:Spawning_" + encodeURIComponent(this.creature.map_alias) + "_" + map.url + ".svg";
        }

        getActualLink(text) {
                let searchStart = '<div class="fullImageLink" id="file"><a href="';
                let pos = text.indexOf(searchStart);
                if (pos === -1) return false;
                text = text.substr(pos + searchStart.length);
                return text.substr(0, text.indexOf('"'));
        }
}

module.exports = MapsController;
