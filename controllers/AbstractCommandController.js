/**
 * Абстракция команд
 */
class AbstractCommandController {
        message;

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
         * Основной процесс
         * @abstract
         */
        process() {
                throw new Error('Метод process должен быть переопределен');
        }
}

module.exports = AbstractCommandController;