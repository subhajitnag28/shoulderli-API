const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();

require("./dbConnection");
const routes = require("./routes/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

for (const r in routes) {
    if (r) {
        app.use("/" + r, routes[r]);
    }
}

const port = 7000;
app.listen(port, () => {
    console.log("Server is running on port :", port);
});
exports.app = functions.https.onRequest(app);
