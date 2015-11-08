var config = {
	include: [
		{name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
		{name: 'Character', path: './gameClasses/Character'},
		{name: 'Character2', path: './gameClasses/Character2'},
		{name: 'PlayerComponent', path: './gameClasses/PlayerComponent'},
		{name: 'tiled', path: './assets/lavaland'},
		{name: 'health', path: './assets/textures/smartTextures/health'}
		//{name: 'map', path: './assets/anothermap'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }