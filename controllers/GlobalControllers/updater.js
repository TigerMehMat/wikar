const EventEmitter = require('events');

class Updater extends EventEmitter {
        /**
         * Время между вызовами функции
         * @type {number}
         */
        update_time = 6000;
        /**
         * Останавливать после первой ошибки
         * @type {boolean}
         */
        stop_on_error = false;
        /**
         * Время, после которого будет считаться что updater не работает
         * @type {number}
         */
        update_error_time = this.update_time * 1.5;
        /**
         * ID от setTimeout для более оперативной остановки
         */
        timeout_id;
        /**
         * Активна или нет текущая сессия
         * @type {boolean}
         */
        active = false;

        /**
         * @return Promise<void>
         */
        runFunction() {
                return new Promise((resolve, reject) => {
                        resolve();
                });
        }

        /**
         * Стартуем выполнение функции. Завершается только при ошибках
         * @return {Promise<unknown>}
         */
        async execute() {
                return new Promise(async (resolve, reject) => {
                        this.active = true;
                        while (this.active) {
                                let stop_timer = setTimeout(() => {
                                        this.stop();
                                        this.emit('error');
                                        reject(new Error('Превышено время ожидания'));
                                });
                                try {
                                        await this.runFunction();
                                } catch (e) {
                                        if(this.stop_on_error) {
                                                this.stop();
                                        }
                                        this.emit('error');
                                        if(this.stop_on_error) {
                                                reject(e);
                                        }
                                }
                                clearTimeout(stop_timer);
                                await this._await(this.update_time);
                        }
                });
        }

        /**
         * Останавливаем новые вызовы
         */
        stop() {
                this.active = false;
                if(this.timeout_id) clearTimeout(this.timeout_id);
                this.emit('stop');
        }

        /**
         * Системный метод синхронного ожидания
         * @param time Время ожидания в мс
         * @return {Promise<void>}
         * @private
         */
        _await(time) {
                return new Promise((resolve) => {
                        this.timeout_id = setTimeout(() => {
                                resolve()
                        }, time);
                });
        }
}

module.exports = Updater;