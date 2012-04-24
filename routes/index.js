
/*
 * GET home page.
 */
var database = require('db');
db = database.db('ajoyal');

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.playOthello = function(req, res){
	var user = req.session.user;
	console.log("user : " + user + " is logged in")
	if (!user) {
		user = 0;
	}
	res.render('othello', {title: "Othello", game: "", user: true})
}

exports.newuser = function(req, res){
	res.render('newuser', {title: 'Register', error: ""});
}

exports.createuser = function(req, res){
	
    var name = req.body.name;
    var password = req.body.password;
    var email = req.body.email;


    if (!checkUserExists(email)){
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
    } else {
        res.render('newuser', {title:"Register", error: "Sorry, user name already in use."})
    }
    
    res.redirect('/login');


}

exports.savegame = function(req, res){
	var data = req.body;
	var uid = req.session.user;
	var game = data.game;
	console.log(game);
	if (uid){
		db.addGame(uid, game, 
			function(err, result){
				if(err){
					console.log(err)
				} else {
					console.log("Game saved successfully")
				}
		});
	} else {
		console.log("Game not saved, no user logged in")
	}
}

exports.loadgame = function(req, res){
	var uid = req.session.user;
	var gid = req.params.id;

	db.getGame(uid, gid, 
		function(err, result){
			if(err){
				console.log(err);
			} else {
				console.log(result.rows[0].game);
				res.render('othello', {
						title: "Othello",
						user:true,
						game: result.rows[0].game
				});
			}

	})
}

exports.gameHistory = function(req, res){
	var user = req.session.user;
	var games;
	db.getGames(user, 
		function(err, result){
			if (err){
				console.log(err);
			} else {
				games = result.rows;
				res.render('home', {title: "Home",
						games: games,
						user: true
					});

			}
	});
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
			    res.render('login', {title: 'User Login', error: "Invalid username or password"});
			} else if (result.rows != ""){
					req.session.user = result.rows[0].uid;
					res.redirect('/home');
					return;
			}

	});
	//res.render('login', {title: 'User Login', error: "Invalid username or password"});
};

exports.logout = function(req, res) {
    // TODO: user logout
    req.session.destroy();
    res.redirect('/login');
};

function checkUserExists(email){
	db.getUserByEmail(email, function(err, result){
		if(err){
			return false;
		} else {
			return true;
		}
	})
}
