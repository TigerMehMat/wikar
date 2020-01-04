const Discord = require("discord.js");
const client = new Discord.Client();


const DiscordServersModel   = new (require('./Models/DiscordServersModel'));

const VoiceLogger = new (require("./controllers/VoiceLogger"));

const Kibble = require("./controllers/kibble");

const Dododex = require("./controllers/Dododex");

const config = require("./configbot.js");

const MapsController = require('./controllers/MapsController');

const GetAva = require('./controllers/GetAva');

const BugReport = require('./controllers/BugReport');

const FullForge = require('./controllers/FullForge');

const Timer = require('./controllers/GlobalControllers/Timer');

const LS = require('./controllers/ls');

const BM = require('./controllers/BM');
let bm;

const ARK = require('./controllers/ARK');
let ark;

const Wiki_Craft = require('./controllers/Wiki-craft');

const Helper = require('./controllers/GlobalControllers/Helper');

const access = require('./controllers/GlobalControllers/access');

const Breeding = require('./controllers/Breeding');

const alarm_class   = require('./controllers/GlobalControllers/alarm.js');

const SubscribeController = new (require('./controllers/SubscribeController'));


client.login(config.token)
    .catch(console.error);

client.on("ready", async () => {
    global.DiscordAlarm = new alarm_class(client);

    console.log("Готов!\n"+client.user.tag);

    try {
        await DiscordAlarm.send("Готов!\n"+client.user.tag);
    } catch (e) {
        console.error('Не удалось отправить "Готов!"');
        console.error(e);
    }

    SubscribeController.activate(client);

    /* Апдейтеры */
    bm = new BM(config.bm_token, client);
    ark = new ARK(client, DiscordServersModel);

    await ark.start();

    ark.updater().catch((e) => {
        DiscordAlarm.send('Логгер ARK окончательно завершил свою работу!');
    });
    bm.serversUpdater().catch((e) => {
        DiscordAlarm.send('Логгер BM окончательно завершил свою работу!');
    });
});


client.on('message', async message => {

    if(!message) return;
    if(!message.guild) {
        if(!message.author.bot)
            LS.reply(message);
        return;
    }

    const messageAccess = await access.getMainCheck(message, DiscordServersModel);
    if(messageAccess === false) return;

    /* Начало обработчика команд */
    const prefix = messageAccess.prefix;

    if (!message.content.startsWith(prefix) || message.author.bot) return;


    let messageContent = message.content.replace(/\s+/g, ' ').trim();
    messageContent = messageContent.replace(RegExp('^'+prefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')+'\\s', 'g'), prefix);
    const args = messageContent.slice(prefix.length).split(/ /);
    const command = args.shift().toLowerCase();


    switch(command){
        case "dododex":
        case "дододекс":
        case "приручение":
        case "п":
        case "тамление":
            Dododex.controller(message, args, messageAccess);
            break;
        // case "п2":
        //     WikiTame.controller(message, args);
        //     break;
        case "инкубация":
        case "беременность":
        case "разведение":
        case "рост":
        case "р":
            Breeding.controller(message, args, messageAccess);
            break;
        case "корм":
        case "к":
            Kibble.controller(message, args, messageAccess);
            break;
        case "карта":
            MapsController.controller(message, args, messageAccess);
            break;
        case "ава":
        case "покажиаву":
        case "аватарка":
            GetAva.controller(message, args, client, messageAccess);
            break;
        case "bug":
        case "баг":
        case "баги":
        case "чит":
        case "читы":
        case "багоюз":
        case "багоюзы":
        case "ошибка":
        case "ошибки":
            BugReport.controller(message, args, messageAccess);
            break;
        case "фуллпечи":
        case "фп":
            FullForge.controller(message, args, messageAccess);
            break;
        case "таймер":
            Timer.controller(message, args);
            break;
        /*case "bm":
            BM.controller(message, args);
            break;*/
        case "сс":
        case "статуссервера":
            bm.changeState(message, args);
            break;
        case "си":
        case "статусигрока":
            bm.addPlayer(message, args);
            break;
		case "викикрафт":
			Wiki_Craft.sendCraft(message, args, messageAccess)
				.catch(console.error);
			break;
		// case "множители":
		// 	ARK.getRoleToMe(message, args);
		// 	break;

		/* Баттл Метрика */
        case "спи":
        case "plist":
        case "списокигроков":
            bm.sendPlayersList(message, args, messageAccess);
            break;
        case "помощь":
            Helper.sendHelp(message, args);
            break;
        // case "bmподписка":
        // case "бмподписка":
        //     bm.sendLicenseInfo(message);
        //     break;
        // case "bm__init":
        //     bm.sendInit(message);
        //     /*
        //     channel.send('hi, it message is only for bot.\nку, это сообщение только для бота');
        //     channel.send('hi, it message is only for bot.\nку, это сообщение только для бота');
        //     channel.send('hi, it message is only for bot.\nку, это сообщение только для бота');
        //     channel.send('hi, it message is only for bot.\nку, это сообщение только для бота');
        //     channel.send('hi, it message is only for bot.\nку, это сообщение только для бота');
        //     channel.send('hi, it message is only for bot.\nку, это сообщение только для бота');
        //     channel.send('hi, it message is only for bot.\nку, это сообщение только для бота');*/
        //     break;
    }
});


client.on("voiceStateUpdate", (oldMember, newMember) => {
    VoiceLogger.voiceChanged(oldMember, newMember);
});

client.on('error', (e)=> {
    console.error('Discord long query error, its normal.');
});









/* For Site */
// const app = require('express')();
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
//
// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/siteCode/index.html');
// });
//
//
// http.listen(3000, function(){
//     console.log('HTTP server started on port 3000');
// });
//
// io.on('connection', function(socket){
//     console.log('Client connection received');
//     socket.emit('sendToClient', { hello: 'world' });
//
//     socket.on('receivedFromClient', function (data) {
//         console.log(data);
//     });
// });

