const MainModel = require('./MainModel.js');

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
                        this.query('SELECT * FROM ark_maps' + releaseRule + ' ORDER BY release')
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
                        this.query(`SELECT * FROM ark_maps WHERE name IN ('${maps.join("'','")}')`)
                                .then(res => {
                                        resolve(res.rows);
                                })
                                .catch(reject);
                });
        }

        /**
         * Получить информацию о картах для существа
         * @return {Promise<Array>}
         */
        getMapsForCreature(creature) {
                return new Promise((resolve, reject) => {
                        if (!creature || !creature.id) throw new Error('Не передано существо для поиска карты');
                        this.query(`SELECT id,
                                           name,
                                           url,
                                           aliases,
                                           reaction,
                                           release,
                                           is_flag
                                    FROM ark_maps
                                             LEFT JOIN t_creature_map_cash tcmc
                                                       on ark_maps.id = tcmc.map_id AND tcmc.creature_id = $1
                                    WHERE release <= now()
                                      AND (is_flag = true OR is_flag ISNULL)
                                    ORDER BY is_flag, release`, [creature.id])
                                .then(res => {
                                        if (res.rows.length !== 0 && res.rows[0].is_flag === null) {
                                                resolve([]);
                                                return;
                                        }
                                        resolve(res.rows);
                                })
                                .catch(reject);
                });
        }

        /**
         * @param maps
         * @param creature
         */
        setCreatureMaps(maps, creature) {
                return new Promise((resolve, reject) => {
                        if (!creature || !creature.id) throw new Error('Не передано существо для поиска карты');
                        this.query(`
                            DELETE
                            FROM t_creature_map_cash
                            WHERE creature_id = $1
                        `, [creature.id])
                                .then(() => {
                                        const query = `
                                                DELETE FROM t_creature_map_cash WHERE creature_id = ${creature.id};
                                        `;
                                        return this.query(query);
                                })
                                .then(() => {
                                        const query = `
                                                SELECT * FROM ark_maps WHERE release < now()
                                        `;
                                        return this.query(query);
                                })
                                .then((all_maps) => {
                                        all_maps = all_maps.rows;
                                        let items = [];
                                        all_maps.forEach((el) => {
                                                const is_flag = (maps.filter((elem) => elem.id === el.id).length > 0) ? 'TRUE' : 'FALSE';
                                                items.push(`(${creature.id}, ${el.id}, ${is_flag})`);
                                        });
                                        const query = `
                                                INSERT INTO t_creature_map_cash (creature_id, map_id, is_flag) VALUES ${items.join(',')}
                                                RETURNING *;
                                        `;
                                        return this.query(query);
                                })
                                .then(() => {
                                        const res = this.getMapsForCreature(creature);
                                        resolve(res);
                                })
                                .then(() => {

                                })
                                .catch(reject);
                });
        }
}

module.exports = MapsModel;
