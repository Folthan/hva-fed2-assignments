var config = {
	sandbox: "SANDBOX",
	lineair: "LINEAIR",
	gpsAvailable: "GPS_AVAILABLE",
	gpsUnavailable: "GPS_UNAVAILABLE",
	positionUpdated: "POSITION_UPDATED",
	refreshRate: 1000,
	currentPosition: false,
	currentPositionMarker: false,
	customDebugging: false,
	debugId: false,
	map: false,
	interval: false,
	intervalCounter: false,
	updateMap: false,
	locatieRij: [],
	markerRij: [];
}	


//controller
var controller = {
	init: function () {}
}

//GPS functies
var gps = {
	eventTarget: function (){},
	startInterval: function (){},
	updatePosition: function (){},
	setPosition: function (){},
	checkLocations: function (){},
	calculateDistance: function (){}
};

//Map functies
var map = {
	generateMap: function (){},
	updatePositie: function (){}
};

//Foutafhandeling
var debug = {
	errorHandler: function (){},
	message: function  (){},
	setCustomDebugging: function  (){}
};

var helper = {
	isNumber: function (){},
};




var config.init(); //Het script starten
