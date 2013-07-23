Nimbus.DitherHoloClip = function ( textureWidth, textureHeight, data )
{
    //  Textures used by the Holoimage model
    var texturePackedHoloframe = new THREE.WebGLRenderTarget(
            textureWidth,
            textureHeight,
            {	minFilter: THREE.LinearFilter, 
                magFilter: THREE.NearestFilter, 
        format: THREE.RGBFormat
            });

    var textureDitheredHoloframe = new THREE.WebGLRenderTarget(
            textureWidth,
            textureHeight,
            {	minFilter: THREE.LinearFilter, 
                magFilter: THREE.NearestFilter, 
        format: THREE.RGBFormat
            });

    var textureSmoothedHoloframe = new THREE.WebGLRenderTarget(
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
                             value: THREE.ImageUtils.loadTexture(data, THREE.UVMapping, function(){dataLoaded = true; NimbusInitComplete();})
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
        width: {type: "f", value: textureWidth},
               height: {type: "f", value: textureHeight},
                       image: {	type: "t",
                                           value: texturePackedHoloframe
                                       },
                           depthWrite: false
    };

    var shaderGaussianFilterH = new THREE.ShaderMaterial({
        uniforms: uniformsGaussianFilterH,
        vertexShader: loadShader('./shaders/Gaussian5x5Horizontal.vert'),
        fragmentShader: loadShader('./shaders/Gaussian5x5.frag')
    });

    var uniformsGaussianFilterV = {
        width: {type: "f", value: textureWidth},
               height: {type: "f", value: textureHeight},
                       image: {	type: "t",
                                           value: textureSmoothedHoloframe
                                       },

                           depthWrite: false
    };

    var shaderGaussianFilterV = new THREE.ShaderMaterial({
        uniforms: uniformsGaussianFilterV,
        vertexShader: loadShader('./shaders/Gaussian5x5Vertical.vert'),
        fragmentShader: loadShader('./shaders/Gaussian5x5.frag')
    });

    var uniformsPhaseCalculator = {
        holovideoFrame: {	type: "t", 
                            value: textureHoloframe						
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
                      value: texturePhaseMap	
                  },

        width: {type: "f", value: textureWidth},
        depthWrite: false
    };

    var shaderDepthCalculator = new THREE.ShaderMaterial({
        uniforms: uniformsDepthCalculator,
        vertexShader: loadShader('./shaders/DepthCalculator.vert'),
        fragmentShader: loadShader('./shaders/DepthCalculator.frag')
    });

    var uniformsNormalCalculator = {
        depthMap: { type: "t", 
                      value: textureDepthMap	
                  },

        width: {type: "f", value: textureWidth},
        height: {type: "f", value: textureHeight},
        depthWrite: false
    };

    var shaderNormalCalculator = new THREE.ShaderMaterial({
        uniforms: uniformsNormalCalculator,
        vertexShader: loadShader('./shaders/NormalCalculator.vert'),
        fragmentShader: loadShader('./shaders/NormalCalculator.frag')
    });

    var uniformsFinalRender = {
        depthMap: {	type: "t", 
                      value: textureDepthMap	
                  },

        normalMap: {	type: "t", 
                       value: textureNormalMap	
                   },

        holovideoFrame: {	type: "t", 
                            value: textureHoloframe						
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
    var sceneScreenPlane = new Nimbus.ScreenQuad();
	var sceneScreenQuad = new THREE.Mesh(sceneScreenPlane, shaderPhaseCalculator);
    sceneScreenQuad.doubleSided = true;

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

        // Pass 3 - Phase Calculation
        sceneScreenQuad.material = shaderPhaseCalculator;
        renderer.render(sceneScreen, sceneScreenCamera, texturePhaseMap, true);

        // Pass 4 - Depth Calculation
        sceneScreenQuad.material = shaderDepthCalculator;
        renderer.render(sceneScreen, sceneScreenCamera, textureDepthMap, true);

        // Pass 5 - Normal Calculation
        sceneScreenQuad.material = shaderNormalCalculator;
        renderer.render(sceneScreen, sceneScreenCamera, textureNormalMap, true);

        mesh.material = shaderFinalRender;
		shaderFinalRender.wireframe = wireframeDisplay;
		
        // Pass 6 - Final Render
        renderer.render(scene, camera);
    };
};

