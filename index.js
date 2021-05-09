const express = require("express"),
    cors = require("cors"),
    app = express();

require("./dbConnection");
const routes = require("./routes/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));
app.use('/resume', express.static(__dirname + '/uploads'));

for (const r in routes) {
    app.use("/" + r, routes[r]);
}

const port = process.env.PORT || 7000;
app.listen(port, () => {
    console.log("Server is running on port :", port);
});
