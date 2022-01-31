const AbstractCommandController = require("./AbstractCommandController.js");
const ItemsModel = new (require('../Models/ItemsModel.js'))();

class ItemsController extends AbstractCommandController {
        async setArgs(args) {
                this.name = args.join(' ');
                return this;
        }

        async process() {
                let item = await ItemsModel.search(this.name);
                let result = '';
                if(item) {
                        result = item.name_ru + ' - ' + item.name + '\n' +
                                'Стакается по ' + item.maxquantity + ' и весит ' + item.weight + ' (' + (item.maxquantity*item.weight) + ' кг стак)';
                } else {
                        result = 'Не удалось найти =(';
                }
                try {
                        await this.message.channel.send(result);
                } catch (e) {
                        console.error(e.message);
                }
        }

        static getAliases() {
                return [
                        "предмет"
                ];
        }
}

module.exports = ItemsController;
