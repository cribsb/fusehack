var Server = IgeClass.extend({
	classId: 'Server',
	Server: true,

	init: function (options) {
		var self = this;

		// Add the networking component
		ige.addComponent(IgeNetIoComponent)
			// Start the network server
			.network.start(2000, function () {
				// Networking has started so start the game engine
				ige.start(function (success) {
					// Check if the engine started successfully
					if (success) {
						ige.network.on('connect', function () {});
						ige.network.on('disconnect', function () {});

						// Add the network stream component
						ige.network.addComponent(IgeStreamComponent)
							.stream.sendInterval(30) // Send a stream update once every 30 milliseconds
							.stream.start(); // Start the stream

						// Accept incoming network connections
						ige.network.acceptConnections(true);

						// Load the base scene data
						ige.addGraph('IgeBaseScene');

						var baseScene = ige.$('baseScene'),
							menuScene;

						menuScene = new IgeScene2d()
							.id('menuScene')
							.ignoreCamera(true)
							.mount('baseScene');

						ige.ui.style('.mainMenuStyle', {
							'width': '90%',
							'height': '75%',
							'borderColor': '#FF4400',
							'bporderWidth': '2',
							'borderRadius' : '10',
							'backgroundColor': '#333333'
						});

						new IgeUiElement()
							.id('menu1')
							.styleClass('mainMenuStyle')
							.mount(menuScene);
					}
				});
			});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Server; }