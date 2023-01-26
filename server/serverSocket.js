const lobbyManager = require('./models/lobbyManager');
const { choice } = require('./utils/random');

function attachServerSocket(httpServer) {
    const io = require('socket.io')(httpServer, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    function closeLobby(code) {
        lobbyManager.delete(code);
        io.sockets.to(code).emit('lobby:close');
    };

    setInterval(function () {
        var time = Date.now();
        for (let lobby of lobbyManager.lobbies.values()) {
            if (lobby.updateTime < (time - 3600000)) {
                closeLobby(lobby.code);
            }
        }
    }, 600000);    

    function handleStartGame(lobby) {
        const players = lobby.playerCollection.getPlayers();
        if (!lobby.currentStartingPlayerInformation) {
            lobby.currentStartingPlayerInformation = getStartingPlayerInformation(lobby, players);
        }
        if (!lobby.currentRolePicker) {
            lobby.currentRolePicker = getRolePickerUserId(lobby, players);
        }

        if (lobby.type === 'online') {
            lobby.game = new OnlineGame(players.map(({ displayName }) => ({ name: displayName })), lobby.currentStartingPlayerInformation.index, lobby.settings);
        } else {
            lobby.game = new Game(players.map(({ displayName }) => ({ name: displayName })), lobby.currentStartingPlayerInformation.index, lobby.settings);
        }
        lobby.lastGunSlots = null;
        lobby.playerCollection.clearPlayerIds();
        for (let i = 0; i < players.length; i++) {
            const currentPlayer = players[i];
            lobby.playerCollection.updatePlayerIdByUserId(currentPlayer.userId, i);
            if (currentPlayer.userId === lobby.currentRolePicker) {
                sendRolePick(lobby.game, currentPlayer);
            } else {
                sendRoleSetup(currentPlayer);
            }
        }
    }

    function getStartingPlayerInformation(lobby, players) {
        const possibleStartingPlayers = [];
        for (let i = 0; i < players.length; i++) {
            const currentPlayer = players[i];
            if (!lobby.previousStartingPlayers.includes(currentPlayer.userId)) {
                possibleStartingPlayers.push({index: i, userId: currentPlayer.userId});
            }
        }

        if (possibleStartingPlayers.length === 0) {
            lobby.previousStartingPlayers = [];
            for (let i = 0; i < players.length; i++) {
                possibleStartingPlayers.push({index: i, userId: players[i].userId});
            }
        }

        return choice(possibleStartingPlayers);
    }

    function getRolePickerUserId(lobby, players) {
        const possibleRolePickers = [];
        for (let player of players) {
            if (!lobby.previousRolePickers.includes(player.userId)) {
                possibleRolePickers.push(player.userId);
            }
        }

        if (possibleRolePickers.length === 0) {
            lobby.previousRolePickers = [];
            Array.prototype.push.apply(possibleRolePickers, players.map(player => player.userId));
        }

        return choice(possibleRolePickers);
    }

    function handleRolePick(lobby, rolePickInformation) {
        const game = lobby.game;
        game.assignRoles(rolePickInformation);

        const players = lobby.playerCollection.getPlayers();
        for (var i = 0; i < players.length; i++) {
            const currentPlayer = players[i];
            sendRoleAssign(game, currentPlayer);
        }

        if (game.isOnlineGame()) {
            sendMissionResultsInformation(game, lobby.code);
            handleStartProposal(lobby);
        } else {
            sendGameSetup(game, lobby.playerCollection.getPlayerOfPlayerId(0));
        }
    }

    function sendRolePick(game, receiver) {
        io.sockets.to(receiver.socketId).emit('role:pick', game.getPossibleRoles());
    }

    function sendGameSetup(game, receiver) {
        io.sockets.to(receiver.socketId).emit('game:setup', game.getCurrentLeader().name);
    }

    function sendRoleSetup(receiver) {
        io.sockets.to(receiver.socketId).emit('role:setup');
    }

    function sendRoleAssign(game, receiver) {
        io.sockets.to(receiver.socketId).emit('role:assign', game.getRoleInformation(receiver.id));
    }

    function sendStatusMessage(message, receiver) {
        io.sockets.to(receiver).emit('update-status', message);
    }

    function handleStartProposal(lobby) {
        for (let player of lobby.playerCollection.getPlayers()) {
            if (lobby.game.isCurrentLeader(player.id)) {
                sendProposeTeam(lobby.game, player);
            } else {
                sendUpdateTeam(lobby.game, player);
            }
        }
    }

    function sendProposeTeam(game, receiver) {
        io.sockets.to(receiver.socketId).emit('proposal:setup', game.getSetupProposalInformation(receiver.id));
    }

    function handleUpdateTeam(lobby, team) {
        lobby.game.updateProposal(team);
        const currentLeaderId = lobby.game.currentLeaderId;
        for (let player of lobby.playerCollection.getPlayers()) {
            if (player.id !== currentLeaderId) {
                sendUpdateTeam(lobby.game, player);
            }
        }
    }

    function sendUpdateTeam(game, receiver) {
        io.sockets.to(receiver.socketId).emit('proposal:view', game.getCurrentProposedTeamInformation());
    }

    function handleProposeTeam(lobby, selectedIds) {
        lobby.game.finalizeProposalTeam(selectedIds);
        const gamePlayers = lobby.playerCollection.getGamePlayers();
        for (let gamePlayer of gamePlayers) {
            sendVoteTeam(lobby.game, gamePlayer);
        }
    }

    function sendVoteTeam(game, receiver) {
        io.sockets.to(receiver.socketId).emit('proposal:vote', game.getSetupVoteInformation(receiver.id));
    }

    function handleToggleAffect(lobby, sourceUserId, affectInformation) {
        const sourcePlayer = lobby.playerCollection.getPlayerOfUserId(sourceUserId);
        lobby.game.toggleAffect(sourcePlayer.id, affectInformation.playerId);
        io.sockets.to(sourcePlayer.socketId).emit('proposal:vote', lobby.game.getSetupVoteInformation(sourcePlayer.id));
    }

    function handleVoteTeam(lobby, userId, vote) {
        const playerId = lobby.playerCollection.getPlayerIdOfUserId(userId);
        const game = lobby.game;
        const alreadyVoted = game.hasPlayerVoted(playerId);
        const voteFinished = game.setProposalVote(playerId, vote);

        if (voteFinished) {
            for (let gamePlayer of lobby.playerCollection.getGamePlayers()) {
                sendVoteResult(game, gamePlayer);
            }
            
            if (game.phase !== OnlineGame.PHASE_VOTE_REACT) {
                sendMissionResultsInformation(game, lobby.code);
                
                if (game.phase === Game.PHASE_REDEMPTION) {
                    startConductRedemption(lobby);
                } else if (game.isGameOver()) {
                    handleFinishGame(lobby);
                } else {
                    sendReact(lobby.playerCollection.getSocketIdOfPlayerId(0));
                }
            } else {
                sendReact(lobby.playerCollection.getSocketIdOfPlayerId(0));
            }
        } else if (!alreadyVoted) {
            for (let gamePlayer of lobby.playerCollection.getGamePlayers()) {
                sendVoteTeam(game, gamePlayer);
            }
        }
    }

    function sendVoteResult(game, receiver) {
        const proposalResultInformation = game.getProposalResultExtendedInformation(receiver.id);
        if (proposalResultInformation) {
            io.sockets.to(receiver.socketId).emit('proposal:result', proposalResultInformation);
        }
    }

    function sendReact(receiver) {
        io.sockets.to(receiver).emit('react');
    }

    function handleAdvanceMission(lobby) {
        lobby.game.advance();
        if (lobby.game.phase === OnlineGame.PHASE_PROPOSE) {
            handleStartProposal(lobby);
        } else {
            handleStartConductMission(lobby);
        }
    }

    function handleStartConductMission(lobby) {
        const gamePlayers = lobby.playerCollection.getGamePlayers();
        for (let gamePlayer of gamePlayers) {
            sendConductMissionToPlayer(lobby, gamePlayer);
        }
    }

    function sendConductMissionToPlayer(lobby, player) {
        sendConductMission(lobby.getConductMissionInformation(player.id), player.socketId);
    }

    function sendConductMission(conductMissionInformation, receiver) {
        if (conductMissionInformation != null) {
            io.sockets.to(receiver).emit('mission:conduct', conductMissionInformation);
        }
        //io.sockets.to(receiver.socketId).emit('mission:conduct', game.getConductMissionInformation(receiver.id));
    }

    

    

    function startConductRedemption(lobby) {
        lobby.startConductAssassination(handleResponseCallback(sendConductRedemption));
    }

    

    io.on('connection', socket => {
        const code = socket.handshake.query.code;
        const userId = socket.handshake.query.userId;

        const lobby = lobbyManager.get(code);
        if (lobby) {
            if (!lobby.gameSocketServer) {
                lobby.attachGameSocketServer(io);
            }

            lobby.handlePlayerConnect(socket, userId);

            socket.on('lobby:close', () => {
                lobby.updateLastUpdatedTime();
                closeLobby();
            });
        } else {
            console.log("Game not found!");
            socket.disconnect()
        }
    });
};

module.exports = attachServerSocket;
