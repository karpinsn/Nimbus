Nimbus.DitherHoloimageTimeClip = function ( textureWidth, textureHeight, data )
{
	//  Textures used by the Holoimage model
	var texturePackedHoloframe = new Three.WebGLRenderTarget(
		textureWidth,
		textureHeight,
		{	minFilter: THREE.LinearFilter, 
			magFilter: THREE.NearestFilter, 
			format: THREE.RGBFormat
		});
	
	var textureDitheredHoloframe = new Three.WebGLRenderTarget(
		textureWidth,
		textureHeight,
		{	minFilter: THREE.LinearFilter, 
			magFilter: THREE.NearestFilter, 
			format: THREE.RGBFormat
		});
		
	var textureSmoothedHoloframe = new Three.WebGLRenderTarget(
		textureWidth,
		textureHeight,
		{	minFilter: THREE.LinearFilter, 
			magFilter: THREE.NearestFilter, 
			format: THREE.RGBFormat
		});	

    var textureHoloframe = new THREE.WebGLRenderTarget(
		textureWidth, 
		textureHeight, 
		{	minFilter: THREE.LinearFilter, 
			magFilter: THREE.NearestFilter, 
			format: THREE.RGBFormat
		});
		
    var texturePhaseMap = new THREE.WebGLRenderTarget(
		textureWidth, 
		textureHeight, 
		{	minFilter: THREE.LinearFilter, 
			magFilter: THREE.NearestFilter, 
			format: THREE.RGBFormat, 
			type: THREE.FloatType
		});
		
	var textureDepthMap = new THREE.WebGLRenderTarget(
		textureWidth, 
		textureHeight, 
		{	minFilter: THREE.LinearFilter, 
			magFilter: THREE.NearestFilter, 
			format: THREE.RGBFormat, 
			type: THREE.FloatType
		});
	
	var textureNormalMap = new THREE.WebGLRenderTarget(
		textureWidth, 
		textureHeight, 
		{	minFilter: THREE.LinearFilter, 
			magFilter: THREE.NearestFilter, 
			format: THREE.RGBFormat
		});

	var uniformsTimeClipper = {
		textureOverTime: {	type: "t", 
							value: 0,		
							texture: THREE.ImageUtils.loadTexture(data, THREE.UVMapping, function(){dataLoaded = true; NimbusInitComplete();})
						 },

		deltaTime: 			{type: "f", value: 0.2},
		framesPerSecond: 	{type: "f", value: 30.0},
		cols: 				{type: "f", value: 16.0},
		rows: 				{type: "f", value: 16.0},
		depthWrite: false
	};
	
	var shaderTimeClipper = new THREE.ShaderMaterial({
		uniforms: uniformsTimeClipper,
		vertexShader: loadShader('./shaders/TimeClipper.vert'),
		fragmentShader: loadShader('./shaders/TimeClipper.frag')
	});

	var uniformsGaussianFilterH = {
		holovideoFrame: {	type: "t",
							value: 0,
							texture: texturePackedHoloframe
						},
						
		depthWrite: false
	};
	
	var shaderGaussianFilterH = new THREE.ShaderMaterial({
		uniforms: uniformsGaussianFilterH,
		vertexShader: loadShader('./shaders/Gaussian5x5Horizontal.vert'),
		fragmentShader: loadShader('./shaders/Gaussian5x5.frag')
	});
	
	var uniformsGaussianFilterV = {
		holovideoFrame: {	type: "t",
							value: 0,
							texture: textureSmoothedHoloframe
						},
						
		depthWrite: false
	};
	
	var shaderGaussianFilterH = new THREE.ShaderMaterial({
		uniforms: uniformsGaussianFilterH,
		vertexShader: loadShader('./shaders/Gaussian5x5Vertical.vert'),
		fragmentShader: loadShader('./shaders/Gaussian5x5.frag')
	});
	
	var uniformsPhaseCalculator = {
		holovideoFrame: {	type: "t", 
							value: 0,
							texture: textureHoloframe						
						},

		depthWrite: false
	};

	var shaderPhaseCalculator = new THREE.ShaderMaterial({
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

	var shaderDepthCalculator = new THREE.ShaderMaterial({
		uniforms: uniformsDepthCalculator,
		vertexShader: loadShader('./shaders/DepthCalculator.vert'),
		fragmentShader: loadShader('./shaders/DepthCalculator.frag')
	});
	
	var uniformsNormalCalculator = {
		depthMap: { type: "t", 
					value: 0,
					texture: textureDepthMap	
				  },

		width: {type: "f", value: 256.0},
		height: {type: "f", value: 256.0},
		depthWrite: false
	};

	var shaderNormalCalculator = new THREE.ShaderMaterial({
		uniforms: uniformsNormalCalculator,
		vertexShader: loadShader('./shaders/NormalCalculator.vert'),
		fragmentShader: loadShader('./shaders/NormalCalculator.frag')
	});
    
    var uniformsFinalRender = {
		depthMap: {	type: "t", 
					value: 0,
					texture: textureDepthMap	
				  },

		normalMap: {	type: "t", 
						value: 1,
						texture: textureNormalMap	
				   },

		holovideoFrame: {	type: "t", 
							value: 2,
							texture: textureHoloframe						
						},

		depthWrite: false
	};

	var shaderFinalRender = new THREE.ShaderMaterial({
		uniforms: uniformsFinalRender,
		vertexShader: loadShader('./shaders/FinalRender.vert'),
		fragmentShader: loadShader('./shaders/FinalRender.frag')
	});

    //  Used for offscreen rendering
	var sceneScreenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
	sceneScreenCamera.position.z = 1;
		
	var sceneScreen = new THREE.Scene();
	var sceneScreenPlane = new THREE.PlaneGeometry(2, 2, 1, 1);
	var sceneScreenQuad = new THREE.Mesh(sceneScreenPlane, shaderPhaseCalculator);
	sceneScreenQuad.doubleSided = true;
	sceneScreenQuad.scale.y = -1;

	sceneScreen.add(sceneScreenQuad);
	sceneScreen.add(sceneScreenCamera);  

    //  Used for time clipping (animation)
    var startTime = new Date().getTime();

    this.draw = function ( scene, camera, mesh )
    {
        shaderTimeClipper.uniforms.deltaTime.value = new Date().getTime() - startTime;

        // Pass 0 - Time Clipping
        sceneScreenQuad.material = shaderTimeClipper;
        renderer.render(sceneScreen, sceneScreenCamera, texturePackedHoloframe, true);

		// Pass 1 - Horizontal Gaussian
		sceneScreenQuad.material = shaderGaussianFilterH;
		renderer.render(sceneScreen, sceneScreenCamera, textureSmoothedHoloframe, true);
		
		// Pass 2 - Vertical Gaussian
		sceneScreenQuad.material = shaderGaussianFilterV;
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

		mesh.material = shaderFinalRender;
		
        // Pass 4 - Final Render
        renderer.render(scene, camera);
    };
};

