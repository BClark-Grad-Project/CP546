$(function() {
	$('.dropListBtn').on('click', function () {	    
	    var listValue = $('select[name="teach-class-list"]').val();
	    $('input[name="grab"]').val(listValue);
	    console.log(listValue);
	    $('form[name=teach-class-list]').attr('action','/student/drop').trigger('submit');
	});

	$('.viewHistoryListBtn').on('click', function () {	    
	    var listValue = $('select[name="teach-class-list"]').val();
	    $('input[name="grab"]').val(listValue);
	    
	    $('form[name=teach-class-list]').attr('action','/student/history').trigger('submit');
	    
	});

	$('.dropBtn').on('click', function () {
	    var dropValue = $(this).val();
	    $('input[name="grab"]').val(dropValue);
	    
	    $('form[name=teach-class-list]').attr('action','/student/drop').trigger('submit');
	});
	
	$('.studentsBtn').on('click', function () {
	    var position = $(this).val();
	    console.log(schedule);
	    $('select[name=teach-class-list]').find('option').remove().end();
	    $('select[name=teach-class-list]').empty();
	    
	    $('#student-list-title').empty();
	    $('#student-list-title').append('( ' + schedule[position].course.code + ' )  ' + schedule[position].course.name);
	    for(i in schedule[position].students){
	    	$('select[name=teach-class-list]').append('<option value="' + schedule[position].students[i].id + '">' + schedule[position].students[i].user.first + ' ' + schedule[position].students[i].user.last + '</option>');
	    }
	});
});