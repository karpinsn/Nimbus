var container;
var stats;

var startTime;

var camera, scene, renderer, composer;
var sceneScreen, sceneScreenCamera, sceneScreenQuad;

var shaderTextureDisplay, shaderTimeClipper, shaderPhaseCalculator, shaderDepthCalculator, shaderNormalCalculator, shaderFinalRender;
var textureHoloframe, texturePhaseMap, textureFilteredPhaseMap, textureDepthMap, textureNormalMap;
	
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
	
var TEXTURE_WIDTH = 256, TEXTURE_HEIGHT = 256;

// set some camera attributes
var VIEW_ANGLE = 45,
	ASPECT = window.innerWidth / window.innerHeight,
	NEAR = 1,
	FAR = 10000;
	
var loadingIndicatorDiv, loadingIndicator;

var dataLoaded = false;
var renderInit = false;

function showLoading()
{
	loader = {
		width: 100,
		height: 50,
		padding: 10,

		stepsPerFrame: 2,
		trailLength: 1,
		pointDistance: .03,

		strokeColor: '#FF7B24',
		
		step: 'fader',

		multiplier: 2,

		setup: function() {
			this._.lineWidth = 5;
		},

		path: [
			['arc', 10, 10, 10, -270, -90],
			['bezier', 10, 0, 40, 20, 20, 0, 30, 20],
			['arc', 40, 10, 10, 90, -90],
			['bezier', 40, 0, 10, 20, 30, 0, 20, 20]
		]
	};
	loadingIndicator = new Sonic(loader);
	
	//	Make the dialog visible
	var loadingContainer = document.getElementById('NimbusLoadingDialog');
	loadingContainer.style.display = "block";
	
	loadingIndicatorDiv = document.getElementById('NimbusLoaderIndicator');

	
	loadingIndicatorDiv.appendChild(loadingIndicator.canvas);

	loadingIndicator.play();
}

function hideLoading()
{
	//	Hide the indicator
	var loadingContainer = document.getElementById('NimbusLoadingDialog');
	loadingContainer.style.display = "none";
	loadingIndicator.stop();
}
	
function initTextures()
{	
	//	Needed to enable floating point textures
	var gl = renderer.context;
	if (!gl.getExtension("OES_texture_float")) {
	   throw("Requires OES_texture_float extension");
	}
	
	textureHoloframe = new THREE.WebGLRenderTarget(TEXTURE_WIDTH, TEXTURE_HEIGHT, {minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat});
	texturePhaseMap = new THREE.WebGLRenderTarget(TEXTURE_WIDTH, TEXTURE_HEIGHT, {minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat, type: THREE.FloatType});
	textureDepthMap = new THREE.WebGLRenderTarget(TEXTURE_WIDTH, TEXTURE_HEIGHT, {minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat, type: THREE.FloatType});
	textureNormalMap = new THREE.WebGLRenderTarget(TEXTURE_WIDTH, TEXTURE_HEIGHT, {minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat});
}

function initShaders()
{
	var uniformsTextureDisplay = {
		image: {type: "t", 
				value: 0,
				texture: textureHoloframe
				}
	};
	
	shaderTextureDisplay = new THREE.ShaderMaterial({
		uniforms: uniformsTextureDisplay,
		vertexShader: loadShader('./shaders/TextureDisplay.vert'),
		fragmentShader: loadShader('./shaders/TextureDisplay.frag')
	});
	
	//	Retrieve the data to display
	var data = getUrlVars()["data"];
	
	var uniformsTimeClipper = {
		textureOverTime: {type: "t", 
						 value: 0,		
						 texture: THREE.ImageUtils.loadTexture(data, THREE.UVMapping, function(){dataLoaded = true; NimbusInitComplete();})
				},

		deltaTime: 			{type: "f", value: 0.2},
		framesPerSecond: 	{type: "f", value: 30.0},
		cols: 				{type: "f", value: 16.0},
		rows: 				{type: "f", value: 16.0},
		depthWrite: false
	};
	
	shaderTimeClipper = new THREE.ShaderMaterial({
		uniforms: uniformsTimeClipper,
		vertexShader: loadShader('./shaders/TimeClipper.vert'),
		fragmentShader: loadShader('./shaders/TimeClipper.frag')
	});
	
	var uniformsPhaseCalculator = {
		holovideoFrame: {type: "t", 
						 value: 0,
						 texture: textureHoloframe						
				},

		depthWrite: false
	};
	
	shaderPhaseCalculator = new THREE.ShaderMaterial({
		uniforms: uniformsPhaseCalculator,
		vertexShader: loadShader('./shaders/PhaseCalculator.vert'),
		fragmentShader: loadShader('./shaders/PhaseCalculator.frag')
	});
	
	var uniformsDepthCalculator = {
		phaseMap: {type: "t", 
				   value: 0,
				   texture: texturePhaseMap	
				},

		width: {type: "f", value: 256.0},
		depthWrite: false
	};
	
	shaderDepthCalculator = new THREE.ShaderMaterial({
		uniforms: uniformsDepthCalculator,
		vertexShader: loadShader('./shaders/DepthCalculator.vert'),
		fragmentShader: loadShader('./shaders/DepthCalculator.frag')
	});
	
	var uniformsNormalCalculator = {
		depthMap: {type: "t", 
				   value: 0,
				   texture: textureDepthMap	
				},

		width: {type: "f", value: 256.0},
		height: {type: "f", value: 256.0},
		depthWrite: false
	};
	
	shaderNormalCalculator = new THREE.ShaderMaterial({
		uniforms: uniformsNormalCalculator,
		vertexShader: loadShader('./shaders/NormalCalculator.vert'),
		fragmentShader: loadShader('./shaders/NormalCalculator.frag')
	});
	
	var uniformsFinalRender = {
		depthMap: {type: "t", 
				   value: 0,
				   texture: textureDepthMap	
				},

		normalMap: {type: "t", 
				   value: 1,
				   texture: textureNormalMap	
				},
			
		holovideoFrame: {type: "t", 
						 value: 2,
						 texture: textureHoloframe						
				},
			
		depthWrite: false
	};
	
	shaderFinalRender = new THREE.ShaderMaterial({
		uniforms: uniformsFinalRender,
		vertexShader: loadShader('./shaders/FinalRender.vert'),
		fragmentShader: loadShader('./shaders/FinalRender.frag')
	});
}

function initSceneScreen()
{
	sceneScreenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
	sceneScreenCamera.position.z = 1;

	sceneScreen = new THREE.Scene();
	sceneScreenPlane = new THREE.PlaneGeometry(2, 2, 1, 1);
	sceneScreenQuad = new THREE.Mesh(sceneScreenPlane, shaderPhaseCalculator);
	sceneScreenQuad.doubleSided = true;
	sceneScreenQuad.scale.y = -1;
	
	sceneScreen.add(sceneScreenQuad);
	sceneScreen.add(sceneScreenCamera);
}

function NimbusInit()
{
	showLoading();

	// -----------------------------------------------------------------
	// Init renderer
	// -----------------------------------------------------------------
	container = $('#NimbusContext');
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(400, 300);
	renderer.setClearColorHex(0x000000, 1.0);	
	renderer.autoClear = false;
	container.append(renderer.domElement);
	
	// -----------------------------------------------------------------
	// Init stats calculator
	// -----------------------------------------------------------------
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.right = '0px';
	container.append( stats.domElement );
	
	//	Events
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );
	
	// -----------------------------------------------------------------
	// Init textures and shaders
	// -----------------------------------------------------------------		
	initTextures();
	initShaders();
	initSceneScreen();
	
	// -----------------------------------------------------------------
	// Init camera and scene
	// -----------------------------------------------------------------	
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	camera.position.z = 4;
	
	scene = new THREE.Scene();
	var width = 2, height = 2, segmentsWidth = 256, segmentsHeight = 256;
	var mesh = new THREE.Mesh(
	   new THREE.PlaneGeometry(width, height, segmentsWidth, segmentsHeight),
	   shaderFinalRender 
	);

	// add the mesh to the scene
	scene.add(mesh);
	scene.add(camera);
	
	startTime = new Date().getTime();	
	
	renderInit = true;
	NimbusInitComplete();
}

function NimbusInitComplete()
{
	if(dataLoaded && renderInit)
	{
		hideLoading();
	}
}

function onWindowResize( event ) 
{
	//renderer.setSize( window.innerWidth, window.innerHeight );

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

function onDocumentMouseMove(event) 
{
	mouseX = ( event.clientX - windowHalfX ) * 0.01;
	mouseY = ( event.clientY - windowHalfY ) * 0.01;
}

function NimbusRun() 
{
	requestAnimationFrame( NimbusRun );
	render();
}	

function render() 
{
	// Adjust camera
	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
	
	camera.position.x = camera.position.x > 5.0 ? 5.0 : camera.position.x;
	camera.position.x = camera.position.x < -5.0 ? -5.0 : camera.position.x;
	
	camera.position.y = camera.position.y > 3.0 ? 3.0 : camera.position.y;
	camera.position.y = camera.position.y < -3.0 ? -3.0 : camera.position.y;
	
	camera.lookAt( scene.position );


	renderer.clear();	
	shaderTimeClipper.uniforms.deltaTime.value = new Date().getTime() - startTime;
	
	// Pass 0 - Time Clipping
	sceneScreenQuad.material = shaderTimeClipper;
	renderer.render(sceneScreen, sceneScreenCamera, textureHoloframe, true);
	
	// Pass 1 - Phase Calculation
	sceneScreenQuad.material = shaderPhaseCalculator;
	renderer.render(sceneScreen, sceneScreenCamera, texturePhaseMap, true);
	
	// Pass 2 - Depth Calculation
	sceneScreenQuad.material = shaderDepthCalculator;
	renderer.render(sceneScreen, sceneScreenCamera, textureDepthMap, true);
	
	// Pass 3 - Normal Calculation
	sceneScreenQuad.material = shaderNormalCalculator;
	renderer.render(sceneScreen, sceneScreenCamera, textureNormalMap, true);
	
	// Pass 4 - Final Render
	renderer.render(scene, camera);
	
	// Pass Debug - Render texture to screen for debugging
	//sceneScreenQuad.material = shaderTextureDisplay;
	//renderer.render(sceneScreen, sceneScreenCamera);
	
	stats.update();
}