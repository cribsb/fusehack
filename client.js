var Client = IgeClass.extend({
	classId: 'Client',
	init: function () {
		

	ige.on('texturesLoaded', function () {
			// Ask the engine to start
		ige.start(function (success) {
				// Check if the engine started successfully
				if (success) {
					// Start the networking (you can do this elsewhere if it
					// makes sense to connect to the server later on rather
					// than before the scene etc are created... maybe you want
					// a splash screen or a menu first? Then connect after you've
					// got a username or something?
					ige.network.start('http://fuseh.herokuapp.com', function () {
						// Setup the network stream handler
						ige.network.addComponent(IgeStreamComponent)
							.stream.renderLatency(80) // Render the simulation 160 milliseconds in the past
							// Create a listener that will fire whenever an entity
							// is created because of the incoming stream data
							.stream.on('entityCreated', function (entity) {
								self.log('Stream entity created with ID: ' + entity.id());

							});
						
						// Load the base scene data
						ige.addGraph('IgeBaseScene');

						var baseScene = ige.$('baseScene'),
							menuScene;

						menuScene = new IgeScene2d()
							.id('menuScene')
							.ignoreCamera(true)
							.mount(baseScene);

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
					});
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