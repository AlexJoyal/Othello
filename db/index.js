var pg = require('pg').native;

// Configuration.
var host = 'db-edlab.cs.umass.edu';
var port = 7391;

// The postgres client.
var client;

exports.db = function (user, pass, db) {
	if (!db) {
		db = user;
	}

    if (pass){
        user = user + ':' + pass
    }

   	obj = {};
	obj.conn = 'tcp://' + user + '@' + host + ':' + port + '/' + db;
	obj.getUser = getUser;
	obj.addUser = addUser;
    obj.getGame = getGame;
    obj.addGame = addGame;
	obj.getUserByEmail = getUserByEmail;
	obj.getGames = getGames;
    obj.updateGame = updateGame;
	return obj;
}

function getUser (us, cb) {
	var that = this;
	pg.connect(that.conn, function (err, client) {
	var sql = "select * from users where username='" + us.name +"' and password='" + us.pass + "';"
	client.query(sql, function (err, result) {
                             cb(err, result);
                          });
    });
};

function getUserByEmail (email, cb) {
    var that = this;
    pg.connect(that.conn, function (err, client) {
    var sql = "select * from users where email='" + email + "';"
    client.query(sql, function (err, result) {
                             cb(err, result);
                          });
    });
};

function addUser(user, cb){
	var that = this;
    	pg.connect(that.conn, function (err, client) {
        var sql = 'insert into users values(default, $1, $2, $3, now());';
        client.query(sql, [user.name, user.pass, user.email],
                    function (err, result) {
                        cb(err, result);
                    });
        });
}

function getGames (uid, cb) {
    var that = this;
    pg.connect(that.conn, function (err, client) {
    client.query('select * from games where uid =' + uid + ';',
                     function (err, result) {
                         cb(err, result);
                     });
    });
};

function getGame (uid, gameID, cb) {
    var that = this;
    pg.connect(that.conn, function (err, client) {
    client.query('select * from games where uid =' + uid + ' and gid =' + gameID + ';',
                     function (err, result) {
                         cb(err, result);
                     });
    });
};

function addGame (uid, game, gameboard, p1score, p2score, cb){
    var that = this;
        pg.connect(that.conn, function (err, client) {
        var sql = 'insert into games values(default, $1, $2, $3, $4, $5, now());';
        client.query(sql, [uid, game, gameboard, p1score, p2score],
                    function (err, result) {
                        cb(err, result);
                    });
        });
}

function updateGame(gid, game, gameboard, p1score, p2score, cb){
    var that = this;
        pg.connect(that.conn, function (err, client) {
        var sql = 'update games set gamehistory=$1, gameboard=$2, p1score=$3, p2score=$4 where gid=$5;';
        client.query(sql, [game, gameboard, p1score, p2score, gid],
                    function (err, result) {
                        cb(err, result);
                    });
        });
}
