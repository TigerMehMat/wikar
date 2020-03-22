class DiscordHelper {
        static sendAllReactions(message, reactions) {
                return new Promise(async (resolve, reject) => {
                        for(let i = 0; i < reactions.length; i++) {
                                await message.react(reactions[i]);
                        }
                        resolve();
                });
        }
}

module.exports = DiscordHelper;