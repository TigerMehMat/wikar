const BaseEntity = require('./BaseEntity');

class CreatureEntity extends BaseEntity {

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
                        'entity_id': this.not_required
                };
                this.fillElements(items);
        }
}

module.exports = CreatureEntity;
