const CreaturesNewModel = require('../Models/CreaturesNewModel');
const AbstractFileJSONExtractor = require('./AbstractFileJSONExtractor');

class CreatureExtractor extends AbstractFileJSONExtractor {
        extractor_path = '../data/Obelisk/data/wiki/species.json';
        extracted_data = [];
        extracted_attacks = [];
        extracted_variants = [];

        extracting() {
                for (let creature of this.extractor_data.species) {
                        this.extracted_data.push({
                                'name': creature.name.trim(),
                                'bp': creature.bp.trim(),
                                'dinoNameTag': creature.dinoNameTag.trim(),
                                'customTag': creature.customTag.trim(),
                                'targetingTeamName': creature.targetingTeamName.trim(),
                                'mass': creature.mass,
                                'dragWeight': creature.dragWeight,
                                'attack_defaultDmg': creature.attack.defaultDmg,
                                'attack_defaultSwingRadius': creature.attack.defaultSwingRadius,
                        });
                        if (typeof creature.attack.attacks !== "undefined") {
                                for (let attack of creature.attack.attacks) {
                                        attack.bp = creature.bp;
                                        attack.isProjectile = attack.isProjectile || false;
                                        this.extracted_attacks.push(attack);
                                }
                        }
                        if (typeof creature.variants !== "undefined") {
                                for (let variant of creature.variants) {
                                        this.extracted_variants.push({
                                                'variant': variant,
                                                'bp': creature.bp
                                        });
                                }
                        }
                }
                delete this.extractor_data;
                return this;
        }

        async save() {
                console.log('Заполняем существ');
                await (new CreaturesNewModel()).insertCreatures(this.extracted_data);
                console.log('Дропаем атаки');
                await (new CreaturesNewModel()).truncateAttacks();
                console.log('Заполняем атаки');
                await (new CreaturesNewModel()).insertAttacks(this.extracted_attacks);
                console.log('Заполняем варианты');
                await (new CreaturesNewModel()).insertVariants(this.extracted_variants);
        }
}

module.exports = CreatureExtractor;
