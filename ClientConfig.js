var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */
		'./assets/lavaland.js',
		//'./assets/anothermap.js',
		'./assets/textures/smartTextures/health.js',
		'./gameClasses/ClientNetworkEvents.js',
		'./gameClasses/Character.js',
		'./gameClasses/Character2.js',
		'./gameClasses/PlayerComponent.js',
		/* Standard game scripts */
		'./client.js',
		'./index.js',
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }