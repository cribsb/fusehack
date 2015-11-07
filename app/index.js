var Game = IgeClass.extend({
	classId: 'Game',

	init: function (App, options) {
		console.log("1");
		// Create the engine
		ige = new IgeEngine();
		console.log("2");
		if (ige.isClient) {
			ige.client = new App();
		}
		console.log("3");
		if (ige.isServer) {
			ige.server = new App(options);
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Game; } else { var game = new Game(Client); }