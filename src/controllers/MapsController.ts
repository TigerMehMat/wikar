const env = require('../env');
const http = require('https');
const sharp = require('sharp');
const CreaturesModel = require('../Models/CreaturesModel.js');
const Discord = require('discord.js');
const DiscordHelper = require('./GlobalControllers/DiscordHelper.js');

const fs = require('fs');
const path = require('path');

const MapsModel = new (require('../Models/MapsModel.js'));
const AbstractCommandController = require('./AbstractCommandController.js');

const wikiBot = require('../wikibot/index');

/**
 * Класс, отвечающий за ответ на команду !карта
 */
class MapsController extends AbstractCommandController {
    map;
    creature;
    raw_data = {
        map: undefined,
        creature: undefined
    };

    /**
     * @inheritDoc
     */
    async setArgs(args) {
        let is_map = args.pop();
        let map = await MapsModel.searchMap(is_map, true);
        if (map.length === 0) {
            args.push(is_map);
        } else {
            this.map = map[0];
            this.raw_data.map = is_map;
        }
        if (args.length > 0) {
            this.creature = await (new CreaturesModel())
                .setCreatureName(args.join(' '))
                .searchOne();
            this.raw_data.creature = args.join(' ');
        }
        return this;
    }

    /**
     *
     * @return {MapsController}
     */
    async validate() {
        await super.validate();
        if (this.valid) {
            this.valid = !!(this.creature || this.map);
            if (!this.valid) {
                await this.message.channel.send(`По вашему запросу не нашлось карт или существ с названием \`\`${this.raw_data.creature}\`\`.`);
            }
        }
        if (this.valid && this.creature === null) {
            this.valid = false;
            await this.message.channel.send(`В нашей базе не нашлось существа \`\`${this.raw_data.creature}\`\`.`);
        }
        return this;
    }

    async process() {
        if (!this.valid) return;
        this.message.channel.startTyping();

        if (this.map && !this.creature) {
            await this.processOnlyMap();
        } else if (this.creature && !this.map) {
            await this.processCreature();
        } else if (this.creature && this.map) {
            await this.processMapAndCreature();
        } else {
            throw new Error('Мы не должны сюда попадать в мап контроллере');
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
            let map_name = this.map.url;
            const mapPath = path.resolve(env.PATH_DATA, 'maps/' + map_name + '.jpg');
            try {
                buffer = fs.readFileSync(path.resolve(env.PATH_CACHE, 'maps/' + this.creature.map_alias + '-' + map_name + '.jpg'));
                resolve(buffer);
            } catch (e) {
                let res;
                try {
                    res = await this.getWikiImage();
                } catch (e1) {
                    resolve(false);
                    return;
                }
                res = res.replace(' width="300" height="300"', ' width="1024" height="1024"');
                res = res.replace(' filter="url(#blur)"', '');
                res = res.replace('opacity="0.7"', 'opacity="0.9"');
                res = res.replace('</style>', 'rect { stroke: #000; stroke-width: 0.5px; stroke-linejoin: round }</style>');
                res = res.replace(/<rect/g, '<rect rx="1" ry="1"');
                sharp(mapPath)
                    .composite([{'input': Buffer.from(res)}])
                    .jpeg({"quality": 70, nearLossless: true})
                    .toBuffer((err, info) => {
                        if (err) {
                            console.error(err);
                            reject('Произошла ошибка записи файла...');
                        } else {
                            try {
                                fs.readdirSync(path.resolve(env.PATH_CACHE, 'maps'));
                            } catch (e) {
                                fs.mkdirSync(path.resolve(env.PATH_CACHE, 'maps'), {
                                    recursive: true,
                                });
                            }
                            fs.writeFileSync(path.resolve(env.PATH_CACHE, 'maps/' + this.creature.map_alias + '-' + map_name + '.jpg'), info);
                            resolve(info);
                        }
                    });
            }
        });

    }

    getWikiImage() {
        return new Promise((resolve, reject) => {
            wikiBot.getWikiImage(this.generateLink(this.map))
                .then(res => {
                    if (res) {
                        http.get(res, (res2) => {
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
                    } else {
                        reject(false);
                    }
                });
        });
    }

    /**
     *
     * @return {Promise<void>}
     */
    async processOnlyMap() {
        const attachment = new Discord.MessageAttachment(path.resolve(env.PATH_DATA, './maps/' + this.map.url + '.jpg'), "map.jpg");
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
        let maps = await MapsModel.getMapsForCreature(this.creature);
        if (maps.length === 0) {
            const official_maps = await MapsModel.getAllMaps(true);
            const check_maps = await this.getAllMapsListForCreature(official_maps);
            maps = await MapsModel.setCreatureMaps(check_maps, this.creature);
        }
        return maps;
    }

    /**
     *
     * @param maps
     * @param resultMaps
     * @return {Promise<Array>}
     */
    getAllMapsListForCreature(maps, resultMaps = []) {
        return new Promise((resolve) => {
            if (maps.length === 0) {
                resolve(resultMaps);
            }
            let currentMap = maps.shift();

            wikiBot.getWikiImage(this.generateLink(currentMap))
                .then(async map_request => {
                if (map_request) resultMaps.push(currentMap);
                resolve(await this.getAllMapsListForCreature(maps, resultMaps));
            });
        });
    }

    generateLink(map) {
        if (map.name === 'Genesis') map.url = 'Genesis_Part_1';// Костыль для долбанного генезиса
        return `Spawning_${encodeURIComponent(this.creature.map_alias)}_${map.url}.svg`;
    }

    getActualLink(text) {
        let searchStart = '<div class="fullImageLink" id="file"><a href="';
        let pos = text.indexOf(searchStart);
        if (pos === -1) return false;
        text = text.substr(pos + searchStart.length);
        return text.substr(0, text.indexOf('"'));
    }

    static getAliases() {
        return [
            'карта'
        ];
    }
}

module.exports = MapsController;
