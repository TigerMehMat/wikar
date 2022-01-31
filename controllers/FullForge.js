const Timer = require("./GlobalControllers/Timer");
const access    = require('./GlobalControllers/access');


class FullForge extends Timer {
    static controller(message, args, messageAccess){
        if(!access.isAccess(messageAccess, 'tribe')) return;

        let currentMaterials = {
            'металл': {
                'time': 105,
                'result': 'слитков',
                'permin': 60,
            },
            'уголь': {
                'time': 99,
                'result': 'угля',
                'permin': 60,
            },
            'бензин': {
                'time': 18,
                'result': 'бензина',
                'permin': 200,
                'comment': 'Вам понадобится:\n' +
                    '4200 Нефти (42 слота)\n' +
                    '3500 Кожи (18 слотов)',
            }
        };
        if(!args[0]||!(args[0] in currentMaterials)) args[0] = 'металл';

        let material = args.shift();

        let place = args.join(' ');

        this.startTimer(message, currentMaterials[material].time, {
            'title': material[0].toUpperCase() + material.slice(1)+(place?' ('+place+')':'')+' плавится...',
            'body': function (timer) {
                let nowSli = (currentMaterials[material].time - timer) * currentMaterials[material].permin;

                let res = 'Весь '+material+' в промышленной плавильне переплавится через '+timer+' мин\n' +
                    'Уже произведено ≈ '+nowSli+' '+currentMaterials[material].result;
                if(currentMaterials[material].comment){
                    res += '\n' + currentMaterials[material].comment;
                }
                return res;
            },
            'end': '<@'+message.member.id+'> Весь '+material+(place?' ('+place+')':'')+' перевлавился!',
        });
    }
}

module.exports = FullForge;
