let Updater = require('./GlobalControllers/updater');

const ARK_api = require('./GlobalControllers/ARK_api');
const Discord = require('discord.js');

const GlobalVarsModel = new (require('../Models/GlobalVarsModel'));

class RatesUpdater extends Updater {
        rateByType = {
                TamingSpeedMultiplier: 'Приручение',
                HarvestAmountMultiplier: 'Сбор ресурсов',
                XPMultiplier: 'Опыт',
                MatingIntervalMultiplier: 'Интервал спаривания',
                BabyMatureSpeedMultiplier: 'Скорость взросления',
                EggHatchSpeedMultiplier: 'Скорость инкубации / беременности',
                CropGrowthSpeedMultiplier: 'Скорость роста овощей и ягоды',
                CustomRecipeEffectivenessMultiplier: 'Эффективность пользовательских рецептов'
        };

        async runFunction() {
                await super.runFunction();
                let last_rates = JSON.parse(await GlobalVarsModel.getItem('rates'));
                let current_rates = await ARK_api.getRates();
        }
}

module.exports = RatesUpdater;