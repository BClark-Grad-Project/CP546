module.exports = function (data) {
	var express = require('express');
	var router = express.Router();
	var backURL;
	
	/* GET catalog page. */
	router.get('/', function(req, res, next) {
		data.catalog.getCurrent(function(err, id){
			if(err){
				console.log(err);
				backURL=req.header('Referer') || '/';
				res.redirect(backURL);
				next({error:err});
			} else {
				data.catalog.getCatalog(id, function(err, catalog){
					if(err){
						console.log(err);
						next({error:err});
					} else {

						console.log('You are receiving a none registered course (schedule) Object', catalog.schedule[0]);
						console.log('You are receiving a none registered course (schedule) Object', catalog.schedule[1]);
						console.log('You are receiving a none registered course (schedule) Object', catalog.schedule[2]);
						console.log('You are receiving a none registered course (schedule) Object', catalog.schedule[3]);
						console.log('You are receiving a none registered course (schedule) Object', catalog.schedule[4]);
						res.render('catalog', { title: 'UM | Class Catalog', user: req.session.user, catalog: catalog });
					}
				});
			}
		});
	});
	

	/* GET schedule page. */
	router.get('/schedule', function (req, res, next){data.user.grant.StudentTeacher(req, res, next);}, function(req, res, next) {
		data.schedule.userCurrentSessionSchedule(req, function(err, data){
			if(err){
				console.log(err);
				console.log('You are receiving a none registered course (schedule) Object', {user: req.session.user.id, session:{code:'Not Registered In Any Class'}, course: {code: 'None.'}});
				res.render('schedule', { title: 'UM | My Schedule', user: req.session.user, schedule: {user: req.session.user.id, session:{code:'Not Registered In Any Class'}, course: {code: 'None.'}}});
			} else {
				res.render('schedule', { title: 'UM | My Schedule', user: req.session.user, schedule: data });
			}
		});
	});

	/* GET add page. */
	router.get('/addcourse', function (req, res, next){data.user.grant.Admin(req, res, next);}, function(req, res, next) {
		data.subject.getSubjects(function (err, data){
			if(err){
				console.log(err);
				console.log('You are receiving an empty (subjects) Object', {code: '', name: '', description: ''});
				res.render('addcourse', { title: 'UM | Add Class Schedule', user: req.session.user, subjects: {code: '', name: '', description: ''}});
			} else {
				console.log('You are receiving the (subjects) Object', data);
				res.render('addcourse', { title: 'UM | Add Class Schedule', user: req.session.user, subjects: data });
			}
		});
	});

	/* GET add page. */
	router.get('/addschedule', function (req, res, next){data.user.grant.Admin(req, res, next);}, function(req, res, next) {
		data.course.getCourseList(function(err, courses){
			if(err){
				console.log(err);
				console.log('You are receiving an empty (courses) Object', {});
				res.render('addschedule', { title: 'UM | Class Scheduled added', user: req.session.user, courses:{} });
			} else {
				console.log('You are receiving the (courses) Object', courses);
				res.render('addschedule', { title: 'UM | Class Scheduled added', user: req.session.user, courses:courses });
			}
		});
	});

	return router;
};