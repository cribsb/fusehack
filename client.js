var Client = IgeClass.extend({
	classId: 'Client',
	init: function () {
		var self = this;
		ige.input.debug(true);
		
		ige.addComponent(IgeEditorComponent);

		// Load our textures
		self.obj = [];

		// Load the fairy texture and store it in the gameTexture object
		self.gameTexture = {};
		var fair = self.gameTexture.fairy = new IgeTexture('./assets/textures/sprites/fairy.png');

		// Load a smart texture
		self.gameTexture.simpleBox = new IgeTexture('./assets/textures/smartTextures/simpleBox.js');

		// Wait for our textures to load before continuing
		ige.on('texturesLoaded', function () {
			// Create the HTML canvas
			ige.createFrontBuffer(true);

			// Start the engine
			ige.start(function (success) {
				// Check if the engine started successfully
				if (success) {
					// Load the base scene data
					ige.addGraph('IgeBaseScene');

					self.obj[3] = new IgeEntity()
					.translateTo(0, -100, 0)
					.texture(fair)
					.mount(ige.$('baseScene'));
				}
			});
		});
	},

	tick: function() {

	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }