(function () {
	"use strict";
	var npm = require("npm"),
		fork = require("child_process").fork,
		path = require("path"),
		one_arg_helper,
		npm_helper,
		conf = {
			json: true, 
			depth: 1,
			prefix: process.cwd(),
			logLevel: "verbose",
			global: true
		};

	exports.setPrefix = function (_prefix) {
		conf.prefix = _prefix;
	};

	npm.on("log", function (msg) {
		console.log("npm-log: %j", msg);
	});

	npm_helper = function (cmd, args, cb) {
		var _args = args || [];
		_args.concat("--no-registry");
		npm.load(conf, function (err) {
			if (err) {
				if (typeof cb === "function") {
					cb(err);
				} else {
					console.log(err);
					throw err;
				}
			}
			npm.commands[cmd](args, cb); 
		});
	};

	one_arg_helper = function (cmd) {
		return function (arg, cb) {
			var _arg;
			if (typeof arg === "undefined") {
				_arg = [];
			} else if (typeof arg === "function") {
				cb = arg;
				_arg = [];
			} else {
				_arg = [arg];
			}
			return npm_helper(cmd, _arg, cb);
		};
	};

	exports.ls = function (cb) {
		var fpath = path.join(path.dirname(module.filename), "ls.js");
		var child = fork (fpath, [conf.prefix]);
		child.on("message", function (message) {
			if (typeof cb === "function") {
				cb(message);
			}
			child.kill();
		});
	};
	exports.pack = one_arg_helper("pack");
	exports.install = one_arg_helper("install");
	exports.cache = one_arg_helper("cache");
	exports.start = one_arg_helper("start");
	exports.remove = one_arg_helper("remove");
	exports.test = one_arg_helper("test");
})();
