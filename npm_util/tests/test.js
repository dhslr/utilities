var npmutil = require("../npm_util.js");
npmutil.ls(function (obj) {
	console.log(obj);
	npmutil.pack("pkgs/appA/", function (err, data) {
		console.log("$%j$", data);
		npmutil.install("pkgs/appA-0.0.0.tgz", function (err, data) {
			console.log("Install data");
			console.log(data);
			console.log("Install data");
			npmutil.ls(function (obj) {
				console.log("Ls-data:");
				console.log(obj);
				npmutil.install("pkgs/appABC-0.0.0.tgz", function (err, data) {
					npmutil.ls(function (obj) {
						console.log(obj);
					});
				});
			});
		});
	});
	/*
	*/
});
