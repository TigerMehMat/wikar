require('dotenv').config();
const CreaturesModel = require('../../Models/CreaturesModel');
const axios = require('axios');
const cheerio = require('cheerio');

async function main() {
    const creatures = (await (new CreaturesModel()).getAllCreatures()).splice(0,1);

    for (const creature of creatures) {
        const page = await axios.get(getWikiLink(creature.en_name));
        const $ = cheerio.load(page);
        console.log($(`.spawningMap-container img`));
    }
}

/**
 * @param {string} creature_name
 * @returns {string}
 */
function getWikiLink(creature_name) {
    return `https://ark.fandom.com/wiki/${creature_name.replace(/\s/g, '_')}`;
}

main()
.catch(err => {
    throw err;
})
