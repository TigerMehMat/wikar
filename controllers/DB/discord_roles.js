const DB	= require('./DB');

class DB_roles extends DB {
	constructor() {
		super();
	}

	getRoleMessages() {
		return this.query('');
	}
}

module.exports	= DB_roles;