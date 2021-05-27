const mongoClient = require("mongodb").MongoClient;
const config = require("./config");

const connectionUri = [
    config.dbProdConfig.baseUrl + config.dbProdConfig.username + ":" + encodeURIComponent(config.dbProdConfig.password) + "@" + config.dbProdConfig.cluster
].join("");

const client = new mongoClient(connectionUri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((error) => {
    if (error) {
        console.log("Connection with mongoDb failed");
        process.exit(1);
    }
    console.log("Connected with mongoDb...");
});

module.exports = client;