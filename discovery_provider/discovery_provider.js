(function () {
	"use strict";
	var util = require("util"),
		DiscoveryProvider,
		events = require("events");

	exports.DiscoveryProvider = DiscoveryProvider = function () {

		var NotImplementedError;
		NotImplementedError = function (message) {
			 this.message = message;
		};
		util.inherits(NotImplementedError, Error);

		this.createAdvertisement = function () {
			throw new NotImplementedError("createAdvertisement must be implemented!");
		};
		this.startAdvertising = function () {
			throw new NotImplementedError("startAdvertising must be implemented!");
		};
		this.stopAdvertising = function () {
			throw new NotImplementedError("stopAdvertising must be implemented!");
		};
		this.createBrowser = function () {
			throw new NotImplementedError("createBrowser must be implemented!");
		};
		this.startBrowsing = function () {
			throw new NotImplementedError("startBrowsing must be implemented!");
		};
		this.stopBrowsing= function () {
			throw new NotImplementedError("stopBrowsing must be implemented!");
		};
	};
	util.inherits(DiscoveryProvider, events.EventEmitter);

	exports.createDefaultProvider = function () {
		return require("./mdns_provider").createDiscoveryProvider();
	};

})();
