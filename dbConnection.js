const env = process.env.NODE_ENV || "development";
const mongoClient = require("mongodb").MongoClient;
const config = require("./config");

const connectionUri = env === "development" ? [
    config.dbDevConfig.baseUrl + config.dbDevConfig.host + ":" + config.dbDevConfig.port + "/" + config.dbName
].join("") : [
    config.dbProdConfig.baseUrl + config.dbProdConfig.username + ":" + encodeURIComponent(config.dbProdConfig.password) + "@" + config.dbProdConfig.cluster
].join("");

// const connectionUri = "mongodb+srv://subhajit:subhajit@test.1seu7.mongodb.net/shoulderli?retryWrites=true&w=majority";
const client = new mongoClient(connectionUri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((error) => {
    if (error) {
        console.log('Connection with mongoDb failed');
        process.exit(1);
    }
    console.log('Connected with mongoDb...');
});

module.exports = client;