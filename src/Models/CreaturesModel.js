const CreatureEntity = require('../Entites/CreatureEntity.js');
const MainModel = require('./MainModel.js');

/**
 * @typedef CreatureModel
 * @property {number} id
 * @property {string} en_name
 * @property {string} dv_alias
 * @property {string} ru_name
 * @property {string} ru_name_mn
 * @property {string} ru_name_rp
 * @property {string} sex
 * @property {string} dododex_alias
 * @property {string} map_alias
 * @property {?string} map_comment
 * @property {number} srt
 */

class CreaturesModel extends MainModel {

        query_where = '';
        where_elements = [];
        creature_name = '';
        limit = null;


        constructor() {
                super();
        }

        setLimit(limit) {
                this.limit = limit;
                return this;
        }

        prepareWhere() {
                this.query_where = `WHERE similarity(search_name, $1) > 0.2`;
                this.where_elements = [this.creature_name];
                return this;
        }

        prepareWhereByID(id) {
                this.query_where = "WHERE id = $1";
                this.where_elements = [id];
                return this;
        }

        execute() {
                return new Promise((resolve, reject) => {
                        let query = `SELECT *
                                FROM v_search_creatures
                                    ${this.query_where}
                                ORDER BY similarity(search_name, $1) DESC
                                ${((this.limit) ? "LIMIT "+ this.limit : "")}`;
                        this.query(query, this.where_elements)
                                .then(res => {
                                        resolve(res.rows);
                                })
                                .catch(reject);
                });
        }

        setCreatureName(creature_name) {
                this.creature_name = creature_name;
                return this;
        }

        /**
         * Возвращаем массив всех найденных существ
         * @return {Promise<CreatureEntity[]>}
         */
        search() {
                return new Promise((resolve, reject) => {
                        this.prepareWhere();
                        this.execute()
                                .then(value => {
                                        let result = [];
                                        value.forEach(el => {
                                                result.push(new CreatureEntity(el));
                                        });
                                        resolve(result);
                                })
                                .catch(reject);
                });
        }

        /**
         * Получаем первое существо которое смогли найти
         * @return {Promise<CreatureModel|null>}
         */
        searchOne() {
                return new Promise((resolve, reject) => {
                        this.setLimit(1);
                        this.search()
                                .then(res => {
                                        resolve(res.length > 0 ? res[0] : null);
                                })
                                .catch(reject);
                });
        }

        /**
         *
         * @param {Object} options
         * @return {Promise<unknown>}
         */
        addCreature(options) {
                return new Promise((resolve, reject) => {
                        options = this.filterToAdd(options, ['name', 'index', 'description', 'blueprintPath', 'icon', 'type', 'weight', 'maxQuantity', 'actualbp']);
                        let parcedColumns = Object.keys(options).join(', ');
                        let parcedValues = [];
                        let templates = [];
                        let to_update = [];
                        for (let val in options) {
                                parcedValues.push(options[val]);
                                templates.push('$' + parcedValues.length);
                                to_update.push(val + '=' + 'EXCLUDED.' + val);
                        }
                        // language=PostgreSQL
                        this.query(`INSERT INTO t_items (${parcedColumns}) VALUES (${templates.join(", ")}) ON CONFLICT (name) DO UPDATE SET ${to_update.join(', ')} RETURNING id`, parcedValues)
                                .then((res) => {
                                        if (res.rows.length === 0) resolve(null);
                                        resolve(res.rows[0].id);
                                })
                                .catch(reject);
                });
        }

        /**
         * Получение существа по ID
         * @param {number} id
         */
        async getCreatureByID(id) {
                this.prepareWhereByID(id);
                this.setLimit(1);
                let res = await this.execute();
                return res.length > 0 ? res[0] : null;
        }

        /**
         *
         * @param {Object} toFilterObject
         * @param {Array} allowedFields
         */
        filterToAdd(toFilterObject, allowedFields) {

                return Object.keys(toFilterObject)
                        .filter(key => allowedFields.includes(key))
                        .reduce((obj, key) => {
                                obj[key] = toFilterObject[key];
                                return obj;
                        }, {});
        }

        /**
         * @param {string} folder_name
         */
        getFolder(folder_name) {
                return new Promise((resolve, reject) => {
                        this.query('SELECT folder_id FROM t_items_folders WHERE name = $1', [folder_name])
                                .then((res) => {
                                        if (res.rows.length === 0) resolve(null);
                                        resolve(res.rows[0].folder_id);
                                })
                                .catch(reject);
                });
        }

        /**
         *
         * @param folder_name
         * @return {Promise<unknown>}
         */
        addFolder(folder_name) {
                return new Promise((resolve, reject) => {
                        this.query('INSERT INTO t_items_folders (name) VALUES ($1) RETURNING folder_id', [folder_name])
                                .then((res) => {
                                        if (res.rows.length === 0) resolve(null);
                                        resolve(res.rows[0].folder_id);
                                })
                                .catch(reject);
                });
        }

        linkFolder(folder_id, item_id) {
                return new Promise((resolve, reject) => {
                        this.query('INSERT INTO t_folder_to_item (item_id, folder_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [item_id, folder_id])
                                .then(resolve)
                                .catch(reject);
                });
        }
}

module.exports = CreaturesModel;
