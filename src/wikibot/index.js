const env = require('../env');
const bot = require('nodemw');

// pass configuration object
const client = new bot({
    "username": env.WIKI_BOT_LOGIN,
    "password": env.WIKI_BOT_PASSWORD,
    protocol: 'https',           // Wikipedia now enforces HTTPS
    server: 'ark.fandom.com',  // host name of MediaWiki-powered site
    path: '',                  // path to api.php script
    debug: false                 // is more verbose when set to true
});

function getWikiImage(url) {
    return new Promise(resolve => {
        client.getImages(url, function (err, data) {
            // error handling
            if (err) {
                resolve(null);
                return;
            }

            const img = data.find(el => el.name === url);

            resolve(img?.url);
        });
    });
}

/**
 *
 * @returns {Promise<string>}
 */
function getDvData() {
    return new Promise(resolve => {
        client.getArticle('Module:Dv/data', true, function (err, data) {
            // error handling
            if (err) {
                resolve(null);
                return;
            }

            resolve(data);
        });
    });
}

/**
 *
 * @returns {Promise<string>}
 */
function getCreatures() {
    return new Promise(resolve => {
        client.getArticle('Module:TamingTable/creatures', true, function (err, data) {
            // error handling
            if (err) {
                resolve(null);
                return;
            }

            resolve(data);
        });
    });
}

/**
 *
 * @returns {Promise<string>}
 */
function getFood() {
    return new Promise(resolve => {
        client.getArticle('Module:TamingTable/food', true, function (err, data) {
            // error handling
            if (err) {
                resolve(null);
                return;
            }

            resolve(data);
        });
    });
}

module.exports = {
    getWikiImage: getWikiImage,
    getDvData: getDvData,
    getCreatures: getCreatures,
    getFood: getFood,
};
