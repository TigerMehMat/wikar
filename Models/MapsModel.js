const MainModel = require('./MainModel');

class MapsModel extends MainModel {
        constructor() {
                super();
        }

        /**
         * Получить карту по её части / слову
         * @param {string} mapName Название или часть названия карты
         * @return {Promise<Object>}
         */
        searchMap(mapName) {
                return new Promise((resolve, reject) => {
                        this.query('SELECT * FROM ark_maps WHERE name LIKE "%?%" OR aliases LIKE "%?%"', [mapName, mapName])
                                .then(resolve)
                                .catch(reject);
                });
        }

        /**
         * Получаем список всех карт
         * @return {Promise<Object>}
         */
        getAllMaps() {
                return new Promise((resolve, reject) => {
                        this.query('SELECT * FROM ark_maps WHERE `release` IS NOT NULL')
                                .then(resolve)
                                .catch(reject);
                });
        }
}

module.exports = MapsModel;