Nimbus.HoloWebSocket = function ( textureWidth, textureHeight, data )
{
    var holoframe = new Image();
    var websocket = new WebSocket(data, "Antenna");
	
	    //  Textures used by the Holoimage model
    var textureHoloframe = new THREE.Texture(holoframe);
    websocket.onopen = function()
    {
        return console.log('Connected');
    }

    websocket.onclose = function()
    {
        console.log("Disconnected - Retrying in 4 seconds");
        return setTimeout(websocket.connect, 4 * 1000); 
    }

    websocket.onmessage = function(msg)
    {
        url=window.webkitURL.createObjectURL(msg.data);

        holoframe.onload = function()
        {
			//	Once we update the texture, revoke the URL so it can be reused
			textureHoloframe.onUpdate = function() { window.webkitURL.revokeObjectURL(url); };
			textureHoloframe.needsUpdate = true;
        }

		holoframe.src = url;
    }

    var texturePhaseMap = new THREE.WebGLRenderTarget(
            textureWidth, 
            textureHeight, 
            {	minFilter: THREE.LinearFilter, 
                magFilter: THREE.NearestFilter, 
                format: THREE.RGBFormat, 
                type: THREE.FloatType
            });

    var textureFilteredPhaseMap = new THREE.WebGLRenderTarget(
            textureWidth,
            textureHeight,
            {
                minFilter: THREE.LinearFilter,
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

    var uniformsPhaseFilter = {
        phaseMap: { type: "t",
                    value: texturePhaseMap
                  },
        depthWrite: false
    };

    var shaderPhaseFilter = new THREE.ShaderMaterial({
        uniforms: uniformsPhaseFilter,
        vertexShader: loadShader('./shaders/PhaseFilter.vert'),
        fragmentShader: loadShader('./shaders/PhaseFilter.frag')
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

        normalMap: {type: "t", 
                       value: textureNormalMap	
                   },

        holovideoFrame: {type: "t", 
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

