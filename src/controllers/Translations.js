class Translations {
        constructor(lang) {
                let languages = ['en', 'ru'];
                if(languages.indexOf(lang) === -1) {
                        throw new Error('Я не знаю такого языка: ' + lang);
                }
                this.lang = lang;
        }
}

module.exports = Translations;
