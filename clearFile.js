var fs = require("fs");
var schedule = require("node-schedule");
var filename = "./log.txt";

var g = schedule.scheduleJob("59 * * * *", function () {
	fs.writeFile(filename, "", function () {
		console.log("Cleared File");
		const startData =
			'{"data": [\n {"user":"daniel-savage@outlook.com","login_time":"Mon, 27 Apr 2020 17:12:23 GMT","artist_played":"Frenchies","song_played":"Tarten Tavern","playing_time":"0:25","logout_time":"Mon, 27 Apr 2020 17:14:10 GMT"}\n{"user":"angelahennesy+2@one-email.net","login_time":"Mon, 27 Apr 2020 17:34:24 GMT","artist_played":"TonyS","song_played":"Reality Check","playing_time":"0:00","logout_time":"Mon, 27 Apr 2020 17:36:03 GMT"}';
		fs.writeFile(filename, startData, function () {
			console.log("Started File");
		});
	});
});
