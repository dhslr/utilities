(function () {
	"use strict";
	var	restify = require("restify"),
		fs = require("fs"),
		crypto = require("crypto"),
		shasum,
		handle_err;

	shasum = crypto.createHash("sha512");

	handle_err = function (err, cb) {
		if (typeof cb === "function") {
			cb(err);
		}
	};


	exports.handle_upload = function (cb) {
		return function (req, res, next) {
			var data,
				len = Number(req.header("Content-Length")),
				offset = 0;
			if (Number.isNaN(len)) {
				if (typeof cb === "function") {
					cb(restify.InvalidHeaderError("No Content-Length set!"),
							null, res, next);
				}
			} else {
				data = new Buffer(len);
				req.on("data", function (chunk) {
					if (Number.isNaN(len)) {
						data = chunk; 
					} else {
						chunk.copy(data, offset);
						offset += chunk.length;
					}
				});
				req.on("end", function () {
					if (typeof cb === "function") {
						cb(null, data, res, next);
					}
				});
			}
		};
	};
	exports.download = function (url, app_name, cb) {
		var client = restify.createClient({url: url}),
			res_handler,
			req_handler;

		res_handler = function (err, res) {
			var data = new Buffer(Number(res.header("Content-Length"))),
				offset = 0;
			if (err) {
				handle_err(err, cb);
			} else {
				res.on("data", function (chunk) {
					if (Buffer.isBuffer(chunk)) {
						chunk.copy(data, offset);
						offset += chunk.length;
					} else {
						data.write(chunk, offset);
						offset += Buffer.byteLength(chunk);
					}
				});
				res.on("end", function () {
					var h,
						filename;
					shasum.update(data);
					h = shasum.digest("hex");
					filename = "/tmp/" + h.slice(0, 8) + ".tgz";
					fs.writeFile(filename, data, function (err) {
						if (err) {
							handle_err(err, cb);
						} else {
							if (typeof cb === "function") {
								cb(null, filename);
							}
						}
					});
					client.close();
				});

			}
		};
		req_handler = function (err, req) {
			if (err) {
				handle_err(err, cb);
			} else {
				req.on("result", res_handler);
			}
		};
		client.get("/apps/" + app_name + "/download", req_handler);
	};

	exports.upload = function (url, pkg_path, cb) {
		var client = restify.createClient({url: url}),
			req_handler,
			res_handler,
			data,
			res_data = "",
			opts = {
				path: "/apps/upload",
				method: "POST"
			};

		res_handler = function (err, res) {
			if (err) {
				handle_err(err, cb);
			} else {
				res.on("data", function (chunk) {
					res_data += chunk;
				});
				res.on("end", function () {
					if (typeof cb === "function") {
						cb(null, res_data);
						client.close();
					}
				});
			}
		};
		req_handler = function (err, req) {
			if (err) {
				handle_err(err, cb);
			} else {
				req.on("result", res_handler);
				req.write(data);
				req.end();
			}
		};
		fs.readFile(pkg_path, function (err, fdata) {
			if (err) {
				handle_err(err, cb);
			} else {
				opts.headers = {
					  'Content-Type': 'application/x-www-form-urlencoded',
					  'Content-Length': fdata.length
				};
				data = fdata;
				client.post(opts, req_handler);
			}
		});
	};
})();
