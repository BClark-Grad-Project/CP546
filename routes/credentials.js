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
	}).post('/register/complete', function (req, res, next){data.user.grant.Admin(req, res, next);},function(req, res) {
		data.user.completeRegister(req, function(err, data){ 
			res.redirect('/credentials/manage/users');
		});
	});

	/* GET/POST add page. */
	router.get('/manage/applications', function (req, res, next){data.user.grant.Admin(req, res, next);}, function(req, res, next) {
			data.user.getUserArrayByType('pending', function (err, applicants) {
				if(err){
					console.log(err);
					next(err);
				} else {
					console.log('You are receiving the (applicants) Object', applicants);
					res.render('manageapplications', { title: 'UM | Grant Credentials', user: req.session.user, applicants: applicants });
				}
			});
	});

	/* GET/POST add page. */
	router.get('/manage/users', function (req, res, next){data.user.grant.Admin(req, res, next);}, function(req, res, next) {
		res.render('manageusers', { title: 'UM | Grant Credentials', user: req.session.user });
	});
	
	
	return router;
};
