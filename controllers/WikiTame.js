const Tame          = require("./GlobalControllers/Tame");
const GetPhrases    = require('./GetPhrases');
const getIcon       = require('./functions/getIcon');
const fs            = require('fs');
const path          = require('path');
const kibblesArr    = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/kibble/eggs.json'), 'utf-8'));
const access        = require('./GlobalControllers/access');
const tamingCreatures	= require('../data/wiki/tamingCreatures');
//const Discord = require("discord.js");

class WikiTame extends Tame {
	constructor(){
		super();
	}

	static controller(message, args){
		if(!access.isAccess(message)) return;
		if(args.length === 0) {
			message.channel.send('Эта команда не вызывается без параметров. Для справки используйте ``!помощь приручение``')
				.catch(console.error);
			return;
		}
		let wikiTame = new WikiTame();
		wikiTame.send(message);
	}

	getInfo(callback){
		//if(this.aliases[this.data.name]) this.data.name = this.aliases[this.data.name];
		if(typeof tamingCreatures[this.data.name] === "undefined"){
			callback(0);
			return;
		}
		console.log(tamingCreatures[this.data.name]);
		let affinityNeeded		= 0;
		let totalTorpor			= 0;
		let torporDeplPS		= 0;
		let foodPiecesNeeded	= 0;
		let seconds				= 0;
		let foodAffinity		= 0;
		let foodValue			= 0;
		let wakeAffinityMult	= 1;
		let wakeFoodDeplMult	= 1;
		let foodname 			= '';


		let nonViolent			= false;
		let creature			= tamingCreatures[this.data.name];
		if (typeof creature.nonViolentTame !== "undefined" && creature.nonViolentTame === 1) {
			nonViolent = true;
			if(typeof creature.wakeAffinityMult !== "undefined") {
				wakeAffinityMult = creature.wakeAffinityMult
			}
			if(typeof creature.wakeFoodDeplMult !== "undefined") {
				wakeFoodDeplMult = creature.wakeFoodDeplMult
			}
		}
		let heavyWeaponKnockout = false;
		if (typeof creature.heavyWeaponKnockout !== "undefined" && creature.heavyWeaponKnockout === 1) {
			heavyWeaponKnockout = true;
		}

		if(!nonViolent) {
			totalTorpor = creature.torpor1 + creature.torporIncrease * (this.data.lvl - 1);


			if(typeof creature.torporDepletionPS0 !== "undefined") {
				torporDeplPS = creature.torporDepletionPS0 + Math.exp(0.800403041 * Math.log(this.data.lvl - 1)) / (22.39671632 / creature.torporDepletionPS0);
			} else {
				torporDeplPS = 0;
			}
			console.log(torporDeplPS);
		}





	}

	send(message){
		this.addParamsByArray(message.content.split(' '));

		if(this.data.lvl >= 2000){
			message.channel.send("Для внутреннего бота временно введено ограничение уровня как у __Dododex__: 1999");
			return;
		}

		if(this.data.rates >= 1001){
			message.channel.send("Для внутреннего бота временно введено ограничение множителя как у __Dododex__: 1000");
			return;
		}


		let actualCache = this.getActualCache(this.data);
		if(!actualCache) {
			let thisClass = this;
			message.channel.send(GetPhrases.getWait())
				.then(msg => {
					this.getInfo(function (e) {
						let embed;
						if (!isNaN(e) && e !== 0) {
							if(e === 404)
								embed = "На Dododex'е нет такого существа";
							else
								embed = "Dododex недоступен, код ошибки - " + e;
						} else if (e === 0) {
							embed = "В нашей базе данных нет такого существа. Вы можете попробовать ввести его на английском.";
						} else {

							thisClass.data.res = e;

							embed = thisClass.senderResult(message);

						}
						msg.edit(embed)
							.catch(console.error);
						if(thisClass.data.res)
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


module.exports = WikiTame;
