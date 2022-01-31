const AbstractCommandController = require("./AbstractCommandController.js");

class MissCommandController extends AbstractCommandController {
        process() {
                return Promise.resolve(undefined);
        }

        setArgs(args) {
                return Promise.resolve(undefined);
        }
}

module.exports = MissCommandController;
