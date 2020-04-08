const MainModel = require('./MainModel');

class CreaturesModel extends MainModel {

        constructor() {
                super();
                this.query_where = '';
                this.joins = [];
                this.creature_name = '';
        }

        prepareWhere() {
                this.query_where = "WHERE ca.ru_name ~* $1\n" +
                        "OR ca.ru_name ~* $2\n" +
                        "OR ca.en_name ~* $1\n" +
                        "OR ca.en_name ~* $2\n" +
                        "OR cae.alias ~* $1\n" +
                        "OR car.alias ~* $1\n" +
                        "OR car.alias ~* $2\n" +
                        "OR ca.ru_name_mn ~* $1\n" +
                        "OR car.alias_mn ~* $1\n" +
                        "OR car.alias_mn ~* $2\n";
                return this;
        }

        prepareSearchJoins() {
                this.joins = this.joins.concat([
                        "LEFT JOIN creatures_aliases_en cae on ca.id = cae.creature_id",
                        "LEFT JOIN creatures_aliases_ru car on ca.id = car.creature_id",
                        "LEFT JOIN creatures_aliases_dododex cad on ca.id = cad.creature_id",
                        "LEFT JOIN creature_aliases_map cam on ca.id = cam.creature_id" // Для карт
                ]);
                return this;
        }

        execute() {
                return new Promise((resolve, reject) => {
                        let query = "SELECT DISTINCT ca.id, ca.en_name, COALESCE(ca.en_dv_alias, ca.en_name) AS dv_alias, ca.ru_name, ca.ru_name_mn, ca.ru_name_rp, ca.sex, COALESCE(cad.alias, ca.en_name) AS dododex_alias, REPLACE(COALESCE(cam.alias, ca.en_name), ' ', '_') AS map_alias, cam.comment AS map_comment, ca.srt, ca.id\n" +
                                "FROM creatures ca\n" +
                                this.joins.join('\n') + "\n" +
                                this.query_where + "\n" +
                                "ORDER BY ca.srt, ca.id";
                        this.query(query, ['^' + this.creature_name, ' ' + this.creature_name])
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

        search() {
                return new Promise((resolve, reject) => {
                        this.prepareWhere();
                        this.prepareSearchJoins();
                        this.execute()
                                .then(resolve)
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
                        this.query("INSERT INTO t_items (" + parcedColumns + ") " +
                                "VALUES (" + templates.join(", ") + ") " +
                                "ON CONFLICT (name) DO UPDATE SET " + to_update.join(', ') + " RETURNING id", parcedValues)
                                .then((res) => {
                                        if (res.rows.length === 0) resolve(null);
                                        resolve(res.rows[0].id);
                                })
                                .catch(reject);
                });
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