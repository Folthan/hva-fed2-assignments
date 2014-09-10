//namespace
var GEO = GEO || {};

//selfinvoking function
(function() {
	GEO.controller = {
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
		markerRij: []
	}	
	

	//controller
	GEO.controller = {
		init: function () {}
	}

	//GPS functies
	GEO.gps = {
		eventTarget: function (){},
		startInterval: function (){},
		updatePosition: function (){},
		setPosition: function (){},
		checkLocations: function (){},
		calculateDistance: function (){}
	};

	//Map functies
	GEO.map = {
		generateMap: function (){},
		updatePositie: function (){}
	};

	//Foutafhandeling
	GEO.debug = {
		errorHandler: function (){},
		message: function  (){},
		setCustomDebugging: function  (){}
	};

	GEO.helper = {
		isNumber: function (){},
	};



	
	GEO.controller.init(); //Het script starten


})();//selfinvoking fuctie sluiten