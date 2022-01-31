const axios = require("axios/index");
const ini = require("ini");

class ARK_api {
    constructor(){}

    /**
     * @return {Promise<Map>}
     */
    static async getRates() {
        let raw = ini.decode((await axios.get('http://arkdedicated.com/dynamicconfig.ini')).data);
        let result = new Map();
        for(let rate in raw) {
            if(!raw.hasOwnProperty(rate)) continue;
            result.set(rate, raw[rate]);
        }
        return result;
    }

    static async getCurrentVersion() {
        return ((await axios.get('http://arkdedicated.com/version')).data);
    }
}

module.exports = ARK_api;
