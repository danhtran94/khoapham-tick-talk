var express = require("express");
var app = express();

var httpServer = require("http").Server(app);
var io = require("socket.io")(httpServer);
var r = require("rethinkdb");

app.use(express.static("./public"));
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, Access-Control-Allow-Headers, Authorization, X-Requested-With');
	next();
});

var p = r.connect({
	host: 'localhost',
	port: 28015,
	db: 'khoapham_chat_data'
});

let messages = [];
let usersOnline = [];
let relogs = [];


io.sockets.on("connection", function (conn) {
	conn.uName = "";
	console.log(conn.id);
	conn.emit("server-sync-mess", messages);

	conn.on("client-submit", function (mess) {
		mess.time = Date.now();
		mess.type = "mes";
		messages.splice(0, 0, mess);
		io.sockets.emit("server-push-mess", mess)
	});

	conn.on("client-relog", function (username) {
		console.log(usersOnline.indexOf(username));
		var mess;
		if (usersOnline.indexOf(username) >= 0) {
			console.log("here");
			relogs.push(username);
			mess = {
				type: "sev",
				reqLog: false,
				time: Date.now(),
				message: "Re-connect success ..."
			};
			conn.uName = username;
		} else {
			mess = {
				type: "sev",
				reqLog: true,
				time: Date.now(),
				message: "Time out you have to re-login ..."
			}
		}
		conn.emit("server-check-relog", mess.reqLog);
		conn.emit("server-sync-mess", messages);
		conn.emit("server-push-mess", mess);
	});

	conn.on("client-login", function (user) {
		if (usersOnline.indexOf(user) < 0) {
			p.then(function (connDB) {
				r.table("users").filter({
					username: user.username,
					password: user.password
				}, {default: false}).run(connDB, function (err, res) {
					if (err) {
						console.log(err)
					} else {
						if (res["_responses"].length != 0) {
							conn.emit("server-apply-login", user.username);
							usersOnline.push(user.username);
							conn.uName = user.username;
							io.sockets.emit("server-push-mess", {
								time: Date.now(),
								type: "sev",
								message: user.username +" logged in ..."
							})
						} else {
							conn.emit("server-push-mess", {
								time: Date.now(),
								type: "sev",
								message: "Fail to login please try again ..."
							})
						}
					}
				})
			}).error(function (err) {
				console.log(err)
			});
		} else {
			conn.emit("server-push-mess", {
				time: Date.now(),
				type: "sev",
				message: "This account is logging ..."
			})
		}

	});

	conn.on("client-register", function (user) {
		p.then(function (connDB) {
			r.table("users").insert(user).run(connDB, function (err, res) {
				if (err) {
					console.log("err: "+ err)
				} else {
					if (res.inserted > 0) {
						conn.emit("server-check-register", true);
						conn.emit("server-push-mess", {
							type: "sev",
							time: Date.now(),
							message: "Registering success, now you can login ..."
						})
					} else {
						conn.emit("server-check-register", false)
						conn.emit("server-push-mess", {
							type: "sev",
							time: Date.now(),
							message: "Username has been taken, please try again ..."
						})
					}
				}
			})
		})
	});

	conn.on("disconnect", function () {
		var removeUser = function (relog) {
			if (conn.uName != "" && !relog) {
				var index = usersOnline.indexOf(conn.uName);
				usersOnline.splice(index, 1);
				io.sockets.emit("server-push-mess", {
					type: "sev",
					time: Date.now(),
					message: conn.uName +" has logged out ..."
				})
			}
		};
		setTimeout(function () {
			var check = relogs.indexOf(conn.uName);
			if (check >= 0) {
				removeUser(true);
				relogs.splice(check, 1)
			} else {
				removeUser(false);
			}
		}, 20000)
	})
});

app.get("/", function (req, res) {
	res.render("index");
});

httpServer.listen(8081);

