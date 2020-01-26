const MainModel = require('./MainModel');

class CreaturesModel extends MainModel {
        constructor() {
                super();
        }

        search(creatureName) {
                let searchName = creatureName + "%";
                return new Promise((resolve, reject) => {
                        this.query("SELECT DISTINCT ca.id, ca.en_name, ca.en_dv_alias, ca.ru_name, ca.ru_name_mn, ca.ru_name_rp, ca.sex, cad.alias AS dododex_alias\n" +
                                "FROM creatures ca\n" +
                                "LEFT JOIN creatures_aliases_en cae on ca.id = cae.creature_id\n" +
                                "LEFT JOIN creatures_aliases_ru car on ca.id = car.creature_id\n" +
                                "LEFT JOIN creatures_aliases_dododex cad on ca.id = cad.creature_id\n" +
                                "WHERE ca.ru_name LIKE ?\n" +
                                "OR ca.ru_name LIKE ?\n" +
                                "OR ca.en_name LIKE ?\n" +
                                "OR ca.en_name LIKE ?\n" +
                                "OR cae.alias LIKE ?\n" +
                                "OR car.alias LIKE ?\n" +
                                "OR ca.ru_name_mn LIKE ?\n" +
                                "OR car.alias_mn LIKE ?\n" +
                                "ORDER BY ca.srt, ca.id", [searchName, '% ' + creatureName + '%', searchName, '% ' + creatureName + '%', searchName, searchName, searchName, searchName])
                                .then(resolve)
                                .catch(reject);
                });
        }
}

module.exports = CreaturesModel;