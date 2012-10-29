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

Nimbus.ScreenQuad = function()
{
	THREE.Geometry.call( this );
	
	var normal = new THREE.Vector3(0, 0, 1);
	
	//	Add the verticies for the quad
	this.vertices.push(new THREE.Vector3(-1, -1, 0));
	this.vertices.push(new THREE.Vector3(1, -1, 0));
	this.vertices.push(new THREE.Vector3(1, 1, 0));
	this.vertices.push(new THREE.Vector3(-1, 1, 0));
	
	//	Generate the quad face
	var face = new THREE.Face4(0, 1, 2, 3);
	face.normal.copy(normal);
	face.vertexNormals.push(normal.clone(), normal.clone(), normal.clone(), normal.clone());
	
	this.faces.push(face);
	this.faceVertexUvs[0].push( [
		new THREE.UV(0, 0),
		new THREE.UV(1, 0),
		new THREE.UV(1, 1),
		new THREE.UV(0, 1)
	]);
	
	this.computeCentroids();
};

Nimbus.ScreenQuad.prototype = Object.create( THREE.Geometry.prototype );