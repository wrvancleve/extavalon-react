require('dotenv').config({ path: `${__dirname}/.env` });

const express = require('express');
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const createGameSocket = require('./gameSocket');

const loginRouter = require('./routes/login');
const gameRouter = require('./routes/game');

const app = express();

const server = http.createServer(app);
createGameSocket(server);

app.use(cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/login', loginRouter);
app.use('/game', gameRouter);

server.listen(process.env.PORT || 5000);

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    process.exit();
});
