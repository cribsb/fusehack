var ServerNetworkEvents = {
	/**
	 * Is called when the network tells us a new client has connected
	 * to the server. This is the point we can return true to reject
	 * the client connection if we wanted to.
	 * @param data The data object that contains any data sent from the client.
	 * @param clientId The client id of the client that sent the message.
	 * @private
	 */
	_onPlayerConnect: function (socket) {
		// Don't reject the client connection
		return false;
	},

	_onPlayerDisconnect: function (clientId) {
		if (ige.server.players[clientId]) {
			// Remove the player from the game
			ige.server.players[clientId].destroy();

			ige.server.numPlayers--;

			// Remove the reference to the player entity
			// so that we don't leak memory
			delete ige.server.players[clientId];
		}
	},

	_onDestroyPlayer: function(clientId) {
		
	},

	_onPlayerEntity: function (data, clientId) {
		ige.server.numPlayers = 1;
		if (!ige.server.players[clientId]) {
			ige.server.players[clientId] = new Character(clientId)
			.box2dBody({
						type: 'dynamic',
						linearDamping: 0.0,
						angularDamping: 0.1,
						allowSleep: true,
						bullet: false,
						gravitic: true,
						fixedRotation: false,
						fixtures: [{
							density: 1.0,
							friction: 0.5,
							restitution: 0.2,
							shape: {
								type: 'circle',
								data: {
									// The position of the fixture relative to the body
									x: 0,
									y: 0,
									radius: 16
								}
							}
						}]
					})
				.addComponent(PlayerComponent)
				.streamMode(1)
				.translateTo(128, 128, 0)
				.mount(ige.server.foregroundScene);

				console.log("p1 crea");
			// Tell the client to track their player entity
			ige.network.send('playerEntity', ige.server.players[clientId].id(), clientId);
		}
	
	},

	_onPlayerLeftDown: function (data, clientId) {
		ige.server.players[clientId].playerControl.controls.left = true;
	},

	_onPlayerLeftUp: function (data, clientId) {
		ige.server.players[clientId].playerControl.controls.left = false;
	},

	_onPlayerRightDown: function (data, clientId) {
		ige.server.players[clientId].playerControl.controls.right = true;
	},

	_onPlayerRightUp: function (data, clientId) {
		ige.server.players[clientId].playerControl.controls.right = false;
	},

	_onPlayerUpDown: function (data, clientId) {
		ige.server.players[clientId].playerControl.controls.up = true;
	},

	_onPlayerUpUp: function (data, clientId) {
		ige.server.players[clientId].playerControl.controls.up = false;
	},
	
	_onPlayerDownDown: function (data, clientId) {
		ige.server.players[clientId].playerControl.controls.down = true;
	},

	_onPlayerDownUp: function (data, clientId) {
		ige.server.players[clientId].playerControl.controls.down = false;
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }