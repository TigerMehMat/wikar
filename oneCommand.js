const Discord	= require("discord.js");
const client = new Discord.Client();

const config	= require("./configbot");

client.login(config.token);



client.on("ready", async () => {
	console.log("Готов!\n"+client.user.tag);
	let guild	= client.guilds.get('304855554705063936');
	let channel	= await guild.channels.get('320484352393740288');
	let message	= await channel.fetchMessage('320503200887341068');
	console.log(message.content);
});
