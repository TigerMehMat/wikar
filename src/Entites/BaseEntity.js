class BaseEntity {
        required = 1;
        not_required = 0;

        constructor() {
                this.signature = [];
        }

        /**
         * Заполнить элемент данными
         * @param {Array} items
         */
        fillElements(items) {
                for(let el in this.signature) {
                        if(typeof items[el] !== "undefined") {
                                this[el] = items[el];
                        } else if(this.signature[el] === this.required) {
                                throw new Error("При записи в CreatureEntity не хватает данных!");
                        } else {
                                this[el] = null;
                        }
                }
        }
}

module.exports = BaseEntity;
