const fs = require('fs');

class AbstractParser {
        /**
         *
         * @param {string} filePath Путь до файла
         */
        constructor(filePath) {
                if(typeof filePath !== "string") throw new Error('filePath должен быть строкой, а прилетел ' + typeof filePath);
                if(!filePath) throw new Error('filePath не может быть пустым');
                this.filePath = filePath;
                try {
                        this.parsedFile = JSON.parse(fs.readFileSync(this.filePath));
                } catch (e) {
                        throw new Error('Не удалось прочитать файл (' + e.message + ')');
                }
        }
}

module.exports = AbstractParser;

a
s
b