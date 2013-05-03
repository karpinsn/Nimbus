$('#consent-form button').attr('disabled', 'true').click(function(e) {
	if ('true' === $(this).attr('disabled')) {
		e.preventDefault();
		return false;
	}
	return true;
});

var validate = function() {
	if ($('#consent-form #email').val().match(/^[^@\s]+@[^@\s]+\.[^@.\s]{2,5}$/) && $('#consent-form #agree:checked').length) $('#consent-form button').removeAttr('disabled');
	else $('#consent-form button').attr('disabled', 'true');
}

$('#consent-form #email').keyup(validate);
$('#consent-form #agree').change(validate);

$('#consent-form').submit(function(e) {
	var valid = true;
	var errorMessage = document.createElement('p');
	$(errorMessage).attr('id', 'error').attr('class', 'error');
	if (!$('#consent-form #email').val().match(/^[^@\s]+@[^@\s]+\.[^@.\s]{2,5}$/)) {
		valid = false;
		$(errorMessage).append('Please enter a valid email address. ');
	}
	if (!$('#consent-form #agree:checked').length) {
		valid = false;
		$(errorMessage).append('You must read and agree to the Model Release before proceeding. ');
	}
	if (!valid) {
		$('#consent-form #error').remove();
		$('#consent-form').append(errorMessage);
		e.preventDefault();
	}
	return valid;
});