const MainModel = require('./MainModel.js');

class GlobalVarsModel extends MainModel {
        constructor() {
                super();
        }

        /**
         * Получить значение параметра
         * @param {string} name Название параметра
         */
        async getItem(name) {
                let res = await this.query('SELECT * FROM global_vars WHERE name = $1', [name]);
                return res.rows[0]['value'];
        }

        /**
         * Записать значение параметра
         * @param {string} name Название параметра
         * @param {string} value Новое значение параметра
         * @returns {Promise<void>}
         */
        async setItem(name, value) {
                await this.query('UPDATE global_vars SET value = $1 WHERE name = $2', [value, name]);
        }
}

module.exports = GlobalVarsModel;
