const Discord = require("discord.js");
const client = new Discord.Client();


const DiscordServersModel = new (require('./Models/DiscordServersModel'));

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

const Access = require('./controllers/GlobalControllers/access');

const Breeding = require('./controllers/Breeding');

const alarm_class = require('./controllers/GlobalControllers/alarm.js');

const SubscribeController = new (require('./controllers/SubscribeController'));

const ItemsController = require('./controllers/ItemsController');

const VoiceTextChannelController = require('./controllers/VoiceTextChannelController');


client.login(config.token)
        .catch(reason => {
                console.error('Не удалось запустить клиент', reason);
        });

global.DiscordAlarm = new alarm_class();

client.on("ready", async () => {
        await DiscordAlarm.setClient(client);

        try {
                await DiscordAlarm.send("Готов!\n" + client.user.tag);
        } catch (e) {
                console.error('Не удалось отправить "Готов!"');
                console.error(e);
                return;
        }

        console.log("Готов!\n" + client.user.tag);

        SubscribeController.activate(client);

        /* Апдейтеры */
        bm = new BM(config.bm_token, client);
        ark = new ARK(client, DiscordServersModel);

        await ark.start();

        ark.updater().catch(() => {
                DiscordAlarm.send('Логгер ARK окончательно завершил свою работу!');
        });
        // Функция временно отключена
        // bm.serversUpdater().catch(() => {
        //         DiscordAlarm.send('Логгер BM окончательно завершил свою работу!');
        // });
});


client.on('message', async message => {

        if (!message) return;
        if (typeof message.guild === "undefined" || !message.guild) {
                if (!message.author.bot)
                        LS.reply(message);
                return;
        }

        let access = (new Access(message.guild.id, message.channel.id)).validate();
        let access_parameters = await access.getAccessParameters();

        /** @var {Object} Неведомый костыль, убрать когда переделаю верефикацию. */
        const messageAccess = await access.getMainCheck();
        if (!messageAccess) return;

        if (!access_parameters) {
                return;
        }

        /* Начало обработчика команд */
        const prefix = access_parameters.prefix;

        if (!message.content.startsWith(prefix) || message.author.bot) return;


        let messageContent = message.content.replace(/\s+/g, ' ').trim();
        messageContent = messageContent.replace(RegExp('^' + prefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\s', 'g'), prefix);
        const args = messageContent.slice(prefix.length).split(/ /);
        const command = args.shift().toLowerCase();


        switch (command) {
                case "dododex":
                case "дододекс":
                case "приручение":
                case "п":
                case "тамление":
                        Dododex.controller(message, args, messageAccess)
                                .catch(console.error);
                        break;
                case "инкубация":
                case "беременность":
                case "разведение":
                case "рост":
                case "р":
                        const breed_controller = (new Breeding());
                        await breed_controller.setMessage(message);
                        await breed_controller.setArgs(args);
                        await breed_controller.process();
                        break;
                case "корм":
                case "к":
                        (new Kibble())
                                .setMessage(message)
                                .setArgs(args)
                                .validate()
                                .process()
                                .catch(console.error);
                        break;
                case "карта":
                        let controller = (new MapsController());
                        await controller.setMessage(message);
                        await controller.setArgs(args);
                        await controller.validate();
                        await controller.process();
                        //MapsController.controller(message, args, messageAccess);
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

                /* Баттл Метрика */
                case "спи":
                case "plist":
                case "списокигроков":
                        bm.sendPlayersList(message, args, messageAccess);
                        break;
                case "предмет":
                        await new ItemsController()
                                .setMessageAccess(messageAccess)
                                .setMessage(message)
                                .setArgs(args)
                                .process();
                        break;
                case "помощь":
                        Helper.sendHelp(message, args);
                        break;
        }
});


client.on("voiceStateUpdate", (oldMember, newMember) => {
        VoiceLogger.voiceChanged(oldMember, newMember);
        let voice = new VoiceTextChannelController(oldMember, newMember);
        voice.checkVoiceTexts()
                .catch((e) => {
                        console.error('Ошибка в чекере войса', e);
                });
});

client.on('error', () => {
        console.error('Discord long query error, its normal.');
});
