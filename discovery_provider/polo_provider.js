(function () {
	"use strict"; 
	var polo = require("polo"),
		DiscoveryProvider = require("./discovery_provider.js").DiscoveryProvider,
		polo_wrapper,
		url = require("url"),
		util = require("util");

	polo_wrapper = function () {
		var self = this,
			advertisement,
			apps = polo(),
			browsing = false;
		apps.on("up", function (name, service) {
			console.log("Up: %j %j", name, service);
			if (browsing) {
				var _url = url.format({
					protocol: service.protocol,
					hostname: service.host,
					port: service.port
				});
				self.emit("up", {url: _url, name: name});
			}
		});
		apps.on("down", function (name, service) {
			console.log("Down: %j %j", name, service);
			if (browsing) {
				var _url = url.format({
					protocol: service.protocol,
					hostname: service.host,
					port: service.port
				});
				self.emit("down", {url: _url, name: name});
			} 
		});

		this.createAdvertisement = function (port, service_name, protocol) {
			var _protocol = protocol || "http";
			advertisement = {
				name: service_name,
				port: port,
				protocol: _protocol
			};
		};

		this.startAdvertising = function () {
			if (typeof advertisement !== "undefined") {
				apps.put(advertisement);
			} 
		};

		this.stopAdvertising = function () {
			// TODO: does that stop advertising?
			apps = polo();
		};
		this.createBrowser = function () {
		};
		this.startBrowsing = function () {
			browsing = true;
		};
		this.stopBrowsing= function () {
			browsing = false;
		};
	};

	exports.createDiscoveryProvider = function () {
		return new polo_wrapper();
	};

	util.inherits(polo_wrapper, DiscoveryProvider); 
})();
