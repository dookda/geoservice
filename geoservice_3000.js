var https = require('https');
var fs = require('fs');
const express = require('express');
const app = express();

const whk = require('./service/webhook');
app.use(whk);

const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use('/', express.static('www'))

const api = require('./service/api');
app.use(api);

// var https_options = {
//     key: fs.readFileSync("/etc/apache2/ssl/private.key"),
//     cert: fs.readFileSync("/etc/apache2/ssl/public.crt"),
//     ca: fs.readFileSync('/etc/apache2/ssl/intermediate.crt')
// };

// var server = https.createServer(https_options, app);
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`running at http://localhost:${port}`);
});

// var port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })
