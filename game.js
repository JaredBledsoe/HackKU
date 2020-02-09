const Player = require("./player");
const Ball = require("./ball");

function Game() {
	this.id = Math.random();

	this.clients = [];
	this.ball = new Ball();
	this.started = false;
	this.start();
}

Game.prototype.start = function() {
	// Update each client and other important stuff
	function gameLoop() {
		this.broadcast();
		this.ball.update(this);

		for (let i = 0; i < this.clients.length; i++) {
			this.clients[i].update();
		}
	}

	setInterval(gameLoop.bind(this), 50);
};

Game.prototype.broadcast = function() {
	try {
		var refinedClients = [];
		var aliveCount = 0;

		for (let i = 0; i < this.clients.length; i++) {
			if (!this.clients[i].dead) {
				aliveCount++;
			}

			refinedClients.push([this.clients[i].x, this.clients[i].y, this.clients[i].w, this.clients[i].h, this.clients[i].dead]);
		}

		if (aliveCount === 1 && this.started) {
			setTimeout(function() {
				for (let i = 0; i < this.clients.length; i++) {
					if (this.clients[i].ws && this.clients[i].ws.readyState) {

						this.clients[i].ws.send(JSON.stringify({
							type: "gameOver"
						}));
					}
				}
			}.bind(this), 2000);
		}

		// Send message to all connected clients
		for (let i = 0; i < this.clients.length; i++) {
			if (this.clients[i].ws && this.clients[i].ws.readyState) {
				this.clients[i].ws.send(JSON.stringify({
					type: "update",
					data: refinedClients,
					ball: this.ball
				}));
			}
		}
	} catch (e) {

	}
}

Game.prototype.processMessage = function(message, ws) {
	try {
		if (message.type === 'move') {
			for (let i = 0; i < this.clients.length; i++) {
				if (this.clients[i].id === message.id) {
					this.clients[i].dir = message.dir;
				}
			}
		}
	} catch (e) {

	}
};

Game.prototype.addPlayer = function(ws) {
	this.clients.push(new Player(ws, this.clients.length))

	this.clients[this.clients.length - 1].ws.send(JSON.stringify({
		type: "init",
		id: this.clients[this.clients.length - 1].id,
		gameId: this.id,
		side: this.clients.length - 1
	}));

	if (this.clients.length === 4) {
		setTimeout(function() {
			this.started = true;
		}.bind(this), 2000);
	}
};


Game.prototype.removePlayerByWS = function removePlayer(ws) {
	try {
		console.log('REMOVING PLAYER BY WS');
		for (let i = 0; i < this.clients.length; i++) {
			if (this.clients[i].ws === ws) {
				this.clients.splice(i, 1);
				return;
			}
		}
	} catch (e) {
		console.log(e);
	}
};

module.exports = exports = Game;