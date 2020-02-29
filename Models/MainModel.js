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
                // return new Promise((resolve, reject) => {
                //         let pool = new Pool(config.postgresql);
                //         let result;
                //         pool.connect()
                //                 .then((client) => {
                //                         console.log(1);
                //                         client.query("SET search_path TO 'test';")
                //                                 .then(() => {
                //                                         console.log(2);
                //                                         return client.query(queryString, values);
                //                                 })
                //                                 .then(async (res) => {
                //                                         console.log(3);
                //                                         result = res;
                //                                         client.release();
                //                                         resolve(res.rows);
                //                                 })
                //                                 .catch(reject)
                //                 })
                //                 .catch(reject);
                // });

                const client = await pool.connect();
                let res;
                try {
                        await client.query("SET search_path TO 'test';");
                        res = await client.query(queryString, values);
                } finally {
                        // Make sure to release the client before any error handling,
                        // just in case the error handling itself throws an error.
                        client.release();
                }
                return res;
        }
}

module.exports = MainModel;