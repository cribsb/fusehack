function loadScript(url, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

var Client = IgeClass.extend({
	classId: 'Client',

	init: function () {
		//ige.timeScale(0.1);
		ige.showStats(1);
		ige.globalSmoothing(true);

		// Load our textures
		var self = this;

		// Enable networking
		ige.addComponent(IgeNetIoComponent);

		// Implement our game methods
		this.implement(ClientNetworkEvents);

		// Create the HTML canvas
		ige.createFrontBuffer(true);

		// Load the textures we want to use
		this.textures = {
			grassSheet: new IgeCellSheet('./assets/textures/tiles/grassSheet.png', 4, 1)
		};

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
					ige.network.start('http://37.34.61.80:3000', function () {
						// Setup the network command listeners
						ige.network.define('playerEntity', self._onPlayerEntity); // Defined in ./gameClasses/ClientNetworkEvents.js

						// Setup the network stream handler
						ige.network.addComponent(IgeStreamComponent)
							.stream.renderLatency(80) // Render the simulation 160 milliseconds in the past
							// Create a listener that will fire whenever an entity
							// is created because of the incoming stream data
							.stream.on('entityCreated', function (entity) {
								self.log('Stream entity created with ID: ' + entity.id());

							});

						self.mainScene = new IgeScene2d()
							.id('mainScene');

						self.backgroundScene = new IgeScene2d()
							.id('backgroundScene')
							.layer(0)
							.mount(self.mainScene);
						
						self.foregroundScene = new IgeScene2d()
							.id('foregroundScene')
							.layer(1)
							.mount(self.mainScene);

						self.uiScene = new IgeScene2d()
							.id('uiScene')
							.layer(2)
							.ignoreCamera(true)
							.mount(self.mainScene);

						// Create the main viewport and set the scene
						// it will "look" at as the new scene1 we just
						// created above
						self.vp1 = new IgeViewport()
							.id('vp1')
							.autoSize(true)
							.scene(self.mainScene)
							.drawBounds(false)
							.mount(ige);
						

						// Ask the server to create an entity for us
						ige.network.send('playerEntity');

						// We don't create any entities here because in this example the entities
						// are created server-side and then streamed to the clients. If an entity
						// is streamed to a client and the client doesn't have the entity in
						// memory, the entity is automatically created. Woohoo!

						// Load the Tiled map data and handle the return data
						ige.addComponent(IgeTiledComponent)
							.tiled.loadJson(tiled /* you can also use a url: 'maps/example.js'*/, function (layerArray, layersById) {
								// The return data from the tiled component are two arguments,
								// the first is an array of IgeTextureMap instances, each one
								// representing one of the Tiled map's layers. The ID of each
								// instance is the same as the name assigned to the Tiled
								// layer it represents. The second argument contains the same
								// instances but each instance is stored in a property that is
								// named after the layer it represents so instead of having to
								// loop the array you can simply pick the layer you want via
								// the name assigned to it like layersById['layer name']

								// We can add all our layers to our main scene by looping the
								// array or we can pick a particular layer via the layersById
								// object. Let's give an example:
								var i;

								for (i = 0; i < layerArray.length; i++) {
									// Before we mount the layer we will adjust the size of
									// the layer's tiles because Tiled calculates tile width
									// based on the line from the left-most point to the
									// right-most point of a tile whereas IGE calculates the
									// tile width as the length of one side of the tile square.
									layerArray[i]
										.tileWidth(32)
										.tileHeight(32)
										.autoSection(20)
										//.isometricMounts(false)
										.drawBounds(false)
										.drawBoundsData(false)
										.mount(self.backgroundScene);
								}
							});
					});
				}
			});
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }