const numeral = require('numeral');
numeral.register('locale', 'ru', {
	delimiters: {
		thousands: ' ',
		decimal: ','
	},
	abbreviations: {
		thousand: 'тыс.',
		million: 'млн.',
		billion: 'млрд.',
		trillion: 'трлн.'
	},
	ordinal: function () {
		// not ideal, but since in Russian it can taken on
		// different forms (masculine, feminine, neuter)
		// this is all we can do
		return '.';
	},
	currency: {
		symbol: 'руб.'
	}
});
numeral.locale('ru');
module.exports = function(number){
	return numeral(number).format('0,0');
};
