const path = require('path');
const fs = require('fs');
const readline = require('readline');

class AbstractFileJSONExtractor {
        extractor_path;
        extractor_data;

        /**
         * Получаем данные из файла
         */
        firstExtract() {
                if(!this.extractor_path) throw new Error('Не указан файл экспорта.')
                try {
                        this.extractor_data = (JSON.parse(fs.readFileSync(path.join(__dirname, this.extractor_path), 'utf-8')));
                } catch (e) {
                        throw new Error('Не удалось прочитать данные для экстракта. Или не парсится JSON или нет файла');
                }
                return this;
        }

        preParse() {
                return this;
        }

        writeWaitingPercent(current, max, message = 'подождите') {
                readline.clearLine(process.stdout, 0);
                readline.cursorTo(process.stdout, 0);
                let text = `${message}... ${Math.floor(current / max * 100)}%`;
                process.stdout.write(text);
        }
}

module.exports = AbstractFileJSONExtractor;
