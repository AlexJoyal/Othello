
/*
 * GET home page.
 */

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
                'createDate': Date.now()
        	};
        addUser(user);
    } else {
        res.render('newuser', {title:"Register", error: "Sorry, user name already in use."})
    }
    
    res.redirect('/login');
}