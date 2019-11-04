const access = require('./GlobalControllers/access');

class BugReport {
    static controller(message, args, messageAccess){
        if(!access.isAccess(messageAccess)) return;
        let mess = 'Доброго времени суток. \n' +
            '\n' +
            'Информацию по багам, ошибкам игры, читерам, багоюзерам и нежелательным игрокам вы можете предоставить:\n' +
            '• На официальном сайте игры. Приоритетный язык - английский. Потребуется регистрация, упростить ещё можно кнопкой "войти через стим".\n' +
            'Именно на этом ресурсе среагируют быстрее всего.\n' +
            '<https://survivetheark.com/index.php?/pc-bug-reports/>\n\n' +
            '• В сообществе Steam. Приоритетный язык - английский.\n' +
            '<https://steamcommunity.com/app/346110/discussions/>\n\n' +
            '• На форуме игры. Приоритетный язык - английский.\n' +
            '<https://survivetheark.com/index.php?/forums/>\n\n' +
            'Благодарим за помощь по улучшению игры!';
        message.channel.send(mess);
    }
}

module.exports = BugReport;
