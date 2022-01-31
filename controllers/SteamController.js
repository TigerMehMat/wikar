const axios = require('axios');

/**
 * API для стима
 */
class SteamController {

        constructor() {
                this.token = process.env.STEAM_TOKEN;
                this.instance = axios.create({
                        baseURL: 'http://api.steampowered.com',
                });
        }

        /*

        "steamid": "76561198874541964",
        "communityvisibilitystate": 3,
        "profilestate": 1,
        "personaname": "ELIOR",
        "lastlogoff": 1576774492,
        "commentpermission": 1,
        "profileurl": "https://steamcommunity.com/profiles/76561198874541964/",
        "avatar": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg",
        "avatarmedium": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
        "avatarfull": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
        "personastate": 1,
        "primaryclanid": "103582791429521408",
        "timecreated": 1544188011,
        "personastateflags": 0
         */

        /**
         * @typedef {Object} SteamReturnedPlayers
         * @property {string} steamid ID стима
         * @property {number} communityvisibilitystate
         * @property {number} profilestate
         * @property {string} personaname
         * @property {number} lastlogoff
         * @property {number} commentpermission
         * @property {string} profileurl
         * @property {string} avatar
         * @property {string} avatarmedium
         * @property {string} avatarfull
         * @property {number} personastate
         * @property {string} primaryclanid
         * @property {number} timecreated
         * @property {number} personastateflags
         */
        /**
         * Получаем данные о юзерах стима
         * @param {string[]} ids Массив идентификаторов
         * @return {Promise<SteamReturnedPlayers[]>}
         */
        getUsersByIds(ids) {
                return new Promise((resolve, reject) => {
                        this.instance.get('/ISteamUser/GetPlayerSummaries/v0002/', {
                                params: {
                                        'key': this.token,
                                        'steamids': ids.join(',')
                                }
                        })
                                .then((result) => {
                                        /**
                                         * @var {SteamReturnedPlayers[]} result.data.response.players
                                         */
                                        resolve(result.data.response.players);
                                })
                                .catch(reject);
                });
        }

        /**
         * @param {SteamReturnedPlayers[]} SteamReturnedPlayers
         */
        getNames(SteamReturnedPlayers) {
                let names = {};
                SteamReturnedPlayers.forEach((el) => {
                        names[el.steamid] = el.personaname;
                });
                return names;
        }
}

module.exports = SteamController;
