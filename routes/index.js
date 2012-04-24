
/*
 * GET home page.
 */
var database = require('db');
db = database.db('ajoyal');

exports.index = function(req, res){
  res.render('index', { title: 'Express,,' })
};

exports.playOthello = function(req, res){
	res.render('othello', {title: "Othello"})
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
	var uid = data.uid;
	var game = data.game;
	console.log(game);
	db.addGame(uid, game, 
			function(err, result){
				if(err){
					console.log(err)
				} else {
					console.log("Game added")
				}
	});
}

exports.loadgame = function(req, res){
	
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
			} else {
				req.session.user = result.rows[0].uid;
				res.redirect('/othello');
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
