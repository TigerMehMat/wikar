const Pool = require("pg").Pool;
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
                let client;
                try {
                        client = await pool.connect();
                } catch (e) {
                        throw new Error(`Ошибка подключения к базе ${e.message}`);
                }
                let res;
                try {
                        await client.query(`SET search_path TO '${config.postgresql.schema}';`);
                        res = await client.query(queryString, values);
                } catch (e) {
                        console.error('Ошибка подключения к БД');
                        console.error(e);
                } finally {
                        client.release();
                }
                return res;
        }
}

module.exports = MainModel;
