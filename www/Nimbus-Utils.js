/**
 * @author Nik Karpinsky / http://nikkarpinsky.com/
 */

function loadShader(url) 
{
	var shaderSource = '';
	
	$.ajax(
	{
		url: url,
		dataType: 'text',
		success: function(results){shaderSource = results;},
		async:   false
	});
	
	return shaderSource;
}

function getUrlVars() 
{
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}