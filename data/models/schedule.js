// load the things we need
var mongoose = require('mongoose');
var User = require('./user');
var Course = require('./subject-course');

// define the schema for our user model
var ScheduleSchema = mongoose.Schema({
    session:     {type: String},
    daily:       {sun:  {type: Boolean},
		          mon:  {type: Boolean},
		          tue:  {type: Boolean},
		          wed:  {type: Boolean},
		          thur: {type: Boolean},
		          fri:  {type: Boolean},
		          sat:  {type: Boolean} },
    instructor:  {type: mongoose.Schema.Types.ObjectId,
                  ref:  User.schema},
    start_time:  {type: Date},
    min_length:  {type: Number},
    units:  {type: Number},
    seats:       {type: Number},
    location:    {type: String},
    course:      {type: mongoose.Schema.Types.ObjectId,
                  ref:  Course.schema}
});

//db.schedules.insert({_id: ObjectId("54593aaba2b7eba1c5f6fab8"),session: '2014-FALL', daily: {sun: false, mon: false, tue: true, wed: false, thur: true, fri: false, sat: false}, instructor: ObjectId("5453fd925e3d1cf5ca0d59e8"), start_time: new Date('2014-4-20 09:30:00'), min_length: 75, seats: 32, location: 'IT013', course: ObjectId("54593884a2b7eba1c5f6fab0")})
//db.schedules.insert({_id: ObjectId("54593aaba2b7eba1c5f6fab9"),session: '2014-FALL', daily: {sun: false, mon: true, tue: false, wed: true, thur: false, fri: false, sat: false}, instructor: ObjectId("5453fd925e3d1cf5ca0d59e8"), start_time: new Date('2014-4-20 05:00:00'), min_length: 75, seats: 30, location: 'IT012', course: ObjectId("54593884a2b7eba1c5f6fab1")})
//db.schedules.insert({_id: ObjectId("54593aaba2b7eba1c5f6faba"),session: '2014-FALL', daily: {sun: false, mon: false, tue: false, wed: false, thur: false, fri: true, sat: false}, instructor: ObjectId("5453fd925e3d1cf5ca0d59e8"), start_time: new Date('2014-4-20 12:00:00'), min_length: 150, seats: 32, location: 'IT011', course: ObjectId("54593884a2b7eba1c5f6fab2")})
//db.schedules.insert({_id: ObjectId("54593aaba2b7eba1c5f6fabb"),session: '2014-FALL', daily: {sun: false, mon: false, tue: false, wed: false, thur: false, fri: false, sat: true}, instructor: ObjectId("5453fd925e3d1cf5ca0d59e8"), start_time: new Date('2014-4-20 10:30:00'), min_length: 150, seats: 31, location: 'IT010', course: ObjectId("54593884a2b7eba1c5f6fab3")})
//db.schedules.insert({_id: ObjectId("54593aaba2b7eba1c5f6fabc"),session: '2014-FALL', daily: {sun: false, mon: false, tue: false, wed: false, thur: false, fri: true, sat: false}, instructor: ObjectId("5453fd925e3d1cf5ca0d59e8"), start_time: new Date('2014-4-20 09:00:00'), min_length: 150, seats: 30, location: 'CS013', course: ObjectId("54593884a2b7eba1c5f6fab4")})
//db.schedules.insert({_id: ObjectId("54593aaba2b7eba1c5f6fabd"),session: '2014-FALL', daily: {sun: false, mon: false, tue: true, wed: false, thur: true, fri: false, sat: false}, instructor: ObjectId("5453fd925e3d1cf5ca0d59e8"), start_time: new Date('2014-4-20 07:30:00'), min_length: 75, seats: 32, location: 'CS012', course: ObjectId("54593884a2b7eba1c5f6fab5")})
//db.schedules.insert({_id: ObjectId("54593aaba2b7eba1c5f6fabe"),session: '2014-FALL', daily: {sun: false, mon: true, tue: false, wed: true, thur: false, fri: false, sat: false}, instructor: ObjectId("5453fd925e3d1cf5ca0d59e8"), start_time: new Date('2014-4-20 13:00:00'), min_length: 75, seats: 32, location: 'CS011', course: ObjectId("54593884a2b7eba1c5f6fab6")})
//db.schedules.insert({_id: ObjectId("54593aaca2b7eba1c5f6fabf"),session: '2014-FALL', daily: {sun: false, mon: false, tue: false, wed: false, thur: false, fri: false, sat: true}, instructor: ObjectId("5453fd925e3d1cf5ca0d59e8"), start_time: new Date('2014-4-20 10:00:00'), min_length: 150, seats: 32, location: 'CS010', course: ObjectId("54593884a2b7eba1c5f6fab7")})



// get data that should be returned.
ScheduleSchema.methods.getData = function(){
	return {
		id:          this._id,
		session:     this.session,
		daily:       this.daily,
        instructor:  this.instructor,
        start_time:  this.start_time,
        min_length:  this.min_length,
        seats:       this.seats,
        location:    this.location,
        course:      this.course
	};
};

ScheduleSchema.methods.getDays = function(){
	var days = '';
	if (this.daily.sat == true){
		days.concat(days, 'S ');
	}
	if (this.daily.mon == true){
		days.concat(days, 'M ');
	}
	if (this.daily.tue == true){
		days.concat(days, 'T ');
	}
	if (this.daily.wed == true){
		days.concat(days, 'W ');
	}
	if (this.daily.thur == true){
		days.concat(days, 'Th ');
	}
	if (this.daily.fri == true){
		days.concat(days, 'F ');
	}
	if (this.daily.sun == true){
		days.concat(days, 'Sun ');
	}
	console.log(days);
	return days;
};
// create the model for users and expose it to our app
module.exports = mongoose.model('Schedule', ScheduleSchema);