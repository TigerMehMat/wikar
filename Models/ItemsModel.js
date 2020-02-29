const MainModel = require('./MainModel');

class ItemsModel extends MainModel {
        constructor() {
                super();
        }

        search(creatureName) {
                let searchName = '(^|\\s)' + creatureName + '.*';
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
}

module.exports = ItemsModel;