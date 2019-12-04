const http = require("https");
const Tame = require("./GlobalControllers/Tame");
const GetPhrases = require('./GetPhrases');
const cheerio = require('cheerio');
const getIcon = require('./functions/getIcon');
const fs = require('fs');
const path = require('path');
const kibblesArr = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/kibble/eggs.json'), 'utf-8'));
const access = require('./GlobalControllers/access');
// const Discord       = require("discord.js");

const db_badRequests_class = require('./DB/bad_requests');
const db_badRequests = new db_badRequests_class();


class Dododex extends Tame {
	constructor(messageAccess) {
		super(messageAccess);
	}

	static controller(message, args, messageAccess) {
		if (!access.isAccess(messageAccess)) return;
		if (args.length === 0) {
			message.channel.send('Эта команда не вызывается без параметров. Для справки используйте ``!помощь приручение``')
				.catch(console.error);
			return;
		}
		let dododex = new Dododex(messageAccess);
		dododex.send(message, args);
	}

	getInfo(callback) {
		//if(this.aliases[this.data.name]) this.data.name = this.aliases[this.data.name];
		if (this.data.name.search(/[а-яё]/) !== -1) {
			callback(0);
			return;
		}
		let link = "https://www.dododex.com/taming/" + this.data.name + "/" + this.data.lvl + "?taming=" + this.data.rates;
		let linkTorpor = "https://www.dododex.com/torpor-timer/" + this.data.name;
		http.get(link, (res) => {
			const {statusCode} = res;

			if (statusCode !== 200) {
				callback(statusCode);
				return;
			}


			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => rawData += chunk);
			res.on('end', () => {
				//this.data.runame = (this.aliases2[this.data.name]) ? this.aliases2[this.data.name] : this.data.name;
				let $ = cheerio.load(rawData);
				let res = this.getTamingTable($);
				let result = {};
				result["tamingTable"] = res;
				result["link"] = link;
				result["tranqList"] = this.getTranqList($);

				let mainImage	= $("#mainImage");
				if(mainImage.length !== 0) {
					result["mainImage"] = 'https://www.dododex.com' + $("#mainImage").attr("src");
				} else {
					result["mainImage"] = false;
				}

				http.get(linkTorpor, res2 => {
					const {statusCode} = res2;
					if (statusCode !== 200) {
						result["torporInfo"] = null;
						callback(result);
						return;
					}

					res2.setEncoding('utf8');
					let rawData2 = '';
					res2.on('data', (chunk2) => rawData2 += chunk2);
					res2.on('end', () => {
						result["torporInfo"] = this.getTorporInfo(rawData2);
						callback(result);
					});
				});
			});
		});
	}

	getTamingTable($) {
		let $taming = $(".scrollx .tamingTable");
		let $items = $taming.find("tr");

		let parsedItems = [];
		let headers = {};
		$items.each((i, elem) => {

			if (i === 0) {
				let $hs = $(elem).find('th');
				$hs.each((i2, elem2) => {
					headers[$(elem2).text()] = i2;
				});
				return;
			}
			if (!headers || typeof headers['FOOD'] === 'undefined') return;

			let element = this.parseItem($(elem), headers);
			if (element !== false)
				parsedItems.push(element);
		});

		return parsedItems;
	}

	getContentByTag(text, tagOpen, tagClose) {
		let cursorPos = text.indexOf(tagOpen);
		if (cursorPos === -1) return '';
		text = text.substr(cursorPos + tagOpen.length, text.length - (cursorPos + tagOpen.length));
		cursorPos = text.indexOf(tagClose);
		text = text.substr(0, cursorPos);
		return text.trim();
	}

	getTranqList($) {
		let $tranqRaw = $('.koWeapon');
		let res = {'names': [' ']};

		$tranqRaw.each((i, elem) => {
			let $elem = cheerio(elem);

			if (i === 0) {
				let $text = $elem.find(".uppercase");
				$text.each((i3, nms) => {
					res.names.push(cheerio(nms).text()
						.replace('Head', 'Голова')
						.replace('Tail', 'Хвост')
						.replace('Spine', 'Спина')
						.replace('Shell', 'Панцирь'));
				});
			}


			let name = $elem.find(".marginTopS.marginBottomS .marginTopS .knockLabelT").text().trim().toLowerCase();
			let elems = [];
			let $elems = $elem.find(".knockCount");
			$elems.each((j, elem2) => {
				elems.push(cheerio(elem2).text())
			});
			res[name] = elems;
		});
		return res;
	}

	getTorporInfo(text) {
		let array = this.getTorporArray(text);
		if (!array) return null;

		let res = '';

		let level = this.data.lvl;
		let rate = array.tDPS0 + Math.pow(level - 1, 0.800403041) / (22.39671632 / array.tDPS0);
		let maxUnits = array.bs.t.b + (array.bs.t.w * (level - 1));
		maxUnits = parseFloat(maxUnits.toFixed(3));
		let totalUnits = maxUnits;
		let totalSeconds = (totalUnits / rate);

		res += '-' + (Math.round(rate * 100) / 100) + '/с, полное оглушение спадет за ' + this.timeFormat(totalSeconds, true);

		res += '\nВсего оглушения: ' + maxUnits;
		res += '\n\n**Для полного поднятия оглушения надо: **';
		res += '\n' + this.addTorporInfo(getIcon('Наркоберри'), maxUnits, totalSeconds, 4, 3);
		res += '\n' + this.addTorporInfo(getIcon('Наркотик'), maxUnits, totalSeconds, 40, 8);
		res += '\n' + this.addTorporInfo(getIcon('Биотоксин'), maxUnits, totalSeconds, 80, 16);

		return res;
	}

	addTorporInfo(icon, totalTorpor, totalSeconds, addTorpor, addTime) {
		let quantity = Math.ceil(totalTorpor / addTorpor);
		return quantity + ' ' + icon + ' (' + this.timeFormat(quantity * addTime, true) + ' / ' + this.timeFormat(quantity * addTime + totalSeconds, true) + ')';
	}

	getTorporArray(text) {
		text = this.getContentByTag(text, 'var cr = ', 'var lowbeep').trim();
		if (!text) return null;
		return JSON.parse(text);
	}

	parseItem($elem, headers) {
		let item = {};
		let $td = $elem.find('td');
		let $food = cheerio($td[headers['FOOD']]);
		let $qty = cheerio($td[headers['QTY']]);
		let $effect = cheerio($td[headers['EFFECT.']]);
		let $time = false;
		let $narcs = false;

		if (!$food) return false;

		if (typeof headers['TIME'] !== 'undefined')
			$time = cheerio($td[headers['TIME']]);
		if (typeof headers['NARCS.'] !== 'undefined')
			$narcs = cheerio($td[headers['NARCS.']]);


		/* Перевод кормов на русский язык */
		item.label = $food.text().trim();
		if (this.eatAliases[item.label]) item.label = this.eatAliases[item.label];

		/* Подделывание некоторых непереведенных частей */

		/* -- Mobile/Switch -- */
		let isMobile = item.label.search('Mobile/Switch') !== -1;
		if (isMobile || item.label === 'Kairuku Kibble') {// NOTE: Исключение для яйца кайруку, оно без записи mobile
			item.label = item.label.replace('Mobile/Switch', '').trim();
			item.label = item.label.replace('Kibble', '').trim() + ' Egg';
			if (kibblesArr[item.label]) {
				item.label = kibblesArr[item.label];
			}
			item.label = getIcon('корм') + ' Корм (' + item.label + ') <:phone:583555807321391117>';
			//item.label = '(📱) ' + item.label;
		}

		/* -- Рыбная живка -- */
		item.label = item.label.replace('Sabertooth Salmon', 'Саблезубый Лосось');
		item.label = item.label.replace('Piranha', 'Пиранья');
		item.label = item.label.replace('Coelacanth', 'Целакант');


		item.quantity = $qty.text();

		item.quality = $effect.find('b').text();
		item.qualityState = $effect.find('.small.lighter').text().replace("Lvl", "ур.");

		if ($narcs) {
			let narArray = $narcs.text().trim().replace(/\s+/g, ' ').split(' ');
			item.narcoberry = narArray[2];
			item.narcotic = narArray[1];
			item.biotoxin = narArray[0];
		}

		if ($time) {
			item.time = this.timeType($time.text());
		}
		return item;
	}

	timeType(text) {
		let h = parseInt(text.substr(0, 2)),
			m = parseInt(text.substr(3, 2)),
			s = parseInt(text.substr(6, 2)),
			res = '';
		if (h) res += h + 'ч ';
		if (m) res += m + 'м ';
		if (s) res += s + 'с ';
		return res.trim();
	}

	send(message, args) {
		this.addParamsByArray(args);

		if (this.data.lvl >= 2000) {
			message.channel.send("Максимальный уровень, который понимает __Dododex__: 1999");
			return;
		}

		if (this.data.rates >= 1001) {
			message.channel.send("Максимальный множитель, который понимает __Dododex__: 1000");
			return;
		}


		let actualCache = this.getActualCache(this.data);
		if (!actualCache) {
			let thisClass = this;
			message.channel.send(GetPhrases.getWait())
				.then(msg => {
					this.getInfo(function (e) {
						let embed;
						let errorCode = false;
						/*
						* False - Ошибки нет
						* 1     - Нет такого существа в нашей базе
						* 2     - Нет такого существа на дододексе
						* 3     - Дододекс недоступен
						 */
						if (!isNaN(e) && e !== 0) {
							if (e === 404) {
								embed = "На Dododex'е нет существа ``" + thisClass.data.name + "``";
								errorCode = 2;
							} else {
								embed = "Dododex недоступен, код ошибки - " + e;
								errorCode = 3;
							}
						} else if (e === 0) {
							embed = "В нашей базе данных нет такого существа. Вы можете попробовать ввести его на английском.";
							errorCode = 1;
						} else {

							thisClass.data.res = e;

							embed = thisClass.senderResult(message);

						}
						msg.edit(embed)
							.then((msg)	=> {
								if(!errorCode) return;
								let errorMessage;
								switch (errorCode) {
									case 1:
										errorMessage	= 'Нет такого существа в нашей базе';
										break;
									case 2:
										errorMessage	= 'Нет такого существа на дододексе';
										break;
									case 3:
										errorMessage	= 'Дододекс недоступен ('+e+')';
										break;
									default:
										errorMessage	= 'Неизвестная ошибка';
										break;
								}
								db_badRequests.putRequest(message, 'dododex', errorMessage, msg.id)
									.catch(console.error);
							})
							.catch(console.error);
						if (thisClass.data.res)
							thisClass.putCache(thisClass.data);
						thisClass.clearParams();
					});
				})
				.catch(console.error);
		} else {
			let limit = this.data.lines;
			this.data = actualCache;
			this.data.lines = limit;
			let embed = this.senderResult(message);
			message.channel.send(embed);
			this.clearParams();
		}
	}
}


module.exports = Dododex;
