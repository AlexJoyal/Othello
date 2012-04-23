var pg = require('pg');

// Configuration.
var host = 'db-edlab.cs.umass.edu';
var port = 7391;

// The postgres client.
var client;

exports.db = function (user, db) {
	if (!db) {
		db = user;
	}

   	obj = {};
	obj.conn = 'tcp://' + user + '@' + host + ':' + port + '/' + db;
	obj.getUser = getUser;
	obj.addUser = addUser;
    obj.getGame = getGame;
    obj.addGame = addGame
	return obj;
}

function getUser (user, cb) {
	var that = this;
	pg.connect(that.conn, function (err, client) {
	client.query('select * from users where username =' + user + ';',
                     function (err, result) {
                         cb(err, result);
                     });
    });
};

function addUser(user, cb){
	var that = this;
    	pg.connect(that.conn, function (err, client) {
        var sql = 'insert into users values(default, $1, $2, $3, now());';
        client.query(sql, [user.username, user.pass, user.email],
                    function (err, result) {
                        cb(err, result);
                    });
        });
}

function getGame (uid, gameID, cb) {
    var that = this;
    pg.connect(that.conn, function (err, client) {
    client.query('select * from games where uid =' + uid + ' and gid =' + gameID + ';',
                     function (err, result) {
                         cb(err, result);
                     });
    });
};

function addGame (game, cb){
    var that = this;
        pg.connect(that.conn, function (err, client) {
        var sql = 'insert into games values(default, $1, now());';
        client.query(sql, [game],
                    function (err, result) {
                        cb(err, result);
                    });
        });
}

