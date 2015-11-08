var config = {
	include: [
		{name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
		{name: 'Character', path: './gameClasses/Character'},
		{name: 'PlayerComponent', path: './gameClasses/PlayerComponent'},
		{name: 'tiled', path: './assets/lavaland'},
		{name: 'map', path: './assets/anothermap'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }