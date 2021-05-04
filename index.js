const express = require("express"),
    // https = require('https'),
    // fs = require('fs'),
    cors = require("cors"),
    app = express();

require("./dbConnection");
const routes = require("./routes/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));
app.use('/resume', express.static(__dirname + '/uploads'));
// app.set('port', 7000);

for (const r in routes) {
    app.use("/" + r, routes[r]);
}

const port = process.env.PORT || 7000;
app.listen(port, () => {
    console.log("Server is running on port :", port);
});

// const port = app.get('port');
// const createServerOptions = {
//     cert: fs.readFileSync('/etc/letsencrypt/archive/shoulderlihr.com/fullchain1.pem'),
//     key: fs.readFileSync('/etc/letsencrypt/archive/shoulderlihr.com/privkey1.pem')
// };
// https.createServer(createServerOptions, app).listen(port, () => {
//     console.log("Server is running on port :" + port)
// });
