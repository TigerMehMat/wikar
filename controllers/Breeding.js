const DvData	= require('./functions/getDvData')();
const Access	= require('./GlobalControllers/access');
const Discord	= require('discord.js');
const TranslateCreature	= require('./TranslateCreature');
const creatureAliasesDvData	= require('./../aliases/creatureAliasesDvData');
const Timer		= require('./GlobalControllers/Timer');
const getIcon	= require('./functions/getIcon');

const BadRequestsModel  = new (require('../Models/BadRequestsModel'));

class Breeding {

	constructor(message, args) {
		this.message = message;

		this.name = null;
		this.rates_maturation = 1;
		this.rates_incubation = 1;
	}

	setBasicRates(rates_maturation, rates_incubation) {
		this.rates_maturation = rates_maturation;
		this.rates_incubation = rates_incubation;
	}

	setArgs(args) {
		let name = '';
	}

	static controller(message, args, messageAccess) {
		if(!Access.isAccess(messageAccess)) return;
		message.channel.startTyping();
		if(args.length === 0) {
			message.channel.send('Эта команда не вызывается без параметров. Для справки используйте ``!помощь разведение``')
				.then(() => {
					message.channel.stopTyping();
				})
				.catch(console.error);
			return;
		}

		let i;
		let name	= '';
		let rateMat	= messageAccess.rates.BabyMatureSpeedMultiplier;
		let rateInc	= messageAccess.rates.EggHatchSpeedMultiplier;
		for(i=0;i<args.length;i++){
			if(!isNaN(args[i])) break;
			else name += args[i].toLowerCase();
		}
		if(name.search('тек')===0) name = name.substr(3);
		if(name.search('аберрантн')===0) name = name.substr(11);
		if(args.length-i>0&&!isNaN(args[i])) {
			rateMat = parseFloat(args[i]);
			rateInc = rateMat;
		}
		if(args.length-i>1&&!isNaN(args[i+1])) rateInc = parseFloat(args[i+1]);

		rateMat = this.getTrueValue(rateMat);
		rateInc = this.getTrueValue(rateInc);

		let enName = TranslateCreature.getENCreature(name);
		let ruName = TranslateCreature.getRUCreature(enName);
		enName = (creatureAliasesDvData[enName]) ? creatureAliasesDvData[enName] : enName;

		if(!enName || enName.search(/[А-Яа-яЁё]/) !== -1) {
			message.channel.send("Тушканчикам не удалось найти существо **``"+Discord.Util.escapeMarkdown(name, false, true)+"``** в нашей базе.")
				.then((res)=> {
					message.channel.stopTyping();
					BadRequestsModel.putRequest(message, 'breeding', 'Нет существа в базе алиасов: '+name, res.id)
						.catch(console.error);
				})
				.catch(console.error);
			return;
		}
		if(typeof DvData[enName.toLowerCase().replace('_', '')] === 'undefined') {
			message.channel.send("Тушканчикам не удалось найти существо **``"+Discord.Util.escapeMarkdown(name, false, true)+"``** в базе данных. Они очень старались.")
				.then((res)	=> {
					message.channel.stopTyping();
					BadRequestsModel.putRequest(message, 'breeding', 'Нет существа в базе DvData: '+name, res.id, 1)
						.catch(console.error);
				})
				.catch(console.error);
			return;
		}
		let Data = DvData[enName.toLowerCase().replace('_', '')];


		/* --- Вытащили нужное существо --- */
		let text = '';
		let breeding;
		if(!Data['breeding']||!Data['breeding']['maturationtime']) {
			text = '🚫 Неразводимое существо';
			breeding = false;
		} else {
			text = '✅ Разводимое существо';
			if(enName === 'reaper')
				text += '\n*Единственный способ "размножения" был бы через оплодотворение от королевы, но размножение технически невозможно из-за гендерной механики Жнеца.*';
			if(enName === 'rockdrake')
				text += '\n*Может быть выращен из дикого яйца, но взрослые особи спариваться не могут.*';
			if(enName === 'wyvern')
				text += '\n*Может быть выращена из дикого яйца, но взрослые особи спариваться не могут.*';
			breeding = true;
		}

		let embed = new Discord.MessageEmbed()
			.setTitle(ruName)
			.setAuthor(message.author.username, message.author.avatarURL)
			.setDescription(text);

		// if(Data['passengerweightmultiplier'])
		// 	embed.addField('Множитель веса наездника', Data['passengerweightmultiplier']);
		//
		// if(Data['grabweightthreshold'])
		// 	embed.addField('Порог перегруза', Data['grabweightthreshold']);

		//console.log(Data['breeding']);
	if(breeding) {
		if (Data['breeding']['maturationtime']) {
			embed.addField('Общее время роста', this.getTime(parseInt(Data['breeding']['maturationtime']) / rateMat), true);
		}

		if (Data['breeding']['gestationtime'])
			embed.addField('Время беременности', this.getTime(parseInt(Data['breeding']['gestationtime']) / rateInc), true);

		if (Data['breeding']['incubationtime'])
			embed.addField('Время инкубации', this.getTime(parseInt(Data['breeding']['incubationtime']) / rateInc), true);

		if (Data['breeding']['mintemp'] && Data['breeding']['maxtemp'])
			embed.addField('Диапазон инкубации', Data['breeding']['mintemp'] + ' - ' + Data['breeding']['maxtemp'] + ' °C', true);

		embed.addBlankField();

		if (Data['breeding']['babytime'])
			embed.addField('Детёныш', this.getTime(parseInt(Data['breeding']['babytime']) / rateMat), true);

		if (Data['breeding']['juveniletime'])
			embed.addField('Юнец', this.getTime(parseInt(Data['breeding']['juveniletime']) / rateMat), true);

		if (Data['breeding']['adolescenttime'])
			embed.addField('Юный', this.getTime(parseInt(Data['breeding']['adolescenttime']) / rateMat), true);

		embed.addBlankField();
	}

		if(Data['diet']) {
			let diet;
			switch (Data['diet']) {
				case 'Herbivore':
					diet = getIcon('Ягоды')+'Травоядное';
					break;
				case 'Carnivore':
					diet = getIcon('Сырое Мясо')+'Хищник';
					break;
				case 'Omnivore':
					diet = 'Всеядное';
					break;
				case 'Piscivore':
					diet = getIcon('Сырая Рыба')+'Рыбоядный';
					break;
				case 'Carrion-Feeder':
					diet = getIcon('Сырое Мясо')+'Падаль (мясо)';
					break;
				case 'Coprophagic':
					diet = getIcon('Протухшее Мясо')+'Копрофаг';
					break;
				case 'Minerals':
					diet = getIcon('Камень')+'Минералы';
					break;
				case 'Flame Eater':
					diet = 'Пожиратель Пламени';
					break;
				default:
					diet = Data['diet'];
					break;
			}
			embed.addField('Питание', diet, true);
		}

		if(Data['stats'] && Data['stats']['cansuffocate'])
			embed.addField('Может задохнуться', (Data['stats']['cansuffocate'] === 'Yes') ? 'Да' : 'Нет', true);

		if(Data['taming'] && Data['taming']['torporimmune'])
			embed.addField('Иммунитет к оглушению', (Data['taming']['torporimmune'] === 'Yes') ? 'Да' : 'Нет', true);

		//embed.addBlankField();
		rateMat = rateMat === Infinity ? '∞' : 'x' + rateMat;
		rateInc = rateInc === Infinity ? '∞' : 'x' + rateInc;
		//embed.addField('Примененные множители', 'Скорость роста: '+rateMat+'\nСкорость инкубации: '+rateInc);
		embed.setFooter('Рост '+rateMat+' • Инкубация '+rateInc);

		message.channel.send(embed)
			.then(() => {
				message.channel.stopTyping();
			})
			.catch(console.error);
	}

	static getTime(time) {
		if(isNaN(time)) return '&nbsp;';
		time = Math.floor(time);
		if(time < 1) return '< 1 сек';
		return Timer.timeFormat(time, false);
	}

	static getTrueValue(value) {
		if(value > 1000) value = 1000;
		if(value < 0.001) value = 0.001;
		return Math.ceil(value * 1000) / 1000;
	}
}


module.exports = Breeding;
