function Ball() {
	this.x = 250;
	this.y = 250;
	this.r = 10;
	this.velX = -Math.floor(Math.random() * 8 + 5);
	this.velY = -Math.floor(Math.random() * 8 + 5);
}

Ball.prototype.update = function(game) {
	try {
		if (game.started) {
			this.x += this.velX;
			this.y += this.velY;

			this.velX *= 1.001;
			this.velY *= 1.001;

			for (let i = 0; i < game.clients.length; i++) {
				if (i === 0) {
					if (this.x + this.r > game.clients[i].x && this.x - this.r < game.clients[i].x + game.clients[i].w && this.y - this.r < game.clients[i].y + game.clients[i].h) {
						this.y = game.clients[i].y + game.clients[i].h + this.r;
						this.velY = -this.velY;
					}
				} else if (i === 1) {
					if (this.y + this.r > game.clients[i].y && this.y - this.r < game.clients[i].y + game.clients[i].h && this.x + this.r > game.clients[i].x) {
						this.x = game.clients[i].x - this.r;
						this.velX = -this.velX;
					}
				} else if (i === 2) {
					if (this.x + this.r > game.clients[i].x && this.x - this.r < game.clients[i].x + game.clients[i].w && this.y + this.r > game.clients[i].y) {
						this.y = game.clients[i].y - this.r;
						this.velY = -this.velY;
					}
				} else if (i === 3) {
					if (this.y + this.r > game.clients[i].y && this.y - this.r < game.clients[i].y + game.clients[i].h && this.x - this.r < game.clients[i].x + game.clients[i].w) {
						this.x = game.clients[i].x + game.clients[i].w + this.r;
						this.velX = -this.velX;
					}
				}
			}

			if (this.x - this.r < 0) {
				if (!game.clients[3].dead) {
					game.clients[3].dead = true;
					this.x = 250;
					this.y = 250;
					this.velX = 0;
					this.velY = 0;
					this.r = 10;

					setTimeout(function() {
						this.velX = -Math.floor(Math.random() * 8 + 5);
						this.velY = -Math.floor(Math.random() * 8 + 5);
					}.bind(this), 2000);
				} else {
					this.velX = -this.velX;
				}
			} else if (this.x + this.r > 500) {
				if (!game.clients[1].dead) {
					game.clients[1].dead = true;
					this.x = 250;
					this.y = 250;
					this.velX = 0;
					this.velY = 0;
					this.r = 10;

					setTimeout(function() {
						this.velX = -Math.floor(Math.random() * 8 + 5);
						this.velY = -Math.floor(Math.random() * 8 + 5);
					}.bind(this), 2000);
				} else {
					this.velX = -this.velX;
				}

			}

			if (this.y - this.r < 0) {
				if (!game.clients[0].dead) {
					game.clients[0].dead = true;
					this.x = 250;
					this.y = 250;
					this.velX = 0;
					this.velY = 0;
					this.r = 10;

					setTimeout(function() {
						this.velX = -Math.floor(Math.random() * 8 + 5);
						this.velY = -Math.floor(Math.random() * 8 + 5);
					}.bind(this), 2000);
				} else {
					this.velY = -this.velY;
				}

			} else if (this.y + this.r > 500) {
				if (!game.clients[2].dead) {
					game.clients[2].dead = true;
					this.x = 250;
					this.y = 250;
					this.velX = 0;
					this.velY = 0;
					this.r = 10;

					setTimeout(function() {
						this.velX = -Math.floor(Math.random() * 8 + 5);
						this.velY = -Math.floor(Math.random() * 8 + 5);
					}.bind(this), 2000);
				} else {
					this.velY = -this.velY;
				}
			}
		}
	} catch (e) {

	}
}


module.exports = exports = Ball;