module.exports = function (data) {
	var express = require('express');
	var router = express.Router();
	var backURL;
	
	
	router.get('/history', function (req, res, next){data.user.grant.StudentTeacherAdmin(req, res, next);}, function(req, res, next) {
		var id = req.body.grab ? req.body.grab : req.session.user.id;
		data.schedule.getUserCourseHistory(id, function(err, history){
			if(err){
				res.render('history', { title: 'Student\'s Transcript', user: req.session.user, history: {schedule:{code: ''}, course:{code:''}}});			
			}else{
				res.render('history', { title: 'Student\'s Transcript', user: req.session.user, history: history });		
			}
		});
	});
	
	router.post('/history/:id', function (req, res, next){data.user.grant.StudentTeacherAdmin(req, res, next);}, function(req, res, next) {
		var id = req.body.grab ? req.body.grab : req.params.id;
		console.log(id);
		data.schedule.getUserCourseHistory(id, function(err, history){
			if(err){
				res.render('history', { title: 'Student\'s Transcript', user: req.session.user, history: {schedule:{code: ''}, course:{code:''}}});			
			}else{
				res.render('history', { title: 'Student\'s Transcript', user: req.session.user, history: history });		
			}
		});
	});
	
	/* GET/POST class to schedule page. */
	router.get('/add', function (req, res, next){data.user.grant.StudentAdmin(req, res, next);}, function(req, res, next) {
		res.redirect('/catalog');
	}).post('/add', function (req, res, next){data.user.grant.StudentAdmin(req, res, next);}, function(req, res, next) {
		data.schedule.getCourseSchedule(req, function(err, schedule){
			if(err){
				res.render('addrequest', { title: 'Confirm Add Course', user: req.session.user, schedule:{code:'', course:{code:''}}});
			} else {
				res.render('addrequest', { title: 'Confirm Add Course', user: req.session.user, schedule: schedule });
			}
		});
	}).post('/add/complete', function (req, res, next){data.user.grant.Student(req, res, next);}, function(req, res, next) {
		data.schedule.addCourse(req, function(err, schedule){
			res.redirect('/catalog/schedule');
		});
	});

	/* GET/POST drop to schedule page. */
	router.get('/drop', function (req, res, next){data.user.grant.StudentTeacher(req, res, next);}, function(req, res, next) {
		res.redirect('/catalog/schedule');
	}).post('/drop', function (req, res, next){data.user.grant.StudentTeacher(req, res, next);}, function(req, res, next) {		
		data.schedule.getUserSchedule(req, function(err, schedule){
			if(err){
				res.render('drop', { title: 'Confirm Drop Course', user: req.session.user , schedule: {schedule:{code: ''}, course:{code:''}}});			
			}else{
				res.render('drop', { title: 'Confirm Drop Course', user: req.session.user, schedule: schedule });
			}
		});
	}).post('/drop/complete', function (req, res, next){data.user.grant.StudentTeacher(req, res, next);}, function(req, res, next) {		
		data.schedule.dropCourse(req, function(err, schedule){
			res.redirect('/catalog/schedule');
		});
	});
	
	return router;
};
