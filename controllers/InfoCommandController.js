const AbstractCommandController = require('./AbstractCommandController');
const CreaturesModel = require('../Models/CreaturesModel');
const DvDataController = require('./DvDataController');

class InfoCommandController extends AbstractCommandController {
        creature_name;
        creature;

        /**
         * Устанавливаем данные из аргументов вызова
         * @param {Array} args
         */
        async setArgs(args) {
                this.creature_name = args.join(' ');
                this.creature = await ((new CreaturesModel())
                        .setCreatureName(this.creature_name)
                        .searchOne());
        }

        async validate() {
                await super.validate();
                if(this.valid && !this.creature) {
                        this.valid = false;
                        await this.message.channel.send(`Тушканчики не нашли в базе существо с названием \`\`${this.creature_name}\`\`.`);
                }
        }

        async process() {
                if(!this.valid) return;
                const creature_data = (new DvDataController()).getCreature(this.creature.dv_alias);
                console.log(creature_data);
        }
}

module.exports = InfoCommandController;