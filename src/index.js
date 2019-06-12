// import config file
const config = require("./config.json");
// import Worker class
const Worker = require("./Worker/Worker");

// make workers for all workers with tokens
let workers = [];
for (let token of config.tokens) {
    workers.push(new Worker(token, `./words.txt`, config.options));
}
// run each worker
for (let w of workers) {
    w.run();
}