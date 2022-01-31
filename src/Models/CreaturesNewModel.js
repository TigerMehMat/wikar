/**
 * @typedef CreatureData
 * @property {string} name
 * @property {string} bp
 * @property {string} dinoNameTag
 * @property {string} customTag
 * @property {string} targetingTeamName
 * @property {number} mass
 * @property {number} dragWeight
 * @property {number} attack_defaultDmg
 * @property {number} attack_defaultSwingRadius
 */

/**
 * @typedef AttackData
 * @property {string} bp
 * @property {string} name
 * @property {number} interval
 * @property {number} dmg
 * @property {number} radius
 * @property {number} stamina
 * @property {boolean} isProjectile
 */

const MainModel = require('./MainModel.js');


class CreaturesNewModel extends MainModel {

        /**
         * Вставить данные о существе
         * @param {CreatureData[]} creatures_data
         */
        async insertCreatures(creatures_data) {
                let query_values = [];
                let query_values_ins = [];
                let i = 0;
                for(let creature of creatures_data) {
                        query_values.push(creature.name);
                        query_values.push(creature.bp);
                        query_values.push(creature.dinoNameTag);
                        query_values.push(creature.customTag);
                        query_values.push(creature.mass);
                        query_values.push(creature.dragWeight);
                        query_values.push(creature.targetingTeamName);
                        query_values.push(creature.attack_defaultDmg);
                        query_values.push(creature.attack_defaultSwingRadius);
                        let step = i*9;
                        query_values_ins.push(`($${step+1},$${step+2},$${step+3},$${step+4},$${step+5},$${step+6},$${step+7},$${step+8},$${step+9})`);
                        i++;
                }

                let query = `INSERT INTO creatures_new (name, bp, "dinoNameTag", "customTag", mass, "dragWeight",
                                                        "targetingTeamName", "attack_defaultDmg",
                                                        "attack_defaultSwingRadius") VALUES ${query_values_ins.join(',')} ON CONFLICT ON CONSTRAINT creatures_new_pk DO UPDATE SET name                        = excluded.name,
                                     "dinoNameTag"               = excluded."dinoNameTag",
                                     "customTag"                 = excluded."customTag",
                                     mass                        = excluded.mass,
                                     "dragWeight"                = excluded."dragWeight",
                                     "targetingTeamName"         = excluded."targetingTeamName",
                                     "attack_defaultDmg"         = excluded."attack_defaultDmg",
                                     "attack_defaultSwingRadius" = excluded."attack_defaultSwingRadius"
                `;
                return await this.query(query, query_values);
        }

        /**
         *
         * @param {AttackData[]} attacks
         * @return {Promise<Array>}
         */
        async insertAttacks(attacks) {
                let query_values = [];
                let query_values_ins = [];
                let i = 0;
                for (let attack of attacks) {
                        query_values.push(attack.bp);
                        query_values.push(attack.name);
                        query_values.push(attack.interval);
                        query_values.push(attack.dmg);
                        query_values.push(attack.radius);
                        query_values.push(attack.stamina);
                        query_values.push(attack.isProjectile);
                        let step = i*7;
                        query_values_ins.push(`($${step+1},$${step+2},$${step+3},$${step+4},$${step+5},$${step+6},$${step+7})`);
                        i++;
                }
                let query = `INSERT INTO attacks (bp, name, interval, dmg, radius, stamina, "isProjectile") VALUES ${query_values_ins.join(',')}`;
                return await this.query(query, query_values)
        }

        /**
         *
         * @param {[]} variants
         * @return {Promise<Array>}
         */
        async insertVariants(variants) {
                let query_values = [];
                let query_values_ins = [];
                let i = 0;
                for (let variant of variants) {
                        query_values.push(variant.bp);
                        query_values.push(variant.variant);
                        let step = i*2;
                        query_values_ins.push(`($${step+1},$${step+2})`);
                        i++;
                }
                let query = `INSERT INTO creatures_variants (bp, variant) VALUES ${query_values_ins.join(',')} ON CONFLICT DO NOTHING`;
                return await this.query(query, query_values);
        }

        async truncateAttacks() {
                let query = `TRUNCATE attacks`;
                return await this.query(query);
        }
}

module.exports = CreaturesNewModel;
