const AbstractParser = require('./AbstractParser.js');
const CreaturesModel = new (require('../Models/CreaturesModel.js'))();

class ItemsParser extends AbstractParser {
        getFirstItem() {
                return this.parsedFile.items.splice(0, 1);
        }

        async parseItems() {
                let parseItem = this.getFirstItem()[0];
                while (parseItem) {
                        //console.log(parceItem.name.replace(/\n/g, ' '));
                        parseItem['actualbp'] = parseItem.blueprintPath.replace(/^.*\.(.*?)$/, '$1');
                        console.log(parseItem['actualbp']);
                        let id = await CreaturesModel.addCreature(parseItem);
                        await this.parseFolder(id, parseItem['folders']);
                        parseItem = this.getFirstItem()[0];
                }
        }

        /**
         * Парсим папочки предмета
         * @param item_id
         * @param folders
         * @return {Promise<void>}
         */
        parseFolder(item_id, folders) {
                return new Promise(async (resolve, reject) => {
                        for (let val in folders) {
                                let folder_id = await CreaturesModel.getFolder(folders[val]);
                                if(!folder_id) {
                                        folder_id = await CreaturesModel.addFolder(folders[val]);
                                }
                                console.log(folder_id, item_id);
                                await CreaturesModel.linkFolder(folder_id, item_id);
                        }
                        resolve();
                })
        }
}

module.exports = ItemsParser;
