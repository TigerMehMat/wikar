const MainModel = require('./MainModel');

class ItemsModel extends MainModel {
        constructor() {
                super();
        }

        search(item_name) {
                let searchName = '(^|\\s)' + item_name + '.*';
                return new Promise((resolve, reject) => {
                        this.query("SELECT name_ru, name, weight, maxquantity\n" +
                                "FROM t_items\n" +
                                "WHERE name ~* $1 OR\n" +
                                "name_ru ~* $1\n" +
                                "LIMIT 1", [searchName])
                                .then((res) => {
                                        resolve(res.rows[0]);
                                })
                                .catch(reject);
                });
        }

        get(item_name) {
                let searchName = '^' + item_name.trim() + '$';
                return new Promise((resolve, reject) => {
                        this.query("SELECT name_ru, name, weight, maxquantity\n" +
                                "FROM t_items\n" +
                                "WHERE name ~* $1 OR\n" +
                                "name_ru ~* $1\n" +
                                "LIMIT 1", [searchName])
                                .then((res) => {
                                        resolve(res.rows[0]);
                                })
                                .catch(reject);
                });
        }

        getName(item_name) {
                let searchName = '^' + item_name.trim() + '$';
                return new Promise((resolve, reject) => {
                        this.query("SELECT name_ru, name, weight, maxquantity\n" +
                                "FROM t_items\n" +
                                "WHERE name ~* $1 OR\n" +
                                "name_ru ~* $1\n" +
                                "LIMIT 1", [searchName])
                                .then((res) => {
                                        resolve(typeof res.rows[0] !== "undefined" ? res.rows[0].name_ru : item_name);
                                })
                                .catch(reject);
                });
        }
}

module.exports = ItemsModel;