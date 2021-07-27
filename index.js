const Discord = require("discord.js");
const client = new Discord.Client();
const DiscordServersModel = new (require('./Models/DiscordServersModel'));
const Kibble = require("./controllers/kibble");
const config = require("./configbot.js");
const MapsController = require('./controllers/MapsController');
const BugReport = require('./controllers/BugReport');
const LS = require('./controllers/ls');
const ARK = require('./controllers/ARK');
let ark;
const Helper = require('./controllers/GlobalControllers/Helper');
const Access = require('./controllers/GlobalControllers/access');
const Breeding = require('./controllers/Breeding');
const alarm_class = require('./controllers/GlobalControllers/alarm.js');
const SubscribeController = new (require('./controllers/SubscribeController'));
const ItemsController = require('./controllers/ItemsController');
const InfoCommandController = require('./controllers/InfoCommandController');
const QueryLogs = require('./Models/QueryLogs');
const MissCommandController = require("./controllers/MissCommandController");


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
        ark = new ARK(client, DiscordServersModel);

        ark.start()
                .then(() => {
                        ark.updater().catch(() => {
                                DiscordAlarm.send('Логгер ARK окончательно завершил свою работу!');
                        });
                })
                .catch(console.error);
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

        /** @var {Object} Неведомый костыль, убрать когда переделаю верификацию. */
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
        let controller;

        (new QueryLogs()).send({
                query: message.content,
                author: message.author.id,
                guild: message.guild.id,
                channel: message.channel.id,
                message: message.id,

        })
                .catch(console.error);

        const active_commands = [
                Breeding,
                InfoCommandController,
                Kibble,
                MapsController,
                BugReport,
                ItemsController,
                Helper,
        ];

        const controller_class = active_commands
                        .find(el => {
                                return el.getAliases().indexOf(command) !== -1
                        }) || MissCommandController;

        controller = new controller_class();

        try {
                await controller.setMessage(message);
                await controller.setArgs(args);
                await controller.validate();
                await controller.process();
        } catch (e) {
                console.error('Что-то пошло не так, выпали из обработки контроллера', e);
        }
        setTimeout(() => {
                message.channel.stopTyping(true);
        }, 10000);
});

client.on('error', () => {
        console.error('Discord long query error, its normal.');
});
