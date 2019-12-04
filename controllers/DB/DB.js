const mysql = require("mysql");
const config	= require("../../configbot");

// const sql_connect   = {
// 	"host":   "sql34.main-hosting.eu",
// 	"database":       "u116167615_wikar",
// 	"password":     "9LVBKtX06SIMnmHBbD",
// 	"user":     "u116167615_wikar",
// };

// const sql_connect_test   = {
// 	"host":   "sql34.main-hosting.eu",
// 	"database":       "u116167615_wikte",
// 	"password":     "123456",
// 	"user":     "u116167615_wikte",
// };

const poll	= mysql.createPool(config.mysql);


class DB {
	constructor() {}

	async query(queryString, values	= []) {
		return new Promise((resolve, reject) => {
			poll.query(queryString, values, function(error, results, fields){
				if(error){
					reject(error);
				}
				else {
					resolve(results);
				}
			});
		});
	}
}

module.exports = DB;
