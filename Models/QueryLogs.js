const MainModel = require('./MainModel');

class QueryLogs extends MainModel {

        constructor() {
                super();
        }

        send({
                     query,
                     guild = null,
                     channel = null,
                     message = null,
                     author = null
             }) {
                return new Promise((resolve, reject) => {
                        this.query(
                                        `INSERT INTO query_logs (command, author, guild, channel, message)
                                         VALUES ($1, $2, $3, $4, $5)`,
                                [query, guild, channel, message, author]
                        )
                                .then(res => {
                                        resolve(res.rows);
                                })
                                .catch(reject);
                });
        }
}


module.exports = QueryLogs;