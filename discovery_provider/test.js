(function () {
	"use strict";
	var discovery = require("./discovery_provider.js").createDefaultProvider();
	var service_name = "berry";
	discovery.createBrowser();
	discovery.startBrowsing();
	discovery.on("up", function (service) {
		console.log("Up");
		console.log(service);
	});
	discovery.createAdvertisement(12341, service_name);
	discovery.startAdvertising();
	setTimeout(function () {
		discovery.stopAdvertising();
		setTimeout(function () {
			discovery.stopBrowsing();
		}, 1000);
	}, 2500);
})();
