const axios     = require("axios/index");
const config    = require("../../configbot");

class BM_api {
    constructor(token){
        this.instance = axios.create({
            baseURL: 'https://api.battlemetrics.com',
        });
        if(!Array.isArray(token)) token = [token];
        this.tokens = token;
        this.currentTocen = 0;
        this.instance.defaults.headers.common['Authorization'] = 'Bearer ' + this.tokens[this.currentTocen];
        this.instance.defaults.headers.post['Content-Type'] = 'application/json';
    }

    getPlayers(server){
        return new Promise((resolve, reject) => {
            this.instance.get('/servers/'+server, {
                params: {
                    'fields[player]': 'name',
                    'fields[server]': 'name',
                    'include': 'player',//identifier
                }
            }).then((res) => {
                resolve(res.data);
            }).catch((error) => {
                console.error('Обращение к BattleMetrics API провалено: ' + error.status + ' (' + error.statusText + ')');
                reject(error);
            });
        });
    }

    async getPlayersByAllServers(serverList){
        if(!Array.isArray(serverList)){
            serverList = [serverList];
        }
        let result = {};
        for(let i = 0; i < serverList.length; i++){
            let data;
            data = await this.getPlayers(serverList[i]);
            if(!data) console.error("Empty data");
            result[serverList[i]] = [];
            for(let j = 0; j < data.included.length; j++) {
                result[serverList[i]].push({"name": data.included[j].attributes.name, "id": data.included[j].id});
            }
            await setTimeout(() => {}, config.bm_duration_time);
        }
        return result;
    }

    // getServerLists(servers){
    //     let thisClass = this;
    //     return new Promise((resolve, reject) => {
    //         thisClass.getPlayers(servers)
    //             .then((res) => {
    //                 console.log(res);
    //                 /*let resServers = {};
    //                 for(let i = 0; i < res.length; i++){
    //                     let currentServers = res[i].relationships.servers.data;
    //                     currentServers = currentServers.filter((fitem) => {
    //                         return fitem.meta.online;
    //                     });
    //                     for(let d = 0; d < currentServers.length; d++){
    //                         let currentServer = currentServers[d];
    //                         if(servers.indexOf(currentServer.id)!==-1) {
    //                             if(!resServers[currentServer.id])
    //                                 resServers[currentServer.id] = [{"name": res[i].attributes.name, "id": res[i].id}];
    //                             else
    //                                 resServers[currentServer.id].push({"name": res[i].attributes.name, "id": res[i].id});
    //                             resServers[currentServer.id].sort();
    //                         }
    //                     }
    //                 }*/
    //                 resolve(resServers);
    //             })
    //             .catch(reject);
    //     })
    // }
}

module.exports = BM_api;
