const fs = require("fs");
const Discord = require("discord.js");

module.exports = class Worker {
	constructor (token, dictionaryPath, options) {
		this.token = token;
		this.dictionary = fs.readFileSync(dictionaryPath, { encoding: "utf8" }).split(/\n/g);
		this.dictionaryLength = this.dictionary.length;

		this.commands = require("./Commands");
		this.sendMs = options.sendMs || 1500;
		this.giveMs = options.giveMs || 900000;
		this.superuser = options.superuser;
		this.guild = options.guild;
		this.prefix = options.prefix || "!";
	}

	run() {
		const client = new Discord.Client();

		client.on("message", message => {
			const { guild, channel, author, content } = message;

			if (guild != null && this.guild === guild.id && content.startsWith(this.prefix) && this.superuser === author.id) {
				const args = content
					.slice(this.prefix.length)
					.trim()
					.match(/"[^"]+"|[^\s]+/g)
					.map(e => e.replace(/"(.+)"/, "$1"));
				const command = args.shift();

				try {
					this.commands[command](message, args, this);
				} catch (e) {
					channel.send(`Error in running command! \`${e}\``);
				}
			}
		});

		client.login(this.token)
			.then(() => {
				console.log(`Worker ${this.token} has logged on.`);
			}, reason => {
				console.error(`Worker ${this.token} has failed to login: "${reason}"`);
			});
	}

	log(message, logMessage) {
		message.channel.send(logMessage)
			.then(m => {
				console.log(`${this.token}: ${m.content}`);
			});
	}
}