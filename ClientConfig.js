var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */
		'./assets/maps/example.js',
		'./gameClasses/ClientNetworkEvents.js',
		'./gameClasses/Character.js',
		'./gameClasses/PlayerComponent.js',
		/* Standard game scripts */
		'./client.js',
		'./index.js',
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }