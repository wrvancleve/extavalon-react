const lobbyManager = require('./models/lobbyManager');

function attachServerSocket(httpServer) {
    const io = require('socket.io')(httpServer, {
        path: '/api/socket.io',
        cors: {
            origin: "http://localhost:80",
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
                closeLobby(code);
            });
        } else {
            socket.disconnect()
        }
    });
};

module.exports = attachServerSocket;
