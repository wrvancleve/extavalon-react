function GameSocketServer(io, code) {
    this.io = io;
    this.code = code;
}

GameSocketServer.prototype.emit = function(eventName, eventData, receiver) {
    this.io.sockets.to(receiver).emit(eventName, eventData);
}

GameSocketServer.prototype.broadcast = function(eventName, eventData) {
    this.emit(eventName, eventData, this.code);
}

module.exports = GameSocketServer;