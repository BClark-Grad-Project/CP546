module.exports = function (data) {
	var express = require('express');
	var router = express.Router();
	var backURL;
	
	router.get('/edit', function(req, res, next) {
		data.user.get.profile(req.session.user.user.id, function(err, user){
			res.render('user/profile', {title:"Manage Account", user: user });
		});
	}).post('/edit', function(req, res, next) {
		
	});	
	
	router.get('/edit/:id', function(req, res, next) {
		var id = req.params.id;
		data.user.get.profile(id, function(err, user){
			res.render('user/profile', {title:"Manage Account", user: user });
		});
	}).post('/edit/:id', function(req, res, next) {
		
	});

	
	return router;
};
