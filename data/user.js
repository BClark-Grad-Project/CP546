var mongoose = require('mongoose');
var db = require('./db-locations');

var newUser = require('./functions/userNew');

// Models
var User = require('./models/user');
var UserDetail = require('./models/user-detail');
var UserContact = require('./models/user-contact');
var UserTranscript = require('./models/user-transcript');
var UserTranscriptHistory = require('./models/user-transcript-history');
var Grant = require('./functions/route-grant');

var backURL;

var guestCheckIn = function(req){
	req.session = {};
	var sess = req.session;
	sess.user = {first: 'Guest', last: 'User', type: 'guest'};
};

module.exports.userCheck = function(req, res, next){
	if(!req.session.user){
		var sess = req.session;
		sess.user = {first: 'Guest', last: 'User', type: 'guest'};
	}
	return next();
};

module.exports.grant = Grant;

module.exports.create = function (req, cb) {
	db.open('user');
	
	var userContact;
	var userGeneralTranscript;
	var userCollegeTranscripts;
	var userTranscriptHistory;
	var userDetail;
	var user;

	userGeneralTranscript = newUser.Transcript(req, '_general');
	userCollegeTranscripts = newUser.CollegeTranscripts(req);
	userTranscriptHistory = newUser.TranscriptHistory(userGeneralTranscript, userCollegeTranscripts);
	userContact = newUser.Contact(req);
	userDetail = newUser.Detail(req, userContact, userTranscriptHistory);
	user = newUser.User(req, userDetail);
	
	db.close();
};

module.exports.authenticate = function (req, res, cb) {
	db.open('user');
	
	var validPass;
	var user;
	
	User
		.findOne({email:req.body.user})
		.exec(function(err,data){
			console.log(err);
			if (err) {
				db.close();
				cb(err);
				return 0;
			}
			if(data === null){
				db.close();
				cb('Invalid User / Password!! Try again.');
				return 0;
			}
			
			validPass = data.validPassword(req.body.password);
			if(validPass){
				user = data.getData();
				var sess = req.session;
				sess.user = user;
				// Hold session for one year if (remember) is checked.
				if(req.body.remember === 'on'){
					sess.cookie.maxage = 365 * 24 * 60 * 60 * 1000;
				}
				db.close();
				cb(null);
				return user;
			}
			db.close();
			cb('Invalid User / Password!!! Try again.');
			return 0;
		});
};


module.exports.deauthenticate = function (req, res, cb){
	req.session.destroy(function(err) {
		if (err !== undefined){cb(err);return;}
		cb(null);
		return;
	});
    //guestCheckIn(req);
};


module.exports.getUserById = function(id, cb){
	
	var profile = [];
	
	//search for user object
	User
		.findOne({_id:id})
		.exec(function(err, user){
			if (err){cb(err, null);return;}
			
			if(user){
				profile = user.getData();
				// search for detail object
				
				if(user.detail){
					UserDetail
						.findOne({detail:user.detail._id})
						.exec(function(err, details){
							if (err) {cb(err, null);return;}
							
							profile.detail = [];
							profile.detail = details.getData();
							
							//search for contact objects
							var contactId = [];
							profile.detail.contact = [];
							for (n in details.contact){
								if(n == 0) {contactId.push(details.contact[n]);}
							}
							console.log(profile);
							for(var i =0;i<details.contact.length; i++){
								UserContact
									.find({_id:contactId[i]})
									.exec(function(err, contact){	
										if (err) {cb(err, null);return;}
										
										for(n in contact){
											profile.detail.contact.push(contact[n].getData());
										}
									});
							}
							// search for transcript history object
							if(details.transcripts){
								UserTranscriptHistory
									.findOne({_id:details.transcripts})
									.exec(function(err, history){
										if (err) {cb(err, null);return;}
										
										profile.detail.transcripts = history.getData();
										
										//search for college transcript objects
										var transcriptId = [];
										profile.detail.transcripts.college = [];
										for (var i = 0; i < history.college.length; i++){
											transcriptId.push(history.college[i]);
										}
										for(var j = 0; j < transcriptId.length; j++){
											UserTranscript
												.findOne({_id:transcriptId[j]})
												.exec(function(err, transcripts){
													if (err) {cb(err, null);return;}
													
													profile.detail.transcripts.college.push(transcripts.getData());
												});
										}
										
										// search for ge transcript object
										UserTranscript
											.findOne({_id:history.general})
											.exec(function(err, ge){
												if (err) {cb(err, null);return;}
												
												profile.detail.transcripts.general = ge.getData();
												cb(null, profile);
												return;
											});
									});
							} else {
								cb(null, profile);
								return;
							}
							});
				} else {
					cb(null, profile);
					return;
				}
			} else {
				cb('Not Found', null);
				return;
			}
		});
};

module.exports.getUserByEmail = function(email, cb){	
	var profile = [];
	
	//search for user object
	db.open('user');
	User
		.findOne({email:email})
		.exec(function(err, user){
			if (err) {cb(err, null);return;}
			profile = user.getData();
			
			// search for detail object
			UserDetail
			.findOne({detail:user.detail._id})
			.exec(function(err, details){
				if (err) {cb(err, null);return;}
				profile.detail = [];
				profile.detail = details.getData();
				
				//search for contact objects
				var contactId = [];
				profile.detail.contact = [];
				for (n in details.contact){
					if(n == 0) {contactId.push(details.contact[n]);}
				}
				for(var i =0;i<details.contact.length; i++){
					UserContact
						.find({_id:contactId[i]})
						.exec(function(err, contact){
							if (err) {cb(err, null);return;}
							for(n in contact){
								profile.detail.contact.push(contact[n].getData());
							}
						});
				}
				
				// search for transcript history object
				if(details.transcripts){
					UserTranscriptHistory
						.findOne({_id:details.transcripts})
						.exec(function(err, history){
							if (err) {cb(err, null);return;}
							profile.detail.transcripts = history.getData();
							
							//search for college transcript objects
							var transcriptId = [];
							profile.detail.transcripts.college = [];
							for (var i = 0; i < history.college.length; i++){
								transcriptId.push(history.college[i]);
							}
							for(var j = 0; j < transcriptId.length; j++){
								UserTranscript
									.findOne({_id:transcriptId[j]})
									.exec(function(err, transcripts){
										if (err) {cb(err, null);return;}
										profile.detail.transcripts.college.push(transcripts.getData());
									});
							}
							
							// search for ge transcript object
							UserTranscript
								.findOne({_id:history.general})
								.exec(function(err, ge){
									if (err) {cb(err, null);return;}
									profile.detail.transcripts.general = ge.getData();
									db.close();
									cb(null, profile);
									return;
								});
						});
				} else {
					//console.log('running profile: ', profile.detail.transcripts);
					db.close();
					cb(null, profile);
					return;
				}
				});
		});
};


module.exports.completeRegister = function(req, cb){

	var updateData = {
			type:'student',
			active:true
	};

	db.open('user');
	User.findOneAndUpdate({_id:req.body.id}, updateData, {}, function(err, user){
		db.close();
		if(err){return cb(err, null);}
		return cb(null, user);
	});
};

module.exports.getUserArrayByType = function (type, cb) {
	var list = [];
	
	db.open('user');
	User
		.find({type:type})
		.exec(function(err,users){
			if (err) {cb(err, null);return;}
			
			// search for detail object
			for (var i = 0; i < users.length; i++){
				list.push(users[i].getData());
			}
		    for (i in list){
				UserDetail
					.findOne({_id:list[i].detail})
					.populate('transcripts contact')
					.exec(function(err, details){
						db.close();
						var j = 0;
						if (err) {cb(err, null);return;}
						for (n in users){
							if(details._id.toString() === list[n].detail.toString()){
								list[n].detail = details.getData();
								
								if(n == list.length - 1){
									cb(null, list);
							    	return;			
								}
							}
						}
					});
		    }	
		});
};

/*
module.exports.edit = function (cb) {
	db.open('user', function(err){
		if(err !== undefined){cb(err);}
	});
	
	
	db.close();
};

module.exports.admin = function (cb) {
	db.open('user', function(err){
		
	backURL=req.header('Referer') || '/';
	res.redirect(backURL);{cb(err);}
	});
	
	
	db.close();
};

module.exports.isUser = function (cb) {
	
};
*/
