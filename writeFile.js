var fs = require("fs"),
	util = require("util"),
	cp = require("child_process");

var filename = "./log.txt";
var lines2nuke = 1;
var command = util.format("tail -n %d %s", lines2nuke, filename);

const writeFile = (data) => {
	cp.exec(command, (err, stdout, stderr) => {
		if (err) throw err;
		var to_vanquish = stdout.length;
		fs.stat(filename, (err, stats) => {
			if (err) throw err;
			fs.truncate(filename, stats.size - to_vanquish, (err) => {
				if (err) throw err;
				console.log("File truncated!");
				const extraElement = ",\n";
				fs.appendFile("log.txt", extraElement, function (err) {
					if (err) throw err;
					fs.appendFile("log.txt", data, function (err) {
						if (err) throw err;
						console.log("Updated Log!");
						const finalSt = "\n ]}";
						fs.appendFile("log.txt", finalSt, function (err) {
							if (err) throw err;
							console.log("Updated Log!");
						});
					});
				});
			});
		});
	});
};

let t =
	'{"user":"daniel-savage@outlook.com","login_time":"Mon, 27 Apr 2020 15:50:32 GMT","artist_played":"Frenchies","song_played":"Hold Me","playing_time":"0:02","logout_time":"Mon, 27 Apr 2020 15:51:56 GMT"}';
writeFile(t);
