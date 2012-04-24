
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');


var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'othello' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/othello', routes.playOthello);
app.get('/newuser', routes.newuser);
app.post('/createuser', routes.createuser);
app.post('/savegame', routes.savegame);
app.get('/loadgame/:id', routes.loadgame)
app.get('/home', routes.gameHistory);
app.post('/login', routes.login);
app.get('/login', function(req, res){
    var loggedIn = req.session.user;
    if (loggedIn){
        res.redirect('/othello');
        return;
    }
    res.render('login', {title: 'User Login', user: false, error: ""});
});
app.get('/logout', routes.logout);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
