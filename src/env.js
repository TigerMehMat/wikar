require('dotenv').config();
const path = require('path');

module.exports = {
    TOKEN: process.env.TOKEN,
    WIKI_BOT_LOGIN: process.env.WIKI_BOT_LOGIN,
    WIKI_BOT_PASSWORD: process.env.WIKI_BOT_PASSWORD,
    PATH_DATA: path.resolve(__dirname, '../', process.env.PATH_DATA),
    PATH_CACHE: path.resolve(__dirname, '../', process.env.PATH_CACHE),
};
