$(document).ready(function(){
	function toggleSubmit(form, toggle){
		$(form + ' button[type=submit]').disable(toggle);
	}	
	$('#edit-profile-form :input[name=gender]').val(data.detail.gender);	
	$('#edit-profile-form :input[name=auth_type]').val(data.user.type);	
	// Contact state field propagate. 
	for(var i in data.contact){
		$('#edit-profile-form select[name=state'+ data.contact[i].type +']').val(data.contact[i].state);
	}
	toggleSubmit('#edit-profile-form', true);
	

	// Register Form Validation
	var validateUserFields = {
			realname: function(){
				var first = $('input[name=first]').val() == data.detail.first;
				var middle = $('input[name=middle]').val() == data.detail.middle;
				var last = $('input[name=last]').val() == data.detail.last;
				
				if(!first){
					return false;
				}
				if(!middle){
					return false;
				} 
				if(!last){
					return false;
				} 				
				return true;
			},
			phone:function(){
				for(var i in data.contact.length){
					var phone   = $('input[name=phone' + data.contact[i].type + ']').val() == data.contact[i].phone;
					var ext     = $('input[name=ext' + data.contact[i].type + ']').val() == data.contact[i].ext;
					var carrier = $('input[name=carrier' + data.contact[i].type + ']').val() == data.contact[i].carrier;

					if(!phone){
						return false;
					} 
					if(!ext){
						return false;
					} 
					if(!carrier){
						return false;
					} 
					return true;
				}
			},
			addrLine: function(){
				for(var i in data.contact.length){
					var addr = $('input[name=addr' + data.contact[i].type + ']').val();
					if(addr){
						addr = addr == data.contact[i].addr;
						if(!addr){
							return false;
						}
					} 
					var addr_2 = $('input[name=addr_2' + data.contact[i].type + ']').val();
					if(addr_2){
						addr_2 = addr_2 == data.contact[i].addr_2;
						if(!addr_2){
							return false;
						}
					}
					return true;
				}
			},
			city: function(){
				for(var i in data.contact.length){
					var city = $('input[name=ext' + data.contact[i].type + ']').val() == data.contact[i].city;

					if(!city){
						return false;
					} 
					return true;
				}
			},
			state: function(){
				for(var i in data.contact.length){
					var state = $('input[name=state' + data.contact[i].type + ']').val() == data.contact[i].state;
					
					if(!state){
						return false;
					} 
					return true;
				}
			},
			zip: function(){
				for(var i in data.contact.length){
					var zip = $('input[name=zip' + data.contact[i].type + ']').val() == data.contact[i].zip;

					if(!zip){
						return false;
					} 
					return true;
				}
			},
			birth: function(){
				var birth = $('input[name=birth]').val() == data.detail.birth;

				if(!birth){
					return false;
				} 
				return true;
			},
			gender: function(){
				var gender = $('input[name=gender]').val() == data.detail.gender;

				if(!gender){
					return false;
				} 
				return true;
			},
			type: function(){
				var type = $('input[name=auth_type]').val() == data.user.type;

				if(!type){
					return false;
				} 
				return true;
			},
			active: function(){
				var active = $('input[name=auth_active]').val() == data.user.active;

				if(!active){
					return false;
				} 
				return true;
			}
	};

	$(':input[name=first], :input[name=middle], :input[name=last]').on('keyup change', function(){
		var userName = validateUserFields.realname();
		if(userName){
			toggleSubmit('#edit-profile-form', true);
		} else {
			toggleSubmit('#edit-profile-form', false);
		}
	});

	$('input[name=phonehome], input[name=phoneoffice], input[name=phonemobile], input[name=extoffice], input[name=carriermobile]').on('keyup change', function(){
		var phone = validateUserFields.phone();
		if(phone){
			toggleSubmit('#edit-profile-form', true);
		} else {
			toggleSubmit('#edit-profile-form', false);
		}
	});

	$(':input[name=addrhome], :input[name=addroffice], :input[name=addr_2home], :input[name=addr_2office]').on('keyup change', function(){
		var addr = validateUserFields.addrLine();
		if(addr){
			toggleSubmit('#edit-profile-form', true);
		} else {
			toggleSubmit('#edit-profile-form', false);
		}
	});
	$(':input[name=zipoffice], :input[name=ziphome]').on('keyup change', function(){
		var zip = validateUserFields.zip();
		if(zip){
			toggleSubmit('#edit-profile-form', true);
		} else {
			toggleSubmit('#edit-profile-form', false);
		}
	});
	$(':input[name=statehome], :input[name=stateoffice]').on('keyup change', function(){
		var state = validateUserFields.state();
		if(state){
			toggleSubmit('#edit-profile-form', true);
		} else {
			toggleSubmit('#edit-profile-form', false);
		}
	});
	$(':input[name=cityhome], :input[name=cityoffice]').on('keyup change', function(){
		var city = validateUserFields.city();
		if(city){
			toggleSubmit('#edit-profile-form', true);
		} else {
			toggleSubmit('#edit-profile-form', false);
		}
	});
	$(':input[name=birth]').on('keyup change', function(){
		var birth = validateUserFields.birth();
		if(birth){
			toggleSubmit('#edit-profile-form', true);
		} else {
			toggleSubmit('#edit-profile-form', false);
		}
	});
	$(':input[name=gender]').on('keyup change', function(){
		var gender = validateUserFields.gender();
		if(gender){
			toggleSubmit('#edit-profile-form', true);
		} else {
			toggleSubmit('#edit-profile-form', false);
		}
	});
	$(':input[name=auth_active]').on('keyup change', function(){
		var active = validateUserFields.active();
		if(active){
			toggleSubmit('#edit-profile-form', true);
		} else {
			toggleSubmit('#edit-profile-form', false);
		}
	});
	$(':input[name=auth_type]').on('keyup change', function(){
		var type = validateUserFields.type();
		if(type){
			toggleSubmit('#edit-profile-form', true);
		} else {
			toggleSubmit('#edit-profile-form', false);
		}
	});
});