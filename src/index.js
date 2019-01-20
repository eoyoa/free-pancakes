const config = require("./config.json");
const Worker = require("./Worker/Worker");

let workers = [];
for (let token of config.tokens) {
    workers.push(new Worker(token, `./words.txt`, config.options));
}
for (let w of workers) {
    w.run();
}