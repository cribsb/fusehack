var Client = IgeClass.extend({
	classId: 'Client',
	init: function () {
		var self = this,
				gameTexture = [];
		ige.input.debug(true);
		
		ige.addComponent(IgeEditorComponent);

		// Load our textures
		self.obj = [];

		// Load the fairy texture and store it in the gameTexture object
		self.gameTexture = {};
		var fair = self.gameTexture.fairy = new IgeTexture('./assets/textures/sprites/fairy.png');

		// Load the tilemaps
		gameTexture[0] = new IgeCellSheet('./assets/textures/tiles/tilea5b.png', 8, 16);

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

					// Create the scene
					self.scene1 = new IgeScene2d()
						.id('scene1')
						.translateTo(0, 0, 0)
						//.drawBounds(true)
						.mount(ige.$('baseScene'));

					// Create the main viewport
					self.vp2 = new IgeViewport()
						.id('vp2')
						.autoSize(true)
						.scene(self.scene1)
						//.drawBounds(true)
						.mount(ige);

					self.obj[0] = new IgeEntity()
						.translateTo(10, 100, 0)
						.texture(fair)
						.mount(ige.$('baseScene'));

					// Create the texture maps
					self.textureMap1 = new IgeTextureMap()
						.depth(0)
						.tileWidth(32)
						.tileHeight(32)
						.gridSize(24, 15)
						//.drawGrid(true)
						.drawMouse(true)
						.translateTo(-384, -240, 0)
						.drawBounds(true)
						.autoSection(8)
						//.drawSectionBounds(true)
						.mount(self.scene1);

					self.textureMap1.addTexture(gameTexture[0]);

					// Paint some awesome pavement tiles randomly selecting
					// the "un-cracked" or "cracked" cell of gameTexture[2]
					// which are cells 22 and 86 respectively
					var textureCell, x, y, texIndex;
					for (x = 0; x < 24; x++) {
						for (y = 0; y < 15; y++) {
							textureCell = (Math.random() * 4) < 2 ? 22 : 86;
							self.textureMap1.paintTile(x, y, 0, textureCell);
						}
					}

					console.log(self.textureMap1.map.mapDataString());
				}
			});
		});
	},

	tick: function() {

	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }