const DB = require('./DB');

class DB_global_vars extends DB {
	/**
	 * Получить параметр
	 * @param {string} name
	 */
	async getItem(name) {
		let res	= await this.query('SELECT `value` FROM global_vars WHERE name = ?', [name]);
		return res[0]['value'];
	}

	/**
	 *
	 * @param {string} name
	 * @param {string} value
	 * @returns {Promise<void>}
	 */
	async setItem(name, value) {
		await this.query('UPDATE global_vars SET value = ? WHERE name = ?', [value, name]);
	}
}

module.exports = DB_global_vars;