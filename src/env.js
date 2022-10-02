require('dotenv').config();
const path = require('path');

module.exports = {
    TOKEN: process.env.TOKEN,
    WIKI_BOT_PROTOCOL: process.env.WIKI_BOT_PROTOCOL || 'https',
    WIKI_BOT_SERVER: process.env.WIKI_BOT_SERVER,
    WIKI_BOT_PATH: process.env.WIKI_BOT_PATH || '',
    WIKI_BOT_LOGIN: process.env.WIKI_BOT_LOGIN,
    WIKI_BOT_PASSWORD: process.env.WIKI_BOT_PASSWORD,
    SENTRY_DSN: process.env.SENTRY_DSN,
    PATH_DATA: path.resolve(__dirname, '../', process.env.PATH_DATA),
    PATH_CACHE: path.resolve(__dirname, '../', process.env.PATH_CACHE),
};
