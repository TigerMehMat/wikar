const {Pool} = require("pg");
const config = require("../configbot");
const pool = new Pool(config.postgresql);

class MainModel {
        constructor() {
        }

        /**
         * Запрос к БД
         * @param {string} queryString Тело запроса
         * @param {string[]} values Массив ставляемых значений
         * @return {Promise<Array>}
         */
        async query(queryString, values = []) {

                const client = await pool.connect();
                let res;
                try {
                        await client.query("SET search_path TO 'test';");
                        res = await client.query(queryString, values);
                } finally {
                        client.release();
                }
                return res;
        }
}

module.exports = MainModel;
