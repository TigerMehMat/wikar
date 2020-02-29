const ItemsModel = new (require('../Models/ItemsModel'))();

class ItemsController {
        setMessage(message) {
                this.message = message;
                return this;
        }

        setArgs(args) {
                this.name = args.join(' ');
                return this;
        }

        setMessageAccess(messageAccess) {
                this.messageAccess = messageAccess;
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
}

module.exports = ItemsController;