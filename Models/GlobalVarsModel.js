const MainModel = require('./MainModel');

class GlobalVarsModel extends MainModel {
        constructor() {
                super();
        }

        /**
         * Получить значение параметра
         * @param {string} name Название параметра
         */
        async getItem(name) {
                let res = await this.query('SELECT `value` FROM global_vars WHERE name = ?', [name]);
                return res[0]['value'];
        }

        /**
         * Записать значение параметра
         * @param {string} name Название параметра
         * @param {string} value Новое значение параметра
         * @returns {Promise<void>}
         */
        async setItem(name, value) {
                await this.query('UPDATE global_vars SET value = ? WHERE name = ?', [value, name]);
        }
}

module.exports = GlobalVarsModel;