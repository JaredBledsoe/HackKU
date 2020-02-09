function createWsConnection() {
	HOST = location.origin.replace(/^http/, "ws");
	ws = new WebSocket(HOST);
}
createWsConnection();

ws.onclose = function() {
	createWsConnection();
}

var initReady = setInterval(function() {
	if (ws.readyState === 1) {
		clearInterval(initReady);

		initGame();
	} else if (ws.readyState >= 2) {
		createWsConnection();
	}
}, 100);

var currentGameId = null;
var canvas = document.querySelector('canvas');
canvas.width = 500;
canvas.height = 500;
var ctx = canvas.getContext('2d');
var paddlesToDraw = [];
var ball;

function initGame() {
	// Tell server ready to start playing
	ws.send(
		JSON.stringify({
			type: "init",
			gameId: currentGameId
		})
	);

	ws.onmessage = function(e) {
		var message = JSON.parse(e.data);
		if (message.type === 'init') {
			currentGameId = message.gameId;
			paddle.id = message.id;
			paddle.side = message.side;
			var rotateDeg = [180, 90, 0, 270][message.side];

			canvas.style.transform = "translate(-50%, -50%) rotate(" +
				rotateDeg + "deg)";

		} else if (message.type === 'update') {
			paddlesToDraw = message.data;
			ball = message.ball;
			drawGame();
		} else if (message.type === 'gameOver') {
			location.reload();
		}
	}
}

function emit(type) {
	ws.send(
		JSON.stringify({
			type: "move",
			dir: paddle.dir,
			id: paddle.id,
			gameId: currentGameId
		})
	);
}

var paddle = {
	dir: [0, 0],
	id: 0,
	side: 0
}

function drawGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";

	if (ball) {
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
		ctx.fill();
	}

	for (let i = 0; i < paddlesToDraw.length; i++) {
		if (!paddlesToDraw[i][4]) {
			ctx.fillStyle = "black";
			ctx.beginPath();

			if (i === paddle.side) {
				ctx.fillStyle = "green";
			}

			ctx.rect(paddlesToDraw[i][0], paddlesToDraw[i][1], paddlesToDraw[i][2], paddlesToDraw[i][3]);
			ctx.fill();
		}
	}
}

document.addEventListener('keydown', function(e) {
	if (e.keyCode === 37 || e.keyCode === 65) {
		paddle.dir[0] = 1;
		emit();
	} else if (e.keyCode === 39 || e.keyCode === 68) {
		paddle.dir[1] = 1;
		emit();
	}
});

document.addEventListener('keyup', function(e) {
	if (e.keyCode === 37 || e.keyCode === 65) {
		paddle.dir[0] = 0;
		emit();
	} else if (e.keyCode === 39 || e.keyCode === 68) {
		paddle.dir[1] = 0;
		emit();
	}
});