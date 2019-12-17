const DiscordSubscribesModel = new (require('../Models/DiscordSubscribesModel'));

class SubscribeController {
        constructor() {
                let instance = this;
                DiscordSubscribesModel.getSubscribes()
                        .then((res) => {
                                instance.subscribeInfo = res;
                        })
                        .catch(console.error);
        }

        activate() {
                this.subscribeInfo.forEach((el) => {

                });
        }
}

module.exports = SubscribeController;
