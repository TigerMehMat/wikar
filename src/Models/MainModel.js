const Pool = require("pg").Pool;
const pool = new Pool({
        "host": process.env.POSTGRESQL_HOST,
        "port": process.env.POSTGRESQL_PORT,
        "database": process.env.POSTGRESQL_DATABASE,
        "password": process.env.POSTGRESQL_PASSWORD,
        "user": process.env.POSTGRESQL_USER,
        "max": process.env.POSTGRESQL_MAX,
        "schema": process.env.POSTGRESQL_SCHEMA,
    });

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
                        await client.query(`SET search_path TO '${process.env.POSTGRESQL_SCHEMA}';`);
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
