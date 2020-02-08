function createWsConnection() {
	HOST = location.origin.replace(/^http/, "ws");
	ws = new WebSocket(HOST);
}
createWsConnection();

ws.onclose = function() {
	createWsConnection();
}

var initReady = setInterval(function() {
	if (ws.readyState == 1) {
		clearInterval(initReady);

		initGame();
	} else if (ws.readyState >= 2) {
		createWsConnection();
	}
}, 100);

var currentGameId = null;