Nimbus.HoloDepthWebSocket = function ( textureWidth, textureHeight, data )
{
    var holoframe = new Image();
    var websocket = new WebSocket(data, "Antenna-BaseStation");
	
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
                            value: 0,	
							texture: textureHoloframe
                        },

        depthWrite: false
    };

    var shaderPhaseCalculator = new THREE.ShaderMaterial({
        uniforms: uniformsPhaseCalculator,
        vertexShader: loadShader('./shaders/HoloDepth/PhaseCalculator.vert'),
        fragmentShader: loadShader('./shaders/HoloDepth/PhaseCalculator.frag')
    });

    var uniformsDepthCalculator = {
        phaseMap: {type: "t", 
                      value: 0,
                      texture: texturePhaseMap	
                  },

        width: {type: "f", value: textureWidth},
        depthWrite: false
    };

    var shaderDepthCalculator = new THREE.ShaderMaterial({
        uniforms: uniformsDepthCalculator,
        vertexShader: loadShader('./shaders/HoloDepth/DepthCalculator.vert'),
        fragmentShader: loadShader('./shaders/HoloDepth/DepthCalculator.frag')
    });

    var uniformsNormalCalculator = {
        depthMap: { type: "t", 
                      value: 0,
                      texture: textureDepthMap	
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

        // Pass 2 - Depth Calculation
        sceneScreenQuad.material = shaderDepthCalculator;
        renderer.render(sceneScreen, sceneScreenCamera, textureDepthMap, true);

        // Pass 3 - Normal Calculation
        sceneScreenQuad.material = shaderNormalCalculator;
        renderer.render(sceneScreen, sceneScreenCamera, textureNormalMap, true);

        mesh.material = shaderFinalRender;
		shaderFinalRender.wireframe = wireframeDisplay;
		
        // Pass 4 - Final Render
        renderer.render(scene, camera);
    };
};

