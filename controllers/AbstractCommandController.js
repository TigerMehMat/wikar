/**
 * Абстракция команд
 */
class AbstractCommandController {
        message;
        valid = false;

        /**
         *
         * @param message Сообщение
         * @return {AbstractCommandController}
         */
        setMessage(message) {
                this.message = message;
                return this;
        }

        /**
         * Установить данные по аргументам
         * @param {string[]} args
         * @return {Promise<this>}
         * @abstract
         */
        setArgs(args) {
                throw new Error('Метод serArgs должен быть переопределен');
        }

        /**
         * Стандартная валидация. Для дополнительной валидации расширять, но не переписывать.
         */
        async validate() {
                if(typeof this.message === "undefined") {
                        throw new Error('В вызове команды не указано сообщение');
                } else {
                        this.valid = true;
                }
        }

        /**
         * Основной процесс
         * @abstract
         */
        process() {
                throw new Error('Метод process должен быть переопределен');
        }
}

module.exports = AbstractCommandController;