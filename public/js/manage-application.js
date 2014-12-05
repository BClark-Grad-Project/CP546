$(function() {
	$('select').change(function() {
	  var pos = $(this).val();
	  $('#userName').text(data[pos].first + ' ' + data[pos].last);
	  $('#userEmail').text(data[pos].email);
	  $('#userPhone').text(data[pos].detail.contact[0][0].phone);
	  $('#userAddr').text(data[pos].detail.contact[0][0].addr);
	  $('#userAddr2').text(data[pos].detail.contact[0][0].addr_2);
	  $('#userCity').text(data[pos].detail.contact[0][0].city);
	  $('#userState').text(data[pos].detail.contact[0][0].state);
	  $('#userZip').text(data[pos].detail.contact[0][0].zip);
	  $('#userid').val(data[pos].id);
	});
});