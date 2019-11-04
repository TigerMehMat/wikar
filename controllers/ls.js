const fs    = require('fs');
const path  = require('path');

class LS {
    static reply(message) {
        const blockedUsersFile = fs.readFileSync(path.resolve(__dirname, '../data/ls/blocked.json'), 'utf-8');
        let blockedUsers = JSON.parse(blockedUsersFile);
        if(blockedUsers.indexOf(message.author.id) !== -1) return;

        blockedUsers.push(message.author.id);

        fs.writeFileSync(path.resolve(__dirname, '../data/ls/blocked.json'), JSON.stringify(blockedUsers));

        message.reply('Увы, бот работает только на некоторых серверах википедии. Обратиться к нему в лс нельзя.\n' +
            'Однако, вы можете присоединиться к нам и использовать бота там!\n' +
            'https://discord.gg/BsXwMXp');
    }
}

module.exports = LS;
