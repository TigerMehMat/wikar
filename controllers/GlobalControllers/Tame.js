const fs				= require("fs");
const path				= require("path");
const Timer				= require("./Timer");
const config            = require("./../../configbot");
const Discord			= require("discord.js");
const TranslateCreature	= require("../TranslateCreature");

class Tame {
    constructor(messageAccess) {
        this.eatAliases = require("../../aliases/eatAliases");
        this.data = {};
        this.clearParams(messageAccess);
    }

    addParamsByArray(arr){
        let i;
        for(i=0;i<arr.length;i++){
            if(!isNaN(arr[i])) break;
            else this.data.name += arr[i].toLowerCase();
        }
        if(this.data.name.search('тек')===0) this.data.name = this.data.name.substr(3);
        if(this.data.name.search('аберрантн')===0) this.data.name = this.data.name.substr(11);
        if(arr.length-i>0&&!isNaN(arr[i])) this.data.lvl = parseInt(arr[i]);
        if(arr.length-i>1&&!isNaN(arr[i+1])) this.data.rates = parseFloat(arr[i+1]);
        if(arr.length-i>2&&!isNaN(arr[i+2])) this.data.lines = parseInt(arr[i+2]);


        this.data.name      = TranslateCreature.getENCreature(this.data.name);
        this.data.runame    = TranslateCreature.getRUCreature(this.data.name);

        return true;
    }

    clearParams(messageAccess   = false){
        this.data.name = "";
        this.data.lines = 3;
        if(!messageAccess) {
            this.data.rates = 1;
            this.data.lvl = 150;
        } else {
            this.data.lvl = messageAccess.rates.OverrideOfficialDifficulty * 30;
            this.data.rates = messageAccess.rates.TamingSpeedMultiplier;
        }
    }

    putCache(obj){
        delete obj['lines'];
        obj['cashTime'] = Date.now();
        let text = JSON.stringify(obj);
        let dn = path.resolve(__dirname, '../../cash/tame');

        if(!fs.existsSync(dn)) fs.mkdirSync(dn);
        dn = path.join(dn,'/x' + obj.rates);

        if(!fs.existsSync(dn)) fs.mkdirSync(dn);
        dn = path.join(dn,obj.name);

        if(!fs.existsSync(dn)) fs.mkdirSync(dn);
        dn = path.join(dn,obj.lvl+'.json');

        if(fs.existsSync(dn)) fs.unlinkSync(dn);
        fs.writeFileSync(dn, text);
    }

    getActualCache(obj){
        let cashMaxDiff = 60*60*24*3*100;

        let dn = path.resolve(__dirname, '../../cash/tame');
        if(!fs.existsSync(dn)) return false;

        dn  = path.join(dn, '/x'+obj.rates);
        if(!fs.existsSync(dn)) return false;

        dn  = path.join(dn, '/'+obj.name);
        if(!fs.existsSync(dn)) return false;

        dn  = path.join(dn,obj.lvl+'.json');
        if(!fs.existsSync(dn)) return false;

        let res = fs.readFileSync(dn, 'utf-8');
        res = JSON.parse(res);
        if(Date.now() - res.cashTime > cashMaxDiff) return false;
        return res;
    }

    senderResult(message){


        let embed = new Discord.RichEmbed()
            .setTitle(this.data.runame)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setURL(this.data.res.link);

        let footerInfo  = [this.data.runame, this.data.lvl + ' ур.', 'x' + this.data.rates];
        embed.setFooter(footerInfo.join(' • '));


        if(this.data.res.mainImage) {
            embed.setThumbnail(this.data.res.mainImage);
        }
        for (let i = 0; i < this.data.res.tamingTable.length; i++) {
            if (this.data.lines && this.data.lines === i) break;
            let textNarco = "";
            if (parseInt(this.data.res.tamingTable[i].narcoberry) === 0)
                textNarco = "<:narcos:548153267524468767> Не требуется";
            else if (!this.data.res.tamingTable[i].narcoberry)
                textNarco = "<:narcos:548153267524468767> Ненасильное приручение";
            else
                textNarco = '<:narcoberry:548124577306509346> ' + this.data.res.tamingTable[i].narcoberry + ', <:narcotic:548123412178927617> ' + this.data.res.tamingTable[i].narcotic + ' или <:bio_toxin:548124767450824705> ' + this.data.res.tamingTable[i].biotoxin;
            if (!this.data.res.tamingTable[i].time) this.data.res.tamingTable[i].time = 'Неизвестно';
            embed.addField(this.data.res.tamingTable[i].label + ' - ' + this.data.res.tamingTable[i].quantity + ' шт', this.data.res.tamingTable[i].time + ' — ' + this.data.res.tamingTable[i].quality + ' ' + this.data.res.tamingTable[i].qualityState + '\n ' + textNarco + '\n** **\n');
        }
        let tranqText = '';
        if (this.data.res.tranqList['crossbow'] && this.data.res.tranqList['tranquilizer dart'] && this.data.res.tranqList['shocking tranquilizer dart']) {
            for(let i = 0; i < this.data.res.tranqList['crossbow'].length; i++) {
                tranqText += ((this.data.res.tranqList['names'][i] === ' ') ? '' : '*' + this.data.res.tranqList['names'][i] +'*\n') +'<:tranq_crossbow:549967851646353408> ' + this.data.res.tranqList['crossbow'][i] + ', <:tranq_dart:549967998375559169> ' + this.data.res.tranqList['tranquilizer dart'][i] + ' или <:shock_tranq_dart:549968085436858373> ' + this.data.res.tranqList['shocking tranquilizer dart'][i] + '\n';
            }
            if (this.data.res.torporInfo) tranqText += '\n' + this.data.res.torporInfo;
            embed.addField('Оглушение', tranqText);
        } else if (this.data.res.tranqList['cannon ball']) {

            for(let i = 0; i < this.data.res.tranqList['cannon ball'].length; i++) {
                tranqText += ((this.data.res.tranqList['names'][i] === ' ') ? '' : '*' + this.data.res.tranqList['names'][i] +'*\n') +'<:cannon_ball:551069479753351169> ' + this.data.res.tranqList['cannon ball'][i] + '\n';
            }
            if (this.data.res.torporInfo) tranqText += '\n' + this.data.res.torporInfo;
            embed.addField('Оглушение', tranqText);
        }
        return embed;
    }

	timeFormat(seconds) {
		return Timer.timeFormat(seconds, false);
	}
}

module.exports = Tame;
