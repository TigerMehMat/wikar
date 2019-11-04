const axios = require("axios/index");
const ini = require("ini");

class ARK_api {
    constructor(){}

    static async getRates(){
        let raw = await axios.get('http://arkdedicated.com/dynamicconfig.ini');
        return ini.decode(raw.data);
    }
}

module.exports = ARK_api;
