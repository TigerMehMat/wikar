const mysql = require("mysql");
const config = require("../configbot");

const poll	= mysql.createPool(config.mysql);

class MainModel {
        constructor() {}

        /**
         * Запрос к БД
         * @param {string} queryString Тело запроса
         * @param {string[]} values Массив ставляемых значений
         * @return {Promise<Array>}
         */
        async query(queryString, values = []) {
                return new Promise((resolve, reject) => {
                        poll.query(queryString, values, function (error, results, fields) {
                                if (error) {
                                        reject(error);
                                } else {
                                        resolve(results);
                                }
                        });
                });
        }
}

module.exports = MainModel;