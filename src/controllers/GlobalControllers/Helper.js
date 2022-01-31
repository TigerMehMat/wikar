const Access = require('./access.js');
const AbstractCommandController = require("../AbstractCommandController.js");


const functionsConf = {
    "приручение": {
        "name": "приручение",
        "description": "Показывает данные о приручении существ с Dododex.",
        "params": [
            "название существа",
            ["уровень", 150],
            ["множители", 1],
            ["количество строк", 3],
        ],
        "aliases": ["п", "приручение"],
        "example": "!п Тираннозавр 145 2 3",
        "exampleComment": "Выдаст первые три приоритетных еды для Тираннозавра 145 уровня при рейтах х2.",
    },
    "корм": {
        "name": "корм",
        "description": "Показывает данные о кормах с внутренней базы.",
        "params": [
            "название корма (ru или en), его цвет или размер яйца",
            ["количество", 1],
        ],
        "aliases": ["к", "корм"],
        "example": "!корм оченьбольшое ",
        "exampleComment": "Выдаст информацию по Исключительному корму, для изготовления которого используются очень большие яйца.",
    },
    "карта": {
        "name": "карта",
        "description": "Генерирует карту спавна указанного существа или карту местности.",
        "params": [
            "название существа или карты",
            ["название карты", '-'],
        ],
        "aliases": ["карта"],
        "example": "!карта мегалозавр рагнарек",
        "exampleComment": "Выдаст карту спавна мегалозавров на карте Ragnarok.",
    },
    "викикрафт": {
        "name": "викикрафт",
        "description": "Возвращает список ингридиентов для крафта указанного предмета в указанном количестве. Информация берется с РУ-вики.",
        "status": "α",
        "params": [
            "наименование предмета",
            ["количество", 1],
            ["множитель", 1],
        ],
        "aliases": ["викикрафт"],
        "example": "!викикрафт кровать 20",
        "exampleComment": "Выдаст ресурсы и их количество для создания 20-и кроватей.\nИнформация берется с РУ-вики.\n*Примечание:В химстоле создается в 1.5 раза больше итогового материала, для правильного подсчета установите множитель ``1.5``*",
    },
    "разведение": {
        "name": "разведение",
        "description": "Показывает время инкубации / беременности и роста существ, плюс несколько дополнительных плюшек.",
        "params": [
            "наименование существа",
            ["множитель роста", 1],
            ["множитель инкубации", "множитель роста"],
        ],
        "aliases": ["разведение", "беременность", "инкубация", "р"],
        "example": "!разведение трайк 3 1",
        "exampleComment": "Выдаст карточку с информацией о разведении Трицератопса при скорости роста х3 и скорости инкубации х1",
    },
    // "множители": {
    //     "name": "множители",
    //     "description": "Ставит или снимает роль, которая оповещается при изменении множителей официальных серверов.",
    //     "params": [],
    //     "aliases": ["множители"],
    //     "example": "!множители",
    //     "exampleComment": "Поставит роль 'множители', если её нет, и снимет, если она есть.",
    //     "access": function(message){
    //         let isRole  = message.member.roles.cache.find(value => value.name === "множители");
    //         return !!isRole;
    //     }
    // },
    "инфо": {
        "name": "инфо",
        "description": "Ставит или снимает роль, которая оповещается при изменении множителей официальных серверов.",
        "status": "α",
        "params": ["название существа"],
        "aliases": ["инфо"],
        "example": "!инфо додо",
        "exampleComment": "Вернет информацию о `Додо`.",
    }
};


class Helper extends AbstractCommandController {
    args = [];

    command;

    getList() {
        let res = 'Список всех комманд бота:\n';
        for(let i in functionsConf) {
            if(typeof functionsConf[i].access !== "undefined" && !functionsConf[i].access(this.message)) continue;
            let statusText = typeof functionsConf[i].status === "undefined" ? '' : " (" + functionsConf[i].status + ")";
            res += `• **${functionsConf[i].name}**${statusText} (${this.getParams(functionsConf[i].params)})\n`;
            res += functionsConf[i].description + '\n';
            res += 'Варианты написания: ``!' + functionsConf[i]['aliases'].join('``, ``!') + '``\n\n';
        }
        res += 'Для развернутого ответа по одной команде введите ``!помощь названиеКоманды``, например\n```\n!помощь приручение\n```';
        return res;
    }

    getParams(params) {
        let res = '';
        for(let i = 0; i < params.length; i++) {
            if(Array.isArray(params[i]))
                res += '``<?'+params[i][0]+':'+params[i][1]+'>`` ';
            else
                res += '``<'+params[i]+'>`` ';
        }
        return res;
    }

    getBigParams(params) {
        let res = 'Список параметров:\n';
        for(let i = 0; i < params.length; i++) {
            if(Array.isArray(params[i]))
                res += '``'+params[i][0]+'`` - необязательный, по умолчанию: '+params[i][1]+'\n';
            else
                res += '``'+params[i]+'`` - обязательный\n';
        }
        if(res === 'Список параметров:\n') return 'Без параметров';
        return res;
    }

    getText() {
        let listEl = functionsConf[this.command];
        let statusText = typeof listEl.status === "undefined" ? '' : " (" + listEl.status + ")";
        let res = `Команда \`\`${listEl.name}\`\`${statusText} принимает следующие параметры: ${this.getParams(listEl.params)}`;
        res += '\n\n'+this.getBigParams(listEl.params);
        res += `\n\nНапример, команда:\`\`\`${listEl.example}\`\`\`${listEl.exampleComment}`;
        return res;
    }

    process() {
        let text = '';

        if(!this.command) {
            text = this.getList();
        } else if(typeof functionsConf[this.command] !== 'undefined' && !(typeof functionsConf[this.command].access === "function" && !functionsConf[this.command].access(this.message))) {
            text = this.getText();
        } else {
            text = 'Неизвестная команда ``'+this.command+'``';
        }

        return this.message.channel.send(text);
    }

    async setArgs(args) {
        this.args = args;
        this.command = args[0];

        return this;
    }

    static getAliases() {
        return [
                'помощь'
        ];
    }
}

module.exports = Helper;
