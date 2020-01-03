const MainModel = require('./MainModel');

class MapsModel extends MainModel {
        constructor() {
                super();
        }

        /**
         * Получить карту по её части / слову
         * @param {string} mapName Название или часть названия карты
         * @param {boolean} releaseOnly Вернуть только релизные карты
         * @return {Promise<Object>}
         */
        searchMap(mapName, releaseOnly = false) {
                let releaseRule = releaseOnly ? ' AND `release` <= NOW()' : '';
                return new Promise((resolve, reject) => {
                        this.query('SELECT id,name,url,reaction,aliases FROM ark_maps WHERE name LIKE ? OR name LIKE ? OR aliases LIKE ? OR aliases LIKE ?' + releaseRule, [mapName + '%', ',' + mapName + '%',mapName + '%', ',' + mapName + '%'])
                                .then(resolve)
                                .catch(reject);
                });
        }

        /**
         * Получаем список всех карт
         * @return {Promise<Object>}
         */
        getAllMaps(releaseOnly = false) {
                let releaseRule = releaseOnly ? ' WHERE `release` <= NOW()' : '';
                return new Promise((resolve, reject) => {
                        this.query('SELECT * FROM ark_maps' + releaseRule)
                                .then(resolve)
                                .catch(reject);
                });
        }
}

module.exports = MapsModel;