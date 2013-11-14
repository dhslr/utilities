(function () {
	"use strict";
	var apps = [],
		path = require("path"),
		fs = require("fs"),
		find,
		app_dir;

	/**
	 * This methods implements the 
	 * functionality of unix' find (1).
	 * It recursively lists all files and
	 * directories realtive to a given
	 * root directory.
	 * @param {String} root The root directory
	 * @return {Array} The resulting array 
	 * of the names of files and folders (as Strings)
	 * @method find
	 **/
	find = function (root) {
		var find_h,
			ret = [];
		find_h = function (dir) {
			var stat = fs.statSync(dir),
				files;
			if (stat.isDirectory()) {
				ret.push(dir);
				files = fs.readdirSync(dir);
				for (var i = 0; i < files.length; i++) {
					find_h(path.join(dir, files[i]));
				}
			} else {
				ret.push(dir);
			}
		};
		find_h(path.normalize(root));
		return ret;
	};

	/**
	 * Builds the app database from the
	 * given root directory. If the directory
	 * parameter is omitted, the last one
	 * will be used and when there is no
	 * last one, an error will be thrown.
	 * [@param directory The root directory(
	 * where the apps are located]
	 * @method index
	 **/
	exports.index = function (directory) {
		var files,
				filtered;

		directory = directory || app_dir;
		app_dir = directory;
		if (typeof app_dir === "undefined") {
			throw new ReferenceError("No app directory has ben set!");
		}

		files = find(app_dir);
		apps = [];

		filtered = files.filter(function (f)  {
			return (path.basename(f) === "package.json");
		});

		for (var i = 0; i < filtered.length; i++) {
			var data = fs.readFileSync(filtered[i]),
				obj  = JSON.parse(data.toString());
			if (typeof obj.main !== "undefined" && 
					typeof obj.name !== "undefined") {
				apps.push({
					name: obj.name, 
					dir: path.dirname(filtered[i]),
					version: obj.version,
					main_path: path.join(path.dirname(filtered[i]), obj.main)
				});
			}
		}
		return apps;
	};

	/**
	 * @return {Array} Returns all the
	 * apps in the database. 
	 * @method getApps
	 **/
	exports.getApps = function () {
		return apps;
	};

	/**
	 * @return {Array} Returns an array 
	 * of app objects with the given name.
	 * @method getAppsByName
	 **/
	exports.getAppsByName = function (name) {
		return apps.filter(function (app) {
			return (app.name === name);
		});
	};

})();
