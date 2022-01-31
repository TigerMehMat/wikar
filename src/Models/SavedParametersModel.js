const MainModel = require('./MainModel.js');

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
                let query = "SELECT * FROM t_saved_parameters tsp\n" +
                        "INNER JOIN discord_servers ds on tsp.discord_id = ds.id\n" +
                        "WHERE ds.discord_id = $1\n" +
                        "AND tsp.\"user\" = $2;";
        }
}

module.exports = SavedParametersModel;
