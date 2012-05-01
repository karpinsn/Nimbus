$(function() {
	var p = document.createElement('p');
	var q = location.search.match(/email=([^&]*)/);
	if (q.length > 1) {
		$(p).html('The unique id for your session is: ' + q[1]);
	} else {
		$(p).html('Warning: No unique id was created.');
	}
	$('#id-report').append(p);
});