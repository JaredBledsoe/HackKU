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

function initGame() {
	// Tell server ready to start playing
	ws.send(
		JSON.stringify({
			type: "init",
			gameId: currentGameId
		})
	);
	console.log('client side game started');
}

var paddle = {
	x: 0,
	y: 0,
	w: 100,
	h: 50
}

document.addEventListener('keydown', function(e) {
	console.log(e.keyCode);
});