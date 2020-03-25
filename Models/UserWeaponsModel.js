const MainModel = require('./MainModel');

class UserWeaponsModel extends MainModel {
        constructor() {
                super();
        }

        /**
         *
         * @param {string} user_id
         */
        getWeaponByUser(user_id) {
                return new Promise((resolve, reject) => {
                        this.query('SELECT precent FROM user_weapons WHERE user_id = $1', [user_id])
                                .then(res => {
                                        resolve(res.rows.length > 0 ? res.rows[0] : 100);
                                })
                                .catch(reject);
                });
        }
}

module.exports = UserWeaponsModel;