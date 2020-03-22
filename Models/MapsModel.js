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
                let releaseRule = releaseOnly ? ' AND release <= NOW()' : '';
                return new Promise((resolve, reject) => {
                        this.query('SELECT id,name,url,reaction,aliases FROM ark_maps WHERE name ~* $1 OR aliases ~* $1 OR aliases ~* $2' + releaseRule, ['^' + mapName, ',' + mapName])
                                .then(res => {
                                        resolve(res.rows);
                                })
                                .catch(reject);
                });
        }

        /**
         * Получаем список всех карт
         * @return {Promise<Object>}
         */
        getAllMaps(releaseOnly = false) {
                let releaseRule = releaseOnly ? ' WHERE release <= NOW()' : '';
                return new Promise((resolve, reject) => {
                        this.query('SELECT * FROM ark_maps' + releaseRule)
                                .then(res => {
                                        resolve(res.rows);
                                })
                                .catch(reject);
                });
        }

        /**
         * Получаем список карт по их названиям
         * @param maps
         * @return {Promise<unknown>}
         */
        getInfoByMaps(maps) {
                return new Promise((resolve, reject) => {
                        this.query('SELECT * FROM ark_maps WHERE name IN (\'' + maps.join('\',\'') + '\')')
                                .then(res => {
                                        resolve(res.rows);
                                })
                                .catch(reject);
                });
        }
}

module.exports = MapsModel;