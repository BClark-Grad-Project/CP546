module.exports = function (data) {
	var express = require('express');
	var router = express.Router();
	var backURL;
	
	router.get('/edit', function(req, res, next) {
		data.user.getUserById(req.session.user.user.id, function(err, user){
			res.render('user/profile', {title:"Manage Account", user: user });
		});
	}).post('/edit', function(req, res, next) {
		
	});	

	
	return router;
};
