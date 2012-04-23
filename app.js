
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
 // , io  = require('socket.io');

//io.set('log level', 1);

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
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


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
/*
io.sockets.on('connection',
              function (socket) {
               


                  // Send back to client
                  socket.set('id', bid, function () {
                      var msg = { you  : block,
                                  them : blocks };
                      socket.emit('block', msg);
                  });

                  // Send to other clients
                  socket.broadcast.emit('+block', block);

                  // Register move events:
                  socket.on('save', function (userid, gameboard) {
                      //save gameboard
                  });

                  socket.on('disconnect', function () {
                      socket.get('id', function (err, id) {
                          var block = blocks[id];
                          delete blocks[id];
                          socket.broadcast.emit('-block', block);
                      });
                  });
              });*/