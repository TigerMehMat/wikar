const BaseEntity = require('./BaseEntity');
class CreatureEntity extends BaseEntity {
        /** @var {number} */
        id;
        /** @var {string} */
        en_name;
        /** @var {string} */
        dv_alias;
        /** @var {string} */
        ru_name;
        /** @var {string} */
        ru_name_mn;
        /** @var {string} */
        ru_name_rp;
        /** @var {string} */
        sex;
        /** @var {number} */
        srt;
        /** @var {number} */
        parent;
        /** @var {string} */
        entity_id;
        /** @var {string} */
        map_alias;

        constructor(items) {

                super();
                this.signature = {
                        'id': this.required,
                        'en_name': this.required,
                        'dv_alias': this.not_required,
                        'ru_name': this.required,
                        'ru_name_mn': this.required,
                        'ru_name_rp': this.required,
                        'sex': this.required,
                        'srt': this.required,
                        'parent': this.not_required,
                        'entity_id': this.not_required,
                        'map_alias': this.required
                };
                this.fillElements(items);
        }
}

module.exports = CreatureEntity;
