require('dotenv').config({ path: `${__dirname}/.env` });

const express = require('express');
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const attachServerSocket = require('./serverSocket');

const loginRouter = require('./routes/login');
const gameRouter = require('./routes/game');

const app = express();

const server = http.createServer(app);
attachServerSocket(server);

//const ROOT_URL = "http://localhost:80"
const ROOT_URL = "https://www.extavalon.com:80"
app.use(cors({
    origin: ROOT_URL,
    optionsSuccessStatus: 200
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/login', loginRouter);
app.use('/api/game', gameRouter);

server.listen(process.env.PORT || 5000);

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    process.exit();
});
