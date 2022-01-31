const Access = require('./access.js');

class TextModule extends Access {
    static sendHelp(message){
        message.channel.send(this.getHelpMessage());
    }
}

module.exports = TextModule;
