module.exports = function (data) {
	var express = require('express');
	var router = express.Router();
	var backURL;
	
	/* POST credentials page. */
	router.post('/', function(req, res, next) {
		var user;
		data.user.authenticate(req, res, function(err){
			if(err){
				console.log(err);
				backURL=req.header('Referer') || '/';
				res.redirect(backURL);
				next({error:err});
			} else {
				backURL=req.header('Referer') || '/';
				res.redirect(backURL);
			}
		});
	});
	
	/* GET sign-out credentials page. */
	router.get('/signout', function(req, res, next) {
		data.user.deauthenticate(req, res, function (err){
			if(err){
				console.log(err);
				next(null, false, 'There was a problem signing you out correctly.');
			}
			backURL=req.header('Referer') || '/';
			res.redirect(backURL);
		});
	});

	/* POST register page. */
	router.post('/create', function(req, res, next) {
		data.user.create(req, function(err){
			if(err){
				console.log(err);
				next(null, false, {error:err});
			}
		});
		res.redirect('/');
	});

	/* POST password reset page. */
	router.post('/create/reset', function (req, res, next){data.user.grant.StudentTeacherAdmin(req, res, next);}, function(req, res, next) {
		backURL=req.header('Referer') || '/';
		res.redirect(backURL);
	});
	
	/* GET/POST register page. */
	router.get('/register', function(req, res, next) {
		res.render('register', { title: 'UM | Register for Fall 2014', user: req.session.user });
	}).post('/register', function(req, res) {
		backURL=req.header('Referer') || '/';
		res.redirect(backURL);
	});
	
	/* GET/POST add page. */
	router.get('/add', function (req, res, next){data.user.grant.Admin(req, res, next);}, function(req, res, next) {
			data.user.getUserArrayByType('pending', function (err, applicants) {
				if(err){
					console.log(err);
					backURL=req.header('Referer') || '/';
					res.redirect(backURL);
					next({error:err});
				} else {
					res.render('adduser', { title: 'UM | Grant Credentials', user: req.session.user, applicants: applicants });
				}
			});
	}).post('/add', function (req, res, next){data.user.grant.Admin(req, res, next);}, function(req, res, next) {
		// WRITE RECORD LOGIC GOES HERE
		backURL=req.header('Referer') || '/';
		res.redirect(backURL);
	});
	
	/* GET/POST deactivate page. */
	router.get('/deactivate', function (req, res, next){data.user.grant.Admin(req, res, next);}, function(req, res, next) {
		res.render('deactivate', { title: 'UM | De-Activate Credentials', user: req.session.user });
	}).post('/deactivate', function (req, res, next){data.user.grant.Admin(req, res, next);}, function(req, res, next) {
		// WRITE RECORD LOGIC GOES HERE
		backURL=req.header('Referer') || '/';
		res.redirect(backURL);
	});
	
	return router;
};
