module.exports = {
	"farm": (message, args, workerObject) => {
		if (args[0] === "start") {
			if (!workerObject.farm) {
				workerObject.log(message, "Farming started...");
				let farm = setInterval(function sendFunction() {
					let words = "";
					for (let i = 0; i < 10; i++) {
						let index = Math.floor(Math.random() * workerObject.dictionaryLength);
						let word = workerObject.dictionary[index];
						words += `${word.toLowerCase()} `;
					}
					message.channel.send(words);
				}, workerObject.sendMs);
				workerObject.farm = farm;
			}
		} else if (args[0] === "stop") {
			if (!!workerObject.farm) {
				clearInterval(workerObject.farm);
				workerObject.farm = undefined;
				workerObject.log(message, "Farming stopped...");
			}
		} else {
			message.channel.send("Invalid argument for command!");
		}
	},
	"give": (message, args, workerObject) => {
		const filter = m => m.author.id === "239631525350604801";
		message.client.fetchUser("239631525350604801").then(user => {
			user.createDM().then(channel => {
				channel.send("p!pancakes");
				channel.awaitMessages(filter, { max: 1 }).then(c => {
					let pancakes = c.values()
									.next()
									.value.content.split(" ")[2]
									.replace(/(\*\*)|(,)/g, "");

					message.channel.send(`p!give ${pancakes} <@329031236133715999>`);
				});
			});
		})
	},
	"collectDaily": (message, args, workerObject) => {
		message.channel.send("Let's get that daily bread...");
		message.client.fetchUser("239631525350604801").then(u => {
			u.createDM().then(channel => {
				channel.send("p!daily");
			});
		});
	},
	"shutdown": (message, args, workerObject) => {
		if (!!workerObject.farm) clearTimeout(workerObject.farm);
		message.channel.send("Goodbye!")
			.then(() => {
				message.client.destroy();
			});
	},
	"ping": (message, args, workerObject) => {
		workerObject.log(message, `${message.client.pings[0]} ms of ping.`);
	}
}