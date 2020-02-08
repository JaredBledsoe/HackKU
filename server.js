const express = require("express");
const SocketServer = require("ws").Server;
const path = require("path");
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, "client/index.html");
const Game = require("./game");
const Player = require("./player");

function Server() {
	this.httpServer;
	this.websocketServer;

	// Can have multiple game instances running concurrently
	this.games = [];
	this.init();
};

Server.prototype.init = function init() {
	this.httpServer = express().use(express.static("client"), (req, res) =>
		res.sendFile(INDEX)
	);

	this.httpServer = express();
	this.httpServer.use(express.static("client"));
};

Server.prototype.initWebsocketMessage = function initWebsocketMessage() {
	function createGame() {
		const game = new Game(Math.random());
		game.start();
		this.games.push(game);
		return game;
	}

	function getGameWithFreeSlot() {
		return this.games.find(game => game.hasFreeSlot());
	}

	function close(ws) {
		this.games.forEach(game => game.removePlayerByWS(ws));

		// Find game instance with 0 players and kill it
		for (var i = 0; i < this.games.length; i++) {
			if (this.games.players.length === 0) {
				this.games.splice(i, 1);
			}
		}
	}

	function handleMessage(ws, e) {
		try {
			var message = JSON.parse(e);
			if (message && message.hasOwnProperty("gameId")) {

				//Client just joined
				if (message.type == 'init' && !ws.hasOwnProperty('playerAdded')) {
					ws.playerAdded = true;

					let activeGame = this.findOpenGame();
					let createNewGame;
					// if no game exists or all games are full, create a new one 
					if (this.games.length <= 0 || !activeGame) {
						this.games.push(new Game());

						this.games[this.games.length - 1].clients.push(new Player(ws));
					}
				}

				var gameId = message.gameId;
				var game = this.games.find(game => game.id === gameId);

				if (game && game.isPlayer(ws)) {
					game.processMessage(message);
				}
			}
		} catch (e) {
			console.log(e);
		}
	}


	this.websocketServer.on("connection", ws => {
		ws.on("close", close.bind(this, ws));
		ws.on("error", close.bind(this, ws));

		ws.on("message", handleMessage.bind(this, ws));
	});
};

Server.prototype.start = function start(port = PORT) {
	this.httpServer = this.httpServer.listen(port, () =>
		console.log(`Listening on ${port}`)
	);
	this.websocketServer = new SocketServer({
		server: this.httpServer
	});
	this.initWebsocketMessage();
};

Server.prototype.findOpenGame = function() {
	for (let i = 0; i < this.games.length; i++) {
		if (this.games[i].clients.length < 4) {
			return i;
		}
	}

	return false;
};

module.exports = exports = Server;