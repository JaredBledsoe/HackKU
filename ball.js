function Ball() {
	this.x = 250;
	this.y = 250;
	this.velX = -Math.floor(Math.random() * 8 + 5);
	this.velY = -Math.floor(Math.random() * 8 + 5);
	this.r = 10;
}

Ball.prototype.update = function(game) {
	this.x += this.velX;
	this.y += this.velY;

	this.velX *= 1.001;
	this.velY *= 1.001;

	for (let i = 0; i < game.clients.length; i++) {
		if (i === 0) {
			if (this.x + this.r > game.clients[i].x && this.x - this.r < game.clients[i].x + game.clients[i].w && this.y - this.r < game.clients[i].y + game.clients[i].h) {
				this.y = game.clients[i].y + game.clients[i].h + this.r;
				this.velY = -this.velY;
				console.log('a');
			}
		} else if (i === 1) {
			if (this.y + this.r > game.clients[i].y && this.y - this.r < game.clients[i].y + game.clients[i].h && this.x + this.r > game.clients[i].x) {
				this.x = game.clients[i].x - this.r;
				this.velX = -this.velX;
				console.log('b');
			}
		} else if (i === 2) {
			if (this.x + this.r > game.clients[i].x && this.x - this.r < game.clients[i].x + game.clients[i].w && this.y + this.r > game.clients[i].y) {
				this.y = game.clients[i].y - this.r;
				this.velY = -this.velY;
				console.log('c');
			}
		} else if (i === 3) {
			if (this.y + this.r > game.clients[i].y && this.y - this.r < game.clients[i].y + game.clients[i].h && this.x - this.r < game.clients[i].x + game.clients[i].w) {
				this.x = game.clients[i].x + game.clients[i].w + this.r;
				this.velX = -this.velX;
			}
		}
	}


	if (this.x - this.r < 0) {
		this.x = this.r + 10;
		this.velX = -this.velX;
	} else if (this.x + this.r > 500) {
		this.x = 500 - this.r;
		this.velX = -this.velX;
	}

	if (this.y - this.r < 0) {
		this.y = this.r + 10;
		this.velY = -this.velY;
	} else if (this.y + this.r > 500) {
		this.y = 500 - this.r;
		this.velY = -this.velY;
	}
}


module.exports = exports = Ball;