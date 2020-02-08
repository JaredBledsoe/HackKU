const Player = require("./player");

function Game(id) {
	this.id = id;

	this.clients = [];
	this.start();
}

Game.prototype.start = function() {
	// Update each client and other important stuff
	function gameLoop() {
		this.broadcast();
	}

	setInterval(gameLoop.bind(this), 50);
};

Game.prototype.broadcast = function() {
	// Send message to all connected clients
	for (let i = 0; i < this.clients.length; i++) {
		this.clients[i].ws.send('TEST');
	}
}

Game.prototype.processMessage = function(e) {
	try {
		var message = JSON.parse(e);
		console.log(message);

		if (message.type === 'init') {
			this.clients.push(new Player());
		}
	} catch (e) {

	}
};

module.exports = exports = Game;