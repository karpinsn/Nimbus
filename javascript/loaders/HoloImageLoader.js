Nimbus.HoloImage = function ( textureWidth, textureHeight, data )
{
    var textureHoloframe = THREE.ImageUtils.loadTexture(data, THREE.UVMapping, function(){ dataLoaded = true; NimbusInitComplete();});
    
    var texturePhaseMap = new THREE.WebGLRenderTarget(
            textureWidth, 
            textureHeight, 
            {	
                minFilter: THREE.LinearFilter, 
                magFilter: THREE.NearestFilter, 
                format:    THREE.RGBFormat, 
                type:      THREE.FloatType
            });

    var textureFilteredPhaseMap = new THREE.WebGLRenderTarget(
            textureWidth,
            textureHeight,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                format:    THREE.RGBFormat,
                type:      THREE.FloatType
            });

    var textureDepthMap = new THREE.WebGLRenderTarget(
            textureWidth, 
            textureHeight, 
            {	
                minFilter: THREE.LinearFilter, 
                magFilter: THREE.NearestFilter, 
                format:    THREE.RGBFormat, 
                type:      THREE.FloatType
            });

    var textureNormalMap = new THREE.WebGLRenderTarget(
            textureWidth, 
            textureHeight, 
            {	
                minFilter: THREE.LinearFilter, 
                magFilter: THREE.NearestFilter, 
                format:    THREE.RGBFormat
            });

    var uniformsPhaseCalculator = {
        holovideoFrame:    { type: "t", value: textureHoloframe },
        depthWrite:        false
    };

    var shaderPhaseCalculator = new THREE.ShaderMaterial({
        uniforms:       uniformsPhaseCalculator,
        vertexShader:   loadShader('./shaders/PassThrough.vert'),
        fragmentShader: loadShader('./shaders/PhaseCalculator.frag')
    });

    var uniformsPhaseFilter = {
        image:      { type: "t", value: texturePhaseMap },
        width:      { type: "f", value: textureWidth },
        height:     { type: "f", value: textureHeight },
        depthWrite: false
    };

    var shaderPhaseFilter = new THREE.ShaderMaterial({
        uniforms:       uniformsPhaseFilter,
        vertexShader:   loadShader('./shaders/PassThrough.vert'),
        fragmentShader: loadShader('./shaders/PhaseFilter.frag')
    });

    var uniformsDepthCalculator = {
        phaseMap:   { type: "t", value: textureFilteredPhaseMap },
        width:      { type: "f", value: textureWidth },
        depthWrite: false
    };

    var shaderDepthCalculator = new THREE.ShaderMaterial({
        uniforms:       uniformsDepthCalculator,
        vertexShader:   loadShader('./shaders/PassThrough.vert'),
        fragmentShader: loadShader('./shaders/DepthCalculator.frag')
    });

    var uniformsNormalCalculator = {
        depthMap:   { type: "t", value: textureDepthMap	},
        width:      { type: "f", value: textureWidth },
        height:     { type: "f", value: textureHeight },
        depthWrite: false
    };

    var shaderNormalCalculator = new THREE.ShaderMaterial({
        uniforms:       uniformsNormalCalculator,
        vertexShader:   loadShader('./shaders/PassThrough.vert'),
        fragmentShader: loadShader('./shaders/NormalCalculator.frag')
    });

    var uniformsFinalRender = {
        depthMap:       { type: "t", value: textureDepthMap	},
        normalMap:      { type: "t", value: textureNormalMap },
        holovideoFrame: { type: "t", value: textureHoloframe },
        size:           { type: "f", value: 3.0 }, 
        depthWrite:     false
    };

    var shaderFinalRender = new THREE.ShaderMaterial({
        uniforms:       uniformsFinalRender,
        vertexShader:   loadShader('./shaders/FinalRender.vert'),
        fragmentShader: loadShader('./shaders/FinalRender.frag'),
        transparent: true,
        depthWrite: false
    });

    //  Used for offscreen rendering
    var sceneScreenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
    sceneScreenCamera.position.z = 1;

    var sceneScreen      = new THREE.Scene();
    var sceneScreenPlane = new Nimbus.ScreenQuad();
    var sceneScreenQuad  = new THREE.Mesh(sceneScreenPlane, shaderPhaseCalculator);
    sceneScreenQuad.doubleSided = true;

    sceneScreen.add(sceneScreenQuad);
    sceneScreen.add(sceneScreenCamera);  
	
	dataLoaded = true; 
    NimbusInitComplete();
	
    this.draw = function ( scene, camera, mesh )
    {
        // Pass 1 - Phase Calculation
        sceneScreenQuad.material = shaderPhaseCalculator;
        renderer.render(sceneScreen, sceneScreenCamera, texturePhaseMap, true);

        // Pass 2 - Phase Filtering
        sceneScreenQuad.material = shaderPhaseFilter;
        renderer.render(sceneScreen, sceneScreenCamera, textureFilteredPhaseMap, true);

        // Pass 3 - Depth Calculation
        sceneScreenQuad.material = shaderDepthCalculator;
        renderer.render(sceneScreen, sceneScreenCamera, textureDepthMap, true);

        // Pass 4 - Normal Calculation
        sceneScreenQuad.material = shaderNormalCalculator;
        renderer.render(sceneScreen, sceneScreenCamera, textureNormalMap, true);

        mesh.material = shaderFinalRender;
		shaderFinalRender.wireframe = wireframeDisplay;
		
        // Pass 5 - Final Render
        renderer.render(scene, camera);
    };
};

