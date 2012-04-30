
var database = require('db');
db = database.db('ajoyal');

exports.index = function(req, res){
  res.redirect('/othello');
};

exports.playOthello = function(req, res){
	var user;
	(req.session.user) ? user = true : user = false;
	res.render('othello', {title: "Othello", game: "", user: user})
}

exports.newuser = function(req, res){
	res.render('newuser', {title: 'Register', user: false, error: ""});
}

exports.createuser = function(req, res){
	
    var name = req.body.name;
    var password = req.body.password;
    var email = req.body.email;

    db.getUserByEmail(email, function(err, result){
		if(err){
			console.log(err);
		} else {
			if (result.rows.length == 0){
				var user = {
                'name': name,
                'pass': password,
                'email': email,
       			};
       			db.addUser(user, function(err, result){
       				if (err){
       					console.log(err);
    			   	} else {
        				console.log("User %s added", name);
     				}
       			});
        		res.redirect('/login');
			} else {
				res.render('newuser', {title:"Register", user: false, error: "Sorry, user email already registered."})
			}
		}
	});
}

exports.savegame = function(req, res){
	var data = req.body;
	var uid = req.session.user;
	var gid = parseInt(data.gid, 10);
	var game = data.game;
	var gameboard = data.gameboard;
	var p1score = data.p1score;
	var p2score = data.p2score;

	if (uid && gid == -1){
		db.addGame(uid, game, gameboard, p1score, p2score, 
			function(err, result){
				if(err){
					console.log(err)
				} else {
					console.log("Game saved successfully")
					res.send({data: "success"})
				}
		});
	} else if (gid != -1){
		db.updateGame(gid, game, gameboard, p1score, p2score, 
			function(err, result){
				if (err){
					console.log(err);
				} else {
					console.log("Game %d updated successfully", gid);
					res.send({data: "success"})
				}
			});
	} else {
		console.log("Game not saved, no user logged in")
	}
}

exports.loadgame = function(req, res){
	var uid = req.session.user;
	var gid = req.params.id;
	var game;

	if (uid){
		db.getGame(uid, gid, 
			function(err, result){
				if(err){
					console.log(err);
				} else if (result.rows != ""){
					res.render('othello', {
							title: "Othello",
							user: true,
							gid: gid,
							game: result.rows[0].gamehistory,
							gameboard: result.rows[0].gameboard
					});
				} else {
					res.render('othello', {
							title: "Othello",
							user: true,
							game: ""
					});
				}

		});
	} else {
		res.redirect('/othello');
	}
}

exports.gameHistory = function(req, res){
	var user = req.session.user;
	if (user){
		db.getGames(user, 
			function(err, result){
				if (err){
					console.log(err);
				} else {
					games = result.rows;
					//console.log(games);
					res.render('home', {title: "Home",
							games: games,
							user: true
						});

				}
		});
	} else {
		res.redirect('/othello');
	}
}

exports.login = function(req, res) {
    // TODO: user login
  
	var name = req.body.name;
	var password = req.body.password;
	var user = {
		'name': name,
		'pass': password
	}
	//redirect to /create if user is undefined
	db.getUser(user, function(err, result){
			if (err){
			    res.render('login', {title: 'User Login', user: false,  error: "Invalid username or password"});
			} else if (result.rows != ""){
					req.session.user = result.rows[0].uid;
					res.redirect('/home');
					return;
			} else {
				res.render('login', {title: 'User Login', user: false, error: "Invalid username or password"});
			}

	});
};

exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/login');
};