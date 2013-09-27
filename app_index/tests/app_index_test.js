(function () {
	"use strict";
	var app_index = require("../app_index.js"),
		path = require("path"),
		test_app_dir = "./test_app_dir";

	exports.test_index = function (test) {
		var apps,
			app;
		test.throws(function () {
			app_index.index();
		}, ReferenceError);
	    apps = app_index.index(test_app_dir);
		console.log("Apps: %j", apps);
		test.strictEqual(apps.length, 3);
		test.doesNotThrow(function () {
			apps = app_index.index();
		}, ReferenceError);

		test.strictEqual(apps.length, 3);
		app = app_index.getAppsByName("appA")[0];
		test.strictEqual(app.name, "appA");
		test.strictEqual(app.main_path, path.join(test_app_dir, "./appA", "appA.js"));
		app = app_index.getAppsByName("appB")[0];
		test.strictEqual(app.name, "appB");
		test.strictEqual(app.main_path, path.join(test_app_dir, "./appB", "main.js"));
		test.done();
	};

})();
