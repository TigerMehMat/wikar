const path = require('path');
const fs = require('fs');
const CreaturesNewModel = require('../Models/CreaturesNewModel.js');

class CreatureExtractor {
        extractor_path = '../data/Obelisk/data/wiki/species.json';
        extractor_data;
        extracted_data = [];

        /**
         * Получаем данные из файла
         */
        firstExtract() {
                try {
                        this.extractor_data = (JSON.parse(fs.readFileSync(path.join(__dirname, this.extractor_path), 'utf-8'))).species;
                } catch (e) {
                        throw new Error('Не удалось прочитать данные для экстракта. Или не парсится JSON или нет файла');
                }
                return this;
        }

        preParse() {
                return this;
        }

        extracting() {
                for (let creature of this.extractor_data) {
                        this.extracted_data.push({
                                'name': creature.name,
                                'bp': creature.bp,
                                'dinoNameTag': creature.dinoNameTag,
                                'customTag': creature.customTag,
                                'targetingTeamName': creature.targetingTeamName,
                                'mass': creature.mass,
                                'dragWeight': creature.dragWeight,
                        });
                }
                delete this.extractor_data;
                return this;
        }

        async save() {
                for (let creature of this.extracted_data) {
                        await (new CreaturesNewModel()).insert(creature);
                }
                console.log('Готово!');
        }
}

module.exports = CreatureExtractor;
