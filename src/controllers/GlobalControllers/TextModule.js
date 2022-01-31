class TextModule {
    constructor(){

    }

    sendHelp(message){
        message.channel.send(this.helpMessage);
    }
}

module.exports = TextModule;