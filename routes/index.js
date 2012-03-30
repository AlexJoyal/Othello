
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.playOthello = function(req, res){
	res.render('othello', {title: "Othello"})
}