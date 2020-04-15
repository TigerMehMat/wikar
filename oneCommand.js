const Discord	= require("discord.js");
const client = new Discord.Client();

const config	= require("./configbot_release");

client.login(config.token);



client.on("ready", async () => {
	console.log("Готов!\n"+client.user.tag);
	let guild	= client.guilds.get('412361421335298048');
	let channel	= await guild.channels.get('689433675490000963');
	let user = client.users.find(user => user.id === '256681177740607488');
	user.send('Пошалим?');
	//let message	= await channel.fetchMessage('320503200887341068');
	//console.log(message.content);

	client.on("message", message => {
		if(message.author.id === user.id && message.channel.type === "dm") {
			console.log(message.content);
		}
	});
});
