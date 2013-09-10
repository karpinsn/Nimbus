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
		new THREE.Vector2(0, 0),
		new THREE.Vector2(1, 0),
		new THREE.Vector2(1, 1),
		new THREE.Vector2(0, 1)
	]);
	
	this.computeCentroids();
};

Nimbus.ScreenQuad.prototype = Object.create( THREE.Geometry.prototype );

Nimbus.GaussFilter = function( kernelSize, filterUniforms )
{
	THREE.Material.call( this );

	this.fragmentShader = "void main() {}";
	this.vertexShader = "void main() {}";
	this.uniforms = {};
	this.defines = {};
	this.attributes = null;

	this.shading = THREE.SmoothShading;

	this.linewidth = 1;

	this.wireframe = false;
	this.wireframeLinewidth = 1;

	this.fog = false; // set to use scene fog

	this.lights = false; // set to use scene lights

	this.vertexColors = THREE.NoColors; // set to use "color" attribute stream

	this.skinning = false; // set to use skinning attribute streams

	this.morphTargets = false; // set to use morph targets
	this.morphNormals = false; // set to use morph normals

  // Build up the vertex and fragment shaders
  // Gauss Coefficients
  var coefficients = new Array( );
  var sum = 0;
  var sigma = kernelSize / 3;
  for( var i = 0; i < kernelSize; ++i )
  {
      offset = i - ( ( kernelSize - 1) / 2 );
      coefficients[i] = Math.exp(-1.0 * (offset * offset) / (2.0 * sigma * sigma));
      sum += coefficients[i];
  }
  // Quick normalization
  for ( var i = 0; i < kernelSize; ++i)
  {
      coefficients[i] /= sum;
  }

  // Vertex Program
  var vertProgram = "precision highp float;\n\n";
  vertProgram += "uniform float width;\n";
  vertProgram += "uniform float height;\n";
  vertProgram += "uniform bool horizontalFilter;\n\n";
  vertProgram += "varying vec2 fragTexCoordOffset[" + kernelSize + "];\n\n";
  vertProgram += "float step_w = 1.0 / width * float(horizontalFilter);\n";
  vertProgram += "float step_h = 1.0 / height * float(!horizontalFilter);\n\n";
  vertProgram += "void main(void)\n";
  vertProgram += "{\n";
  for( var i = 0; i < coefficients.length; ++i )
  {
      var offset = i - ( ( kernelSize - 1 ) / 2 );
      vertProgram += "\t fragTexCoordOffset[" + i + "] = ";
      vertProgram += "uv + vec2(" + (offset).toFixed(1) + " * step_w, " + (offset).toFixed(1) + " * step_h);\n";
  }

  vertProgram += "\tgl_Position = vec4(position, 1.0);\n";
  vertProgram += "}";

  // Fragment Program
  var fragmentProgram = "precision highp float;\n\n";
  fragmentProgram += "uniform sampler2D image;\n\n";
  fragmentProgram += "varying vec2 fragTexCoordOffset[" + kernelSize + "];\n";
  fragmentProgram += "void main(void)\n";
  fragmentProgram += "{\n";
  fragmentProgram += "\tvec4 filteredImage = vec4(0.0);\n";
  for( var i = 0; i < coefficients.length; ++i )
  {
      fragmentProgram += "\tfilteredImage += texture2D(image, ";
      fragmentProgram += "fragTexCoordOffset[" + i + "]) * ";
      fragmentProgram += coefficients[i] + ";\n";
  }
  fragmentProgram += "\tgl_FragColor = filteredImage;\n";
  fragmentProgram += "}\n";

  var params = {
      uniforms: filterUniforms,
      fragmentShader: fragmentProgram,
      vertexShader: vertProgram
  };
  this.setValues( params );
}

Nimbus.GaussFilter.prototype = Object.create( THREE.ShaderMaterial.prototype );
