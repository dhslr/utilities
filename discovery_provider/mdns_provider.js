(function () {
	"use strict";
	var mdns = require("mdns"),
		mdns_wrapper,
		util = require("util"),
		url = require("url"),
		net = require("net"),
		ip_type = 4,
		DiscoveryProvider = require("./discovery_provider.js").DiscoveryProvider;


	mdns_wrapper = function () {
		var self = this,
			ad,
			browser,
			check_address;

		this.createAdvertisement = function (port, service_name, protocol) {
			var _protocol = protocol || "tcp",
			serv = new mdns.ServiceType({name: "http", protocol: _protocol});
			ad = mdns.createAdvertisement(serv, port, {txtRecord: {name: service_name}});
		};
		this.startAdvertising = function () {
			if (typeof ad !== "undefined") {
				ad.start();
			}
		};
		this.stopAdvertising = function () {
			if (typeof ad !== "undefined") {
				ad.stop();
			}
		};
		this.createBrowser = function (protocol) {
			var _protocol = protocol || "http";
			browser = mdns.createBrowser(mdns.tcp(_protocol));
			browser.on("serviceUp", function (service) {
				var address = check_address(service);
				if (typeof address !== "undefined" &&
						typeof service.txtRecord !== "undefined") {
						var _url = url.format({
							protocol: _protocol,
							hostname: address,
							port: service.port
						});
						self.emit("up", {url: _url, name: service.txtRecord.name});
				}
			});
			browser.on("serviceDown", function (service) {
				self.emit("down", service);
			});
		};

		check_address = function (service) {
			var address;
			for (var i = 0; i < service.addresses.length; i++) {
				if (ip_type === net.isIP(service.addresses[i])) {
					address = service.addresses[i];
				}
			}
			return address;
		};

		this.startBrowsing = function () {
			if (typeof browser !== "undefined") {
				browser.start();
			} else {
				self.createBrowser();
				browser.start();
			}
		};
		this.stopBrowsing = function () {
			if (typeof browser !== "undefined") {
				browser.stop();
			}
		};
	};
	util.inherits(mdns_wrapper, DiscoveryProvider);
	exports.createDiscoveryProvider = function () {
		return new mdns_wrapper();
	};
})();
