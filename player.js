function Client(ws, side) {
	this.id = Math.random();
	if (ws) this.ws = ws;
	this.side = side;
	this.x = side === 0 ? 200 : side === 1 ? 490 : side === 2 ? 200 : 0;
	this.y = side === 0 ? 0 : side === 1 ? 200 : side === 2 ? 490 : 200;
	this.w = side === 0 ? 100 : side === 2 ? 100 : 10;
	this.h = side === 0 ? 10 : side === 2 ? 10 : 100;
	this.velX = 0;
	this.velY = 0;
	this.dir = [0, 0];
	this.dead = false;
};

Client.prototype.update = function() {
	this.velX *= .75;
	this.velY *= .75;

	if (this.dir[0]) {
		if (this.side === 0) {
			this.velX += 5;
		} else if (this.side === 1) {
			this.velY += 5;
		} else if (this.side === 2) {
			this.velX -= 5;
		} else {
			this.velY -= 5;
		}
	} else if (this.dir[1]) {
		if (this.side === 0) {
			this.velX -= 5;
		} else if (this.side === 1) {
			this.velY -= 5;
		} else if (this.side === 2) {
			this.velX += 5;
		} else {
			this.velY += 5;
		}
	}

	this.x += this.velX;
	this.y += this.velY;

	// Top or bottom
	if (this.side === 0 || this.side === 2) {
		if (this.x < 0) {
			this.x = 0;
			this.velX = -this.velX;
		} else if (this.x + this.w > 500) {
			this.x = 500 - this.w;
			this.velX = -this.velX;
		}
	} else if (this.side === 1 || this.side === 3) {
		if (this.y < 0) {
			this.y = 0;
			this.velY = -this.velY;
		} else if (this.y + this.h > 500) {
			this.y = 500 - this.h;
			this.velY = -this.velY;
		}
	}
};

module.exports = exports = Client;