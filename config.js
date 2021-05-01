module.exports = {
    dbName: "shoulderli",
    dbDevConfig: {
        baseUrl: "mongodb://",
        host: "127.0.0.1",
        port: "27017",
    },
    dbProdConfig: {
        baseUrl: "mongodb+srv://",
        username: "subhajit",
        password: "subhajit",
        cluster: "test.1seu7.mongodb.net/shoulderli?retryWrites=true&w=majority"
    },
    secret: "SHOULDERLI_API_2021"
};