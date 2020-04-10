const MainModel = require('./MainModel');

class SavedParametersModel extends MainModel {
        constructor() {
                super();
                this.base_parameters = {
                        creature: null,
                        kibble: null,
                        rates: {

                        }
                };
                this.user_id = null;
                this.guild_id = null;
        }

        load() {

        }
}

module.exports = SavedParametersModel;