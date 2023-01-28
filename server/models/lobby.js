const PlayerCollection = require('./playerCollection');
const Game = require('./game');
const OnlineGame = require('./onlineGame');
const GameSocketServer = require('./gameSocketServer');
const {
    createGameResult,
    insertSingleAssassination,
    insertPairedAssassination,
    insertGamePlayer
} = require('../services/database');
const { choice } = require('../utils/random');

function Lobby(code, host, type, settings) {
    this.code = code;
    this.host = host;
    this.type = type;
    this.settings = settings;
    this.game = null;
    this.playerCollection = new PlayerCollection();
    this.gameSocketServer = null;
    this.updateTime = Date.now();
    this.currentRolePicker = null;
    this.previousRolePickers = [];
    this.currentStartingPlayerInformation = null;
    this.previousStartingPlayers = [];
}

/* 
* General lobby handlers
*/

Lobby.prototype.updateLastUpdatedTime = function () {
    this.updateTime = Date.now();
}

Lobby.prototype.attachGameSocketServer = function (io) {
    this.gameSocketServer = new GameSocketServer(io, this.code);
    this.updateLastUpdatedTime();
}

Lobby.prototype.sendUpdatePlayers = function() {
    this.gameSocketServer.broadcast('lobby:update-players', this.playerCollection.getLobbyPlayers());
}

Lobby.prototype.handleUpdatePlayerIndex = function(playerIndexUpdateInformation) {
    this.playerCollection.handleUpdatePlayerIndex(playerIndexUpdateInformation);
    this.sendUpdatePlayers();
    this.updateLastUpdatedTime();
}

Lobby.prototype.handleKickPlayer = function (playerIndex) {
    this.playerCollection.removePlayer(playerIndex);
    this.sendUpdatePlayers();
    this.updateLastUpdatedTime();
}

Lobby.prototype.handlePlayerDisconnect = function(userId) {
    this.playerCollection.deactivatePlayer(userId);
    this.sendUpdatePlayers();
    this.updateLastUpdatedTime();
}

Lobby.prototype.handlePlayerConnect = function (socket, userId) {
    const socketId = socket.id;
    const firstName = socket.handshake.query.firstName;
    const lastName = socket.handshake.query.lastName;

    socket.join(this.code);
    this.initPlayerSocket(socket, userId);

    if (!this.playerCollection.doesUserIdExist(userId)) {
        const playerInformation = {
            userId: userId,
            firstName: firstName,
            lastName: lastName
        }
        this.playerCollection.addPlayer(playerInformation, socketId);
    } else {
        this.playerCollection.updatePlayer(userId, socketId, true);

        if (this.game) {
            this.catchupPlayer(userId, socketId);
        }
    }

    this.sendUpdatePlayers();
    this.updateLastUpdatedTime();
}

Lobby.prototype.initPlayerSocket = function(socket, userId) {
    // Attach events
    socket.on('lobby:update-player-index', (playerIndexUpdateInformation) => {
        this.updateLastUpdatedTime();
        this.handleUpdatePlayerIndex(playerIndexUpdateInformation);
    });

    socket.on('role:pick', (rolePickInformation) => {
        this.updateLastUpdatedTime();
        rolePickInformation.id = this.playerCollection.getPlayerIdOfUserId(userId);
        this.handleRolePick(rolePickInformation);
    });

    socket.on('game:start', () => {
        this.updateLastUpdatedTime();
        this.handleStartGame();
    });

    /*
    socket.on('proposal:update', (team) => {
        this.updateLastUpdatedTime();
        this.handleUpdateTeam(team);
    });

    socket.on('proposal:submit', (selectedIds) => {
        this.updateLastUpdatedTime();
        this.handleProposeTeam(selectedIds);
    });

    socket.on('affect:toggle', (affectInformation) => {
        this.updateLastUpdatedTime();
        this.handleToggleAffect(userId, affectInformation);
    });

    socket.on('proposal:vote', (vote) => {
        this.updateLastUpdatedTime();
        this.handleVoteTeam(userId, vote);
    });

    socket.on('mission:conduct', (action) => {
        this.updateLastUpdatedTime();
        this.handleConductMission(userId, action);
    });

    socket.on('mission:advance', () => {
        this.updateLastUpdatedTime();
        this.handleAdvanceMission();
    });
    */

    socket.on('mission:results', (missionResultsInformation) => {
        this.updateLastUpdatedTime();
        this.handleMissionResults(missionResultsInformation);
    });

    socket.on('redemption:conduct', (redemptionAttemptInformation) => {
        this.updateLastUpdatedTime();
        this.handleConductRedemption(redemptionAttemptInformation);
    });

    socket.on('assassination:conduct', (conductAssassinationInformation) => {
        this.updateLastUpdatedTime();
        this.handleConductAssassination(conductAssassinationInformation);
    });

    socket.on('lobby:kick-player', (playerId) => {
        this.updateLastUpdatedTime();
        this.handleKickPlayer(playerId);
    });

    socket.on('disconnect', () => {
        this.updateLastUpdatedTime();
        this.handlePlayerDisconnect(userId);
    });
}

/* 
 * Pre game handlers
*/

Lobby.prototype.handleStartGame = function() {
    const players = this.playerCollection.getPlayers();
    if (!this.currentStartingPlayerInformation) {
        this.currentStartingPlayerInformation = this.getStartingPlayerInformation(players);
    }
    if (!this.currentRolePicker) {
        this.currentRolePicker = this.getRolePickerUserId(players);
    }

    if (this.type === 'online') {
        this.game = new OnlineGame(players.map(({ displayName }) => ({ name: displayName })), this.currentStartingPlayerInformation.index, this.settings);
    } else {
        this.game = new Game(players.map(({ displayName }) => ({ name: displayName })), this.currentStartingPlayerInformation.index, this.settings);
    }
    this.lastGunSlots = null;
    this.playerCollection.clearPlayerIds();
    for (let i = 0; i < players.length; i++) {
        const currentPlayer = players[i];
        this.playerCollection.updatePlayerIdByUserId(currentPlayer.userId, i);
        if (currentPlayer.userId === this.currentRolePicker) {
            this.sendPickRoll(currentPlayer.socketId);
        } else {
            this.sendSetupRole(currentPlayer);
        }
    }
}

Lobby.prototype.sendPickRoll = function(receiver) {
    this.gameSocketServer.emit('role:pick', this.game.getPossibleRoles(), receiver);
}

Lobby.prototype.sendSetupRole = function(receiver) {
    this.gameSocketServer.emit('role:setup', null, receiver.socketId);
}

Lobby.prototype.getStartingPlayerInformation = function(players) {
    const possibleStartingPlayers = [];
    for (let i = 0; i < players.length; i++) {
        const currentPlayer = players[i];
        if (!this.previousStartingPlayers.includes(currentPlayer.userId)) {
            possibleStartingPlayers.push({index: i, userId: currentPlayer.userId});
        }
    }

    if (possibleStartingPlayers.length === 0) {
        this.previousStartingPlayers = [];
        for (let i = 0; i < players.length; i++) {
            possibleStartingPlayers.push({index: i, userId: players[i].userId});
        }
    }

    return choice(possibleStartingPlayers);
}

Lobby.prototype.getRolePickerUserId = function(players) {
    const possibleRolePickers = [];
    for (let player of players) {
        if (!this.previousRolePickers.includes(player.userId)) {
            possibleRolePickers.push(player.userId);
        }
    }

    if (possibleRolePickers.length === 0) {
        this.previousRolePickers = [];
        Array.prototype.push.apply(possibleRolePickers, players.map(player => player.userId));
    }

    return choice(possibleRolePickers);
}

Lobby.prototype.handleRolePick = function(rolePickInformation) {
    const game = this.game;
    game.assignRoles(rolePickInformation);

    const players = this.playerCollection.getPlayers();
    for (var i = 0; i < players.length; i++) {
        const currentPlayer = players[i];
        this.sendAssignRole(currentPlayer);
    }

    if (game.isOnlineGame()) {
        this.sendMissionResultsInformation(game, this.code);
        this.handleStartProposal();
    } else {
        this.sendSetupGame(this.playerCollection.getPlayerOfPlayerId(0).socketId);
    }
}

Lobby.prototype.sendAssignRole = function(receiver) {
    this.gameSocketServer.emit('role:assign', this.game.getRoleInformation(receiver.id), receiver.socketId);
}

Lobby.prototype.sendSetupGame = function(receiver) {
    this.gameSocketServer.emit('game:setup', this.game.getCurrentLeader().name, receiver);
}

/* 
 * Common game handlers
*/

Lobby.prototype.catchupPlayer = function(userId, socketId) {
    const currentPlayer = this.playerCollection.getPlayerOfUserId(userId);
    if (currentPlayer.id !== null) {
        const gamePhase = this.game.phase;
        if (gamePhase === Game.PHASE_SETUP) {
            if (userId === this.currentRolePicker) {
                this.sendPickRoll(socketId);
            } else {
                this.sendSetupRole(currentPlayer);
            }
        }
        else {
            this.sendAssignRole(currentPlayer);

            if (this.game.isOnlineGame()) {
                this.catchupOnlinePlayer(currentPlayer, socketId, gamePhase);
            } else {
                this.catchupLocalPlayer(currentPlayer, socketId, gamePhase);
            }
        }
    }
}

Lobby.prototype.handleMissionResults = function(missionResultsInformation) {
    this.game.setMissionResults(missionResultsInformation);
    if (this.game.phase === Game.PHASE_REDEMPTION) {
        this.handleStartConductRedemption();
    } else if (this.game.phase === Game.PHASE_ASSASSINATION) {
        this.handleStartConductAssassination();
    } else {
        this.handleFinishGame();
    }
}

Lobby.prototype.handleStartConductRedemption = function() {
    if (this.game.isOnlineGame()) {
        for (let gamePlayer of this.playerCollection.getGamePlayers()) {
            this.sendConductRedemptionToPlayer(gamePlayer);
        }
    } else {
        this.sendConductRedemptionToPlayer(this.playerCollection.getPlayerOfPlayerId(0));
    }
    this.updateLastUpdatedTime();
}

Lobby.prototype.sendConductRedemptionToPlayer = function(player) {
    const conductRedemptionInformation = this.game.getConductRedemptionInformation(player.id);
    this.gameSocketServer.emit('redemption:conduct', conductRedemptionInformation, player.socketId);
}

Lobby.prototype.handleConductRedemption = function(redemptionAttemptInformation) {
    this.game.handleRedemptionAttempt(redemptionAttemptInformation.ids);
    if (this.game.phase === Game.PHASE_ASSASSINATION) {
        this.handleStartConductAssassination();
    } else {
        this.handleFinishGame();
    }
}

Lobby.prototype.handleStartConductAssassination = function() {
    if (this.game.isOnlineGame()) {
        for (let gamePlayer of this.playerCollection.getGamePlayers()) {
            this.sendConductAssassinationToPlayer(gamePlayer);
        }
    } else {
        this.sendConductAssassinationToPlayer(this.playerCollection.getPlayerOfPlayerId(0));
    }
    this.updateLastUpdatedTime();
}

Lobby.prototype.sendConductAssassinationToPlayer = function(player) {
    const conductAssassinationInformation = this.game.getConductAssassinationInformation(player.id);
    this.gameSocketServer.emit('assassination:conduct', conductAssassinationInformation, player.socketId);
}

Lobby.prototype.handleConductAssassination = function(conductAssassinationInformation) {
    this.game.handleAssassinationAttempt(conductAssassinationInformation);
    this.handleFinishGame();
}

/*
* Local game handlers
*/

Lobby.prototype.catchupLocalPlayer = function(currentPlayer, socketId, gamePhase) {
    switch (gamePhase) {
        case Game.PHASE_MISSIONS:
            if (currentPlayer.id === 0) {
                this.sendSetupGame(socketId);
            }
            break;
        case Game.PHASE_REDEMPTION:
            if (currentPlayer.id === 0) {
                this.sendConductRedemptionToPlayer(currentPlayer);
            }
            break;
        case Game.PHASE_ASSASSINATION:
            if (currentPlayer.id === 0) {
                this.sendConductAssassinationToPlayer(currentPlayer);
            }
            break;
        case Game.PHASE_DONE:
            this.sendGameResult(socketId);
            break;
    }
}

/* 
 * Online game handlers
*/

Lobby.prototype.catchupOnlinePlayer = function(currentPlayer, socketId, gamePhase) {
    this.sendMissionResultsInformation(socketId);

    switch (gamePhase) {
        case OnlineGame.PHASE_PROPOSE:
            if (this.game.isCurrentLeader(currentPlayer.id)) {
                this.sendProposeTeam(currentPlayer);
            } else {
                this.sendUpdateTeam(currentPlayer);
            }
            break;
        case OnlineGame.PHASE_VOTE:
            this.sendUpdateTeam(currentPlayer);
            this.sendVoteTeam(currentPlayer);
            break;
        case OnlineGame.PHASE_VOTE_REACT:
            this.sendVoteResultToPlayer(currentPlayer);
            if (currentPlayer.id === 0) {
                this.sendReact(socketId);
            }
            break;
        case OnlineGame.PHASE_CONDUCT:
            sendConductMissionToPlayer(currentPlayer);
            break;
        case OnlineGame.PHASE_CONDUCT_REACT:
            this.sendMissionResult(socketId, true);
            if (currentPlayer.id === 0) {
                this.sendReact(socketId);
            }
            break;
        case Game.PHASE_REDEMPTION:
            this.sendConductRedemptionToPlayer(currentPlayer);
            break;
        case Game.PHASE_ASSASSINATION:
            this.sendConductAssassinationToPlayer(currentPlayer);
            break;
        case Game.PHASE_DONE:
            this.sendGameResult(socketId);
            break;
    }
}

Lobby.prototype.getConductMissionInformation = function(playerId) {
    return this.game.getConductMissionInformation(playerId);
}

Lobby.prototype.handleConductMission = function(userId, action) {
    const playerId = this.playerCollection.getPlayerIdOfUserId(userId);
    if (this.game.addMissionAction(playerId, action)) {
        sendMissionResultsInformation(this.game, this.code);
        sendMissionResult(this.game, this.code, true);
        if (this.game.phase === Game.PHASE_REDEMPTION) {
            this.startConductRedemption(this);
        } else if (this.game.phase === Game.PHASE_ASSASSINATION) {
            this.startConductAssassination(this);
        } else if (this.game.isGameOver()) {
            this.handleFinishGame();
        } else {
            this.sendReact(this.playerCollection.getSocketIdOfPlayerId(0));
        }
    }
}

Lobby.prototype.sendMissionResultsInformation = function(receiver) {
    this.gameSocketServer.emit('game:update-mission-results', this.game.getMissionResultsInformation(), receiver);
}

Lobby.prototype.sendMissionResult = function(receiver, showActions, missionId) {
    const missionResult = this.game.getMissionResult(missionId);
    if (missionResult) {
        this.gameSocketServer.emit('mission:result', { result: missionResult, showActions: showActions }, receiver);
    }
}

/*
* Post game handlers
*/

Lobby.prototype.handleGameResult = async function () {
    const gameResult = this.game.getGameResult();
    const gameId = await createGameResult(this.game.startTime, gameResult);
    if (gameResult.assassination) {
        const assassinationSuccessful = gameResult.winner === "Spies";
        if (gameResult.assassination.targets.length > 1) {
            await insertPairedAssassination(gameId,
                this.playerCollection.getUserIdOfPlayerId(gameResult.assassination.assassin.id),
                this.playerCollection.getUserIdOfPlayerId(gameResult.assassination.targets[0].id),
                gameResult.assassination.role,
                this.playerCollection.getUserIdOfPlayerId(gameResult.assassination.targets[1].id),
                gameResult.assassination.role,
                assassinationSuccessful);
        } else {
            await insertSingleAssassination(gameId,
                this.playerCollection.getUserIdOfPlayerId(gameResult.assassination.assassin.id),
                this.playerCollection.getUserIdOfPlayerId(gameResult.assassination.targets[0].id),
                gameResult.assassination.role,
                assassinationSuccessful);
        }
    }

    for (let player of this.playerCollection.getGamePlayers()) {
        await insertGamePlayer(gameId, player.userId, this.game.getPlayerRoleName(player.id));
    }
}

Lobby.prototype.handleFinishGame = function() {
    this.handleGameResult().then(() => {
        this.previousStartingPlayers.push(this.currentStartingPlayerInformation.userId);
        this.currentStartingPlayerInformation = null;
        this.previousRolePickers.push(this.currentRolePicker);
        this.currentRolePicker = null;
        this.sendGameResult(this.code);
        this.updateLastUpdatedTime();
    });
}

Lobby.prototype.sendGameResult = function(receiver) {
    this.gameSocketServer.emit('game:result', this.game.getGameResultInformation(), receiver);
}

module.exports = Lobby;