import fetch from 'node-fetch';
import {Client, GuildScheduledEvent, Intents} from 'discord.js';
import {} from 'dotenv/config';

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

bot.on("ready", () => {
    console.log("The bot is ready");

    bot.user.setActivity("Gas Price", {type: 'WATCHING'});

    const GasPriceInterval = setInterval (async function () {
	try {
		let [fast, standard, slow] = await getGasPrices();

		//bot.user.setActivity("⚡" + fast + " 🚶" + standard + " 🐢" + slow, {type: 'WATCHING'});

		bot.user.setActivity("gas prices", {type: 'WATCHING'});

		const guilds = bot.guilds.cache.map(guild => guild.id);

		guilds.forEach(async(id) => {
			let guild = bot.guilds.cache.get(id);
			guild.me.setNickname("⚡" + fast + " 🚶" + standard + " 🐢" + slow);
		})

		console.log('Results posted');
	} catch(error) {
           console.log(error);
        }
    }, 15000);
});

async function getGasPrices() {
	try {
		var apiLink = "https://www.etherchain.org/api/gasnow?utm_source=axielive";
				
		const response = await fetch(apiLink);

		const data = await response.json();

		let fast = data.data.fast;
		let standard = data.data.standard;
		let slow = data.data.slow;

		fast = fast / (10**9);
		standard = standard / (10**9);
		slow = slow / (10**9);

		fast = fast.toFixed(0);
		standard = standard.toFixed(0);
		slow = slow.toFixed(0);

		return [fast, standard, slow];
	} catch(e) {
		console.log(e);
	}
}

bot.login(process.env.BOT_TOKEN);

