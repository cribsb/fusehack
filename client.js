var Client = IgeClass.extend({
	classId: 'Client',
	init: function () {
		

		ige.network.start('http://fuseh.herokuapp.com', function () {
						ige.network.addComponent(IgeStreamComponent)
							.stream.renderLatency(60) // Render the simulation 160 milliseconds in the past
							// Create a listener that will fire whenever an entity
							// is created because of the incoming stream data
							.stream.on('entityCreated', function (entity) {
								console.log('Stream entity created with ID: ' + entity.id());
							});


		var self = this,
				gameTexture = [];
		ige.input.debug(true);
		
		// Setup the control system
		ige.input.mapAction('walkLeft', ige.input.key.left);
		ige.input.mapAction('walkRight', ige.input.key.right);
		ige.input.mapAction('walkUp', ige.input.key.up);
		ige.input.mapAction('walkDown', ige.input.key.down);

		ige.addComponent(IgeEditorComponent);

		// Load our textures
		self.obj = [];

		// Load the fairy texture and store it in the gameTexture object
		self.gameTexture = {};
		var fair = self.gameTexture.fairy = new IgeTexture('./assets/textures/sprites/fairy.png');

		// Add the playerComponent behaviour to the entity
		//this.fair.addBehaviour('playerComponent_behaviour', this._behaviour);

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

					self.obj[0] = new IgeEntity()
						.translateTo(-384 + 16, -240 + 16, 0)
						.texture(fair)
						.width(32)
						.height(32)
						.mount(ige.$('baseScene'));

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

	},

	/**
	 * Tweens the character to the specified world co-ordinates.
	 * @param x
	 * @param y
	 * @return {*}
	 */
	walkTo: function (x, y) {
		var self = this,
			distX = x - this.translate().x(),
			distY = y - this.translate().y(),
			distance = Math.distance(
				this.translate().x(),
				this.translate().y(),
				x,
				y
			),
			speed = 0.1,
			time = (distance / speed);

		// Set the animation based on direction
		if (Math.abs(distX) > Math.abs(distY)) {
			// Moving horizontal
			if (distX < 0) {
				// Moving left
				//this.animation.select('walkLeft');
			} else {
				// Moving right
				//this.animation.select('walkRight');
			}
		} else {
			// Moving vertical
			if (distY < 0) {
				// Moving up
				//this.animation.select('walkUp');
			} else {
				// Moving down
				//this.animation.select('walkDown');
			}
		}

		// Start tweening the little person to their destination
		this._translate.tween()
			.stopAll()
			.properties({x: x, y: y})
			.duration(time)
			.afterTween(function () {
				self.animation.stop();
				// And you could make him reset back
				// to his original animation frame with:
				//self.cell(10);
			})
			.start();

		return this;
	},

	_behaviour: function (ctx) {
		var vel = 6,
			xVel, yVel,
			direction = '',
			iso = (this._parent && this._parent.isometricMounts() === true);

		if (ige.input.actionState('walkUp')) {
			direction += 'N';
		}

		if (ige.input.actionState('walkDown')) {
			direction += 'S';
		}

		if (ige.input.actionState('walkLeft')) {
			direction += 'W';
		}

		if (ige.input.actionState('walkRight')) {
			direction += 'E';
		}

		switch (direction) {
			case 'N':
				if (iso) {
					vel /= 1.4;
					xVel = -vel;
					yVel = -vel;
				} else {
					xVel = 0;
					yVel = -vel;
				}
				this.imageEntity.animation.select('walkUp');
				break;

			case 'S':
				if (iso) {
					vel /= 1.4;
					xVel = vel;
					yVel = vel;
				} else {
					xVel = 0;
					yVel = vel;
				}
				this._box2dBody.SetLinearVelocity(new IgePoint3d(0, vel, 0));
				this._box2dBody.SetAwake(true);
				this.imageEntity.animation.select('walkDown');
				break;

			case 'E':
				if (iso) {
					vel /= 2;
					xVel = vel;
					yVel = -vel;
				} else {
					xVel = vel;
					yVel = 0;
				}
				this._box2dBody.SetLinearVelocity(new IgePoint3d(vel, 0, 0));
				this._box2dBody.SetAwake(true);
				this.imageEntity.animation.select('walkRight');
				break;

			case 'W':
				if (iso) {
					vel /= 2;
					xVel = -vel;
					yVel = vel;
				} else {
					xVel = -vel;
					yVel = 0;
				}
				this._box2dBody.SetLinearVelocity(new IgePoint3d(-vel, 0, 0));
				this._box2dBody.SetAwake(true);
				this.imageEntity.animation.select('walkLeft');
				break;

			case 'NE':
				if (iso) {
					xVel = 0;
					yVel = -vel;
				} else {
					xVel = vel;
					yVel = -vel;
				}
				this._box2dBody.SetLinearVelocity(new IgePoint3d(vel, -vel, 0));
				this._box2dBody.SetAwake(true);
				this.imageEntity.animation.select('walkRight');
				break;

			case 'NW':
				if (iso) {
					xVel = -vel;
					yVel = 0;
				} else {
					xVel = -vel;
					yVel = -vel;
				}
				this._box2dBody.SetLinearVelocity(new IgePoint3d(-vel, -vel, 0));
				this._box2dBody.SetAwake(true);
				this.imageEntity.animation.select('walkLeft');
				break;

			case 'SE':
				if (iso) {
					xVel = vel;
					yVel = 0;
				} else {
					xVel = vel;
					yVel = vel;
				}
				this._box2dBody.SetLinearVelocity(new IgePoint3d(vel, vel, 0));
				this._box2dBody.SetAwake(true);
				this.imageEntity.animation.select('walkRight');
				break;

			case 'SW':
				if (iso) {
					xVel = 0;
					yVel = vel;
				} else {
					xVel = -vel;
					yVel = vel;
				}
				this._box2dBody.SetLinearVelocity(new IgePoint3d(-vel, vel, 0));
				this._box2dBody.SetAwake(true);
				this.imageEntity.animation.select('walkLeft');
				break;

			default:
				this.imageEntity.animation.stop();
				break;
		}

		this._box2dBody.SetLinearVelocity(new IgePoint3d(xVel, yVel, 0));
		this._box2dBody.SetAwake(true);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }