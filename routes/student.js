module.exports = function (data) {
	var express = require('express');
	var router = express.Router();
	var backURL;
	
	router.get('/history', function (req, res, next){data.user.grant.StudentTeacherAdmin(req, res, next);}, function(req, res, next) {
		res.redirect('/catalog/schedule');
	}).post('/history', function (req, res, next){data.user.grant.StudentTeacherAdmin(req, res, next);}, function(req, res, next) {
		data.schedule.getUserCourseHistory(req, function(err, history){
			if(err){
				console.log('You are receiving an empty (history) Object', {history: {schedule:{code: ''}, course:{code:''}}});
				res.render('history', { title: 'University Manager | Student\'s Class History Report', user: req.session.user, history: {schedule:{code: ''}, course:{code:''}}});			
			}else{
				console.log('You are receiving a (history) Object', history);
				res.render('history', { title: 'University Manager | Student\'s Class History Report', user: req.session.user, history: history });		
			}
		});
	});
	
	/* GET/POST class to schedule page. */
	router.get('/add', function (req, res, next){data.user.grant.StudentAdmin(req, res, next);}, function(req, res, next) {
		res.redirect('/catalog');
	}).post('/add', function (req, res, next){data.user.grant.StudentAdmin(req, res, next);}, function(req, res, next) {
		data.schedule.getCourseSchedule(req, function(err, schedule){
			if(err){
				console.log('You are receiving an empty (schedule) Object', {schedule: {schedule:{code: ''}, course:{code:''}}});
				res.render('addrequest', { title: 'University Manager | Add Class', user: req.session.user, schedule:{code:'', course:{code:''}}});
			} else {
				console.log('You are receiving the (schedule) Object', schedule);
				res.render('addrequest', { title: 'University Manager | Add Class', user: req.session.user, schedule: schedule });
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
				console.log('You are receiving an empty (schedule) Object', {schedule: {schedule:{code: ''}, course:{code:''}}});
				res.render('drop', { title: 'UM | Confirm Drop Class', user: req.session.user , schedule: {schedule:{code: ''}, course:{code:''}}});			
			}else{
				console.log('You are receiving the (schedule) Object', schedule);
				res.render('drop', { title: 'UM | Confirm Drop Class', user: req.session.user, schedule: schedule });
			}
		});
	}).post('/drop/complete', function (req, res, next){data.user.grant.StudentTeacher(req, res, next);}, function(req, res, next) {
		console.log('dropping');
		
		data.schedule.dropCourse(req, function(err, schedule){
			res.redirect('/catalog/schedule');
		});
	});
	
	return router;
};
