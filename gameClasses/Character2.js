// Define our player character classes
var Character2 = IgeEntityBox2d.extend({
	classId: 'Character2',

	init1: function () {
		var self = this;

		this.strength = 30;
		this.data('health', 100);
		this.health = 100;
		this.hit = 0;
		this.klik = false;
		this.clicked = false;

		// Set the co-ordinate system as isometric
		this.isometric(false);
		
		this.mouseDown(function (event, control) {
			this.klik = true;
		});

		this.mouseUp(function (event, control){
			this.klik = false;
			this.clicked = false;
		});

		if (ige.isServer) {
			this.addComponent(IgeVelocityComponent);
		}
		
		if (ige.isClient) {
			// Setup the entity
			self.addComponent(IgeAnimationComponent)
				.depth(1);
			
			var healthTex = new IgeTexture('./assets/textures/smartTextures/health.js');

			

			// Load the character texture file
			this._characterTexture = new IgeCellSheet('./assets/textures/sprites/vx_chara02_c.png', 12, 8);
	
			// Wait for the texture to load
			this._characterTexture.on('loaded', function () {
				// Setting up the health bar
			    var healthBarWidth = 32;
			    self.healthBar = new IgeEntity()
			      .texture(healthTex)
			      .id(this.id() + '_healthBar')
			      .width(healthBarWidth)
			      .height(11)
			      .translateTo(-(healthBarWidth / 2), -40, 1)
			      .drawBounds(true)
			      .drawBoundsData(true)
			      .originTo(0.2, 0.2, 0.2)
			      .mount(self);

				self.texture(self._characterTexture)
					.dimensionsFromCell();
				
				self.setType(0);
			}, false, true);
		}
		
		this._lastTranslate = this._translate.clone();
		IgeEntityBox2d.prototype.init.call(this);
	},

	/**
	 * Sets the type of character which determines the character's
	 * animation sequences and appearance.
	 * @param {Number} type From 0 to 7, determines the character's
	 * appearance.
	 * @return {*}
	 */
	setType: function (type) {
		switch (type) {
			case 0:
				this.animation.define('walkDown', [1, 2, 3, 2], 8, -1)
					.animation.define('walkLeft', [13, 14, 15, 14], 8, -1)
					.animation.define('walkRight', [25, 26, 27, 26], 8, -1)
					.animation.define('walkUp', [37, 38, 39, 38], 8, -1)
					.cell(1);

				this._restCell = 1;
				break;

			case 1:
				this.animation.define('walkDown', [4, 5, 6, 5], 8, -1)
					.animation.define('walkLeft', [16, 17, 18, 17], 8, -1)
					.animation.define('walkRight', [28, 29, 30, 29], 8, -1)
					.animation.define('walkUp', [40, 41, 42, 41], 8, -1)
					.cell(4);

				this._restCell = 4;
				break;

			case 2:
				this.animation.define('walkDown', [7, 8, 9, 8], 8, -1)
					.animation.define('walkLeft', [19, 20, 21, 20], 8, -1)
					.animation.define('walkRight', [31, 32, 33, 32], 8, -1)
					.animation.define('walkUp', [43, 44, 45, 44], 8, -1)
					.cell(7);

				this._restCell = 7;
				break;

			case 3:
				this.animation.define('walkDown', [10, 11, 12, 11], 8, -1)
					.animation.define('walkLeft', [22, 23, 24, 23], 8, -1)
					.animation.define('walkRight', [34, 35, 36, 35], 8, -1)
					.animation.define('walkUp', [46, 47, 48, 47], 8, -1)
					.cell(10);

				this._restCell = 10;
				break;

			case 4:
				this.animation.define('walkDown', [49, 50, 51, 50], 8, -1)
					.animation.define('walkLeft', [61, 62, 63, 62], 8, -1)
					.animation.define('walkRight', [73, 74, 75, 74], 8, -1)
					.animation.define('walkUp', [85, 86, 87, 86], 8, -1)
					.cell(49);

				this._restCell = 49;
				break;

			case 5:
				this.animation.define('walkDown', [52, 53, 54, 53], 8, -1)
					.animation.define('walkLeft', [64, 65, 66, 65], 8, -1)
					.animation.define('walkRight', [76, 77, 78, 77], 8, -1)
					.animation.define('walkUp', [88, 89, 90, 89], 8, -1)
					.cell(52);

				this._restCell = 52;
				break;

			case 6:
				this.animation.define('walkDown', [55, 56, 57, 56], 8, -1)
					.animation.define('walkLeft', [67, 68, 69, 68], 8, -1)
					.animation.define('walkRight', [79, 80, 81, 80], 8, -1)
					.animation.define('walkUp', [91, 92, 93, 92], 8, -1)
					.cell(55);

				this._restCell = 55;
				break;

			case 7:
				this.animation.define('walkDown', [58, 59, 60, 59], 8, -1)
					.animation.define('walkLeft', [70, 71, 72, 71], 8, -1)
					.animation.define('walkRight', [82, 83, 84, 83], 8, -1)
					.animation.define('walkUp', [94, 95, 96, 95], 8, -1)
					.cell(58);

				this._restCell = 58;
				break;
		}

		this._characterType = type;

		return this;
	},

	damagePlayer1: function(damage){
		this.health -= damage;
		this.data('health', this.health);
		console.log(this.data('health'));
		ige.network.send('damageP1', damage);
		console.log('rage');
	},

	update1: function (ctx, tickDelta) {

		console.log('nog meer rage');

		var mousePosAbs = this.mousePosAbsolute();
		if (mousePosAbs.x < 100 && mousePosAbs.x > -100 && mousePosAbs.y < 100 && mousePosAbs.y > -100 ){
			var muisInRange = true;
		} else {
			muisInRange = false;
		};

		if (muisInRange && this.klik && !this.clicked){
			hit = Math.random() * this.strength;
			hit = Math.round(hit);
			this.damagePlayer1(hit);
			console.log("you've dealth " + hit + " damage!");
			this.clicked = true;
		};

		if (ige.isClient) {
			// Set the current animation based on direction
			var self = this,
				oldX = this._lastTranslate.x,
				oldY = this._lastTranslate.y * 2,
				currX = this.translate().x(),
				currY = this.translate().y() * 2,
				distX = currX - oldX,
				distY = currY - oldY,
				distance = Math.distance(
					oldX,
					oldY,
					currX,
					currY
				),
				speed = 0.1,
				time = (distance / speed);
			
			this._lastTranslate = this._translate.clone();
	
			if (distX == 0 && distY == 0) {
				this.animation.stop();
			} else {
				// Set the animation based on direction
				if (Math.abs(distX) > Math.abs(distY)) {
					// Moving horizontal
					if (distX < 0) {
						// Moving left
						this.animation.select('walkLeft');
					} else {
						// Moving right
						this.animation.select('walkRight');
					}
				} else {
					// Moving vertical
					if (distY < 0) {
						if (distX < 0) {
							// Moving up-left
							this.animation.select('walkUp');
						} else {
							// Moving up
							this.animation.select('walkRight');
						}
					} else {
						if (distX > 0) {
							// Moving down-right
							this.animation.select('walkDown');					
						} else {
							// Moving down
							this.animation.select('walkLeft');
						}
					}
				}
			}
			
			// Set the depth to the y co-ordinate which basically
			// makes the entity appear further in the foreground
			// the closer they become to the bottom of the screen
			this.depth(this._translate.y);
		}
		
		IgeEntityBox2d.prototype.update.call(this, ctx, tickDelta);
	},

	destroy1: function () {
		// Destroy the texture object
		if (this._characterTexture) {
			this._characterTexture.destroy();
		}

		// Call the super class
		IgeEntityBox2d.prototype.destroy.call(this);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Character; }