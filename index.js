const Discord = require("discord.js");
const client = new Discord.Client();


const DB_disc        = require('./controllers/DB/discord_servers');
const db_dis        = new DB_disc();

const VoiceLogger = require("./controllers/VoiceLogger");
const voiceLogger = new VoiceLogger();

const Kibble = require("./controllers/kibble");

const Dododex = require("./controllers/Dododex");

// const WikiTame = require("./controllers/WikiTame");

const config = require("./configbot.js");

const GetMap = require('./controllers/GetMap');

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

    /* Апдейтеры */
    bm = new BM(config.bm_token, client);
    ark = new ARK(client, db_dis);
    ark.updater().catch(console.error);
    bm.serversUpdater().catch(console.error);
});


client.on('message', async message => {

    if(!message) return;
    if(!message.guild) {
        if(!message.author.bot)
            LS.reply(message);
        return;
    }

    const messageAccess = await access.getMainCheck(message, db_dis);
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
            GetMap.controller(message, args, messageAccess);
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
    voiceLogger.voiceChanged(oldMember, newMember);
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

