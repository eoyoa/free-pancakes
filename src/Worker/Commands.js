// commands
module.exports = {
	// farm command
	"farm": (message, args, worker) => {
		if (args[0] === "start") {
			if (!worker.farm) {
				worker.log(message, "Farming started...");
				// set loop
				let farm = setInterval(function sendFunction() {
					let words = "";
					for (let i = 0; i < 10; i++) {
						let index = Math.floor(Math.random() * worker.dictionaryLength);
						let word = worker.dictionary[index];
						words += `${word.toLowerCase()} `;
					}
					message.channel.send(words);
				}, worker.sendMs);
				worker.farm = farm;
			} else {
				worker.log(message, "Farm already started!");
			}
		} else if (args[0] === "stop") {
			if (!!worker.farm) {
				clearInterval(worker.farm);
				worker.farm = undefined;
				worker.log(message, "Farming stopped...");
			} else {
				worker.log(message, "Farm already stopped!");
			}
		} else {
			message.channel.send("Invalid argument for command!");
		}
	},
	// give
	"give": (message, args, worker) => {
		// send pancake bot give command to superuser
		const filter = m => m.author.id === "239631525350604801";
		message.client.fetchUser("239631525350604801").then(user => {
			user.createDM().then(channel => {
				channel.send("p!pancakes");
				channel.awaitMessages(filter, { max: 1 }).then(c => {
					let pancakes = c.values()
									.next()
									.value.content.split(" ")[2]
									.replace(/(\*\*)|(,)/g, "");
					message.channel.send(`p!give ${pancakes} <@${worker.superuser}>`);
				});
			});
		})
	},
	// collect daily
	"collectDaily": (message, args, worker) => {
		message.channel.send("Let's get that daily bread...");
		// send pancake bot daily command
		message.client.fetchUser("239631525350604801").then(u => {
			u.createDM().then(channel => {
				channel.send("p!daily");
			});
		});
	},
	// shutdown worker
	"shutdown": (message, args, worker) => {
		// clear farm instance if it exists
		if (!!worker.farm) clearTimeout(worker.farm);
		message.channel.send("Goodbye!")
			.then(() => {
				// close Discord client
				message.client.destroy();
			});
	},
	// check ping
	"ping": (message, args, worker) => {
		worker.log(message, `${message.client.pings[0]} ms of ping.`);
	}
}