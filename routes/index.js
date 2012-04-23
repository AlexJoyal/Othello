
/*
 * GET home page.
 */
var db = require('./db');

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
        db.addUser(user,function(err, result){
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

}

exports.loadgame = function(req, res){
	
}