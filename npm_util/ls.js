(function () {
	"use strict";
	var npm = require("npm"),
		path = require("path"),
		conf = {
			json: true,
			depth: 1,
			global: true,
			logLevel: "silent",
		};
	if (process.argv.length > 2) {
		conf["prefix"] = path.normalize(process.argv[2]);
		npm.load(conf, function (err) {
			if (err) {
				console.log(err);
				throw err;
			}
			npm.commands["ls"]([], function (err, data) {
				if (err) {
					console.log(err);
					throw err;
				}
				var apps = {};
				for (var key in data.dependencies) {
					if (data.dependencies.hasOwnProperty(key)) {
						var val = data.dependencies[key];
						apps[val.name] = {
							name: val.name,
							path: val.path,
							realPath: val.realPath,
							main: val.main,
							rule: val.rule,
							scripts: val.scripts,
							version: val.version
						};
					}
				}
				process.send(apps);
			}); 
		});
	} else {
		console.log("No app path set");
	}
})();
