// load the things we need
var mongoose = require('mongoose');
var db = require('./db-locations.js');
var UserSchedule = require('./models/user-schedule');
var Catalog = require('./catalog');
var Schedule = require('./models/schedule');
var Subject = require('./models/subject');
var Course = require('./models/subject-course');
var User = require('./models/user');

module.exports.create = function () {
	db.open('school', function(err){
		if(err !== undefined){return;}
	});
	
	
	db.close();
};

module.exports.getCourseSchedule = function (req, cb){
	var courseSchedule;
	
	db.open('school');
	Schedule
		.findOne({_id:req.body.grab})
		.exec(function(err, schedule){
			if(err){cb(err, null);return;}
			
			courseSchedule = schedule.getData();
			Course
				.findOne({_id:schedule.course})
				.exec(function(err, course){
					if(err){cb(err, null);return;}

					courseSchedule.course = course.getData();
					Subject
						.findOne({_id:course.subject})
						.exec(function(err, subject){
							db.close();
							if(err){cb(err, null);return;}

							courseSchedule.course.subject = subject.getData();
							db.open('user');
							User
								.findOne({_id:schedule.instructor})
								.exec(function(err, user){
									db.close();
									if(err){cb(err, null);return;}

									courseSchedule.instructor = user.getData();
									cb(null, courseSchedule);
									return;									
								});
						});
				});
		});
};

module.exports.userCurrentSessionSchedule = function (req, cb) {
	var mySchedule = [];
	Catalog.getCurrent(function(err, catalog){
		if(err){cb(err, null);return;}

		db.open('user');
		UserSchedule
			.find({user: req.session.user.id, active: true, 'session.code': catalog})
			.populate({ path: 'user', select: '_id first last' })
			.exec(function(err, history){
				if(err){cb(err, null);return;}
				
				for(i in history){
					mySchedule.push(history[i].getData());
				}
				if(req.session.user.type == 'teacher'){
					var j = 0;
					console.log(history.length);
					for(i in history){
						UserSchedule
							.find({'schedule.id':history[j].schedule.id, active:true})
							.populate({ path: 'user', select: '_id first last type' })
							.exec(function(err, students){
								if(err){cb(err, null);return;}
								
								var studentList = [];
								for(k in students){
									if(students[k].user.type == 'student'){
										studentList.push(students[k].getUserData());
									}
								}
								mySchedule[j].students = studentList;
								j++;
								
								if(j == history.length){
									db.close();
									
									cb(null, mySchedule);
									return;
								}
							});
					}
				} else {
					db.close();
					
					cb(null, mySchedule);
					return;
				}
			});	
		});
};


module.exports.getUserCourseHistory = function (req, cb){
	var courses = [];
	
	db.open('user');
	UserSchedule
		.find({user: req.body.grab})
		.exec(function(err, data){
			db.close();
			if(err){cb(err,null);return;}
			
			for(i in data){
				courses.push(data[i].getData());
			}
			cb(null, courses);
			return;
		});
};

module.exports.getUserSchedule = function(req, cb){
	db.open('user');
	UserSchedule
		.findOne({_id:req.body.grab})
		.exec(function(err, data){
			console.log(err, data);
			db.close();
			if(err){cb(err,null);return;}
			
			cb(null, data.getData());
			return;
		});
};


module.exports.addCourse = function(req, cb){

	db.open('user');
	var schedule = new UserSchedule({
		user:	req.body.id,
	    session:    {
			code: req.body.sessioncode
			},
	    schedule:{
	    	id:			req.body.scheduleid,
		    daily:       {sun:  Boolean(req.body.sun),
				          mon:  Boolean(req.body.mon),
				          tue:  Boolean(req.body.tue),
				          wed:  Boolean(req.body.wed),
				          thur: Boolean(req.body.thur),
				          fri:  Boolean(req.body.fri),
				          sat:  Boolean(req.body.sat)},
		    start_time:  req.body.start_time,
		    min_length:  req.body.min_length,
		    location:    req.body.location
	    },
	    units:       req.body.units,
	    instructor:  req.body.instructor,
	    seats:       req.body.seats,
	    course:      {
	    	id:		 req.body.courseid,
  	      code:      req.body.coursecode,
  		  name:      req.body.coursename,
  		  instructor: {first: req.body.instructorfirst,
  			           last:  req.body.instructorlast} },
  		active:  true,
		activity:''
	});
	
	schedule.save(function (err) {
		db.close();
		console.log(schedule.getData());
        if (err){
            console.log(err);
            return cb(err, null);
        }
        return cb(null, schedule.getData());
    });
	
	
};

module.exports.dropCourse = function(req, cb){
	var updateData = {
			activity:req.body.reason,
			active:false
	};

	db.open('user');
	UserSchedule.findOneAndUpdate({_id:req.body.id}, updateData, {}, function(err, user){
		db.close();
		console.log(err, user);
		if(err){return cb(err, null);}
		return cb(null, user);
	});
};
