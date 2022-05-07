const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authenticate');
const { parseAuthorization } = require('../utils/authorization');
const lobbyManager = require('../models/lobbyManager');

router.get('/:code', authenticate, function (req, res) {
    const code = req.params.code;
    const lobby = lobbyManager.get(code);
    if (lobby) {
        const authorization = parseAuthorization(req.headers);
        const lobbyFull = !lobby.playerCollection.doesUserIdExist(authorization.userId) && lobby.playerCollection.getPlayerCount() === 10;

        if (lobbyFull) {
            res.status(409).json({
                error: "Game Full!"
            });
        } else {
            res.json({
                code: code,
                host: lobby.host,
                settings: lobby.settings
            });
        }
    } else {
        res.status(404).json({
            error: "Game Not Found!"
        });
    }
});

router.post('/', authenticate, function (req, res) {
    // Rest authorization needed
    const type = req.body.type;
    const settings = {
        ector: req.body.ector === "on",
        kay: req.body.kay === "on",
        titania: req.body.titania === "on",
        accolon: req.body.accolon === "on",
        bors: req.body.bors === "on",
        lamorak: req.body.lamorak === "on",
        gaheris: type === 'online' && req.body.resistancebind === "on",
        geraint: type === 'online' && req.body.spybind === "on",
        cynric: type === 'online' && req.body.resistancebind === "on",
        cerdic: type === 'online' && req.body.spybind === "on",
        sirrobin: type === 'online' && req.body.sirrobin === "on"
    };
    const code = lobbyManager.create(Number(req.cookies.userId), type, settings);
    res.json({
        code: code
    });
});

module.exports = router;