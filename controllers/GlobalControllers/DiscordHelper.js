class SenderReactions {
        constructor() {
                this.stoped = false;
                this.message = undefined;
                this.reactions = undefined;
        }

        setMessage(message) {
                this.message = message;
                return this;
        }

        setReactions(reactions) {
                this.reactions = reactions;
                return this;
        }

        stop() {
                this.stoped = true;
                return this;
        }

        async execute() {
                for(let i = 0; i < this.reactions.length; i++) {
                        if (this.stoped) break;
                        await this.message.react(this.reactions[i]);
                }
                return this;
        }
}

class DiscordHelper {
        static reactionsSender() {
                return new SenderReactions();
        }
}

module.exports = DiscordHelper;