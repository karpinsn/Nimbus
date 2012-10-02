var Nimbus = Nimbus || { Revision: 2 };

var container;
var stats;

var mesh;
var camera, controls, scene, renderer, composer, controls;
var sceneScreen, sceneScreenCamera, sceneScreenQuad;
var full_screen = 0;


var uiMode = 0;
var bWire = true;

var bHomeTraversal= false;

var incFov;
var incPosition, incRotation, incUp, incTarget;
var HOME_STEPS = 30;
var homeFrame = 0;

var holoimage;
var navCube;

var shaderFinalRender;

var mouse = { x: 0, y: 0 }, INTERSECTED;

// set the scene size
var WIDTH = 800,
    HEIGHT = 600;

var TEXTURE_WIDTH = 256, TEXTURE_HEIGHT = 256;

// set some camera attributes
var VIEW_ANGLE = 45,
    ASPECT = 400 / 300,
    NEAR = .1,
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

function NimbusInit()
{
    showLoading();

    // -----------------------------------------------------------------
    // Init renderer
    // -----------------------------------------------------------------
    $container = $('#NimbusContext');

    renderer = new THREE.WebGLRenderer();

    $container.append(renderer.domElement);

    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColorHex(0x000000, 1.0);	
    renderer.autoClear = false;

    // -----------------------------------------------------------------
    // Init stats calculator
    // -----------------------------------------------------------------
    //stats = new Stats();
    //stats.domElement.style.position = 'absolute';
    //stats.domElement.style.bottom = '0px';
    //stats.domElement.style.right = '0px';
    //$container.append( stats.domElement );

    //	Events
    window.addEventListener( 'resize', onWindowResize, false );

    // -----------------------------------------------------------------
    // Init mesh
    // -----------------------------------------------------------------		
	//	Needed to enable floating point textures
	var gl = renderer.context;
	if (!gl.getExtension("OES_texture_float")) {
		throw("Requires OES_texture_float extension");
	}
	
	//	Retrieve the data to display
	var data = getUrlVars()["data"];
	//holoimage = new Nimbus.HoloClip(TEXTURE_WIDTH, TEXTURE_HEIGHT, data);
	holoimage = new Nimbus.DitherHoloClip(TEXTURE_WIDTH, TEXTURE_HEIGHT, data);
	
	navCube = new Nimbus.Navcube();
	navCube.init();
	
    // -----------------------------------------------------------------
    // Init camera
    // -----------------------------------------------------------------	
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.z = 4;

    // -----------------------------------------------------------------
    // Init controls
    // -----------------------------------------------------------------
    controls = new THREE.TrackballControls2( camera, renderer.domElement, this );

    controls.target.set( 0, 0, 0 );
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.5;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [ 65, 83, 68 ];

    // -----------------------------------------------------------------
    // Init scene
    // -----------------------------------------------------------------		
    scene = new THREE.Scene();
    var width = 2, height = 2, segmentsWidth = 256, segmentsHeight = 256, depth = 2;
    mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(width, height, segmentsWidth, segmentsHeight),
            shaderFinalRender 
            );

    // add the mesh to the scene
    scene.add(mesh);

    scene.add(camera);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColorHex(0x000000, 1.0);		

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
    width = WIDTH;
    height = HEIGHT;

    renderer.setSize( width, height );

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    controls.screen.width = width;
    controls.screen.height = height;

    camera.radius = ( width + height ) / 4;
 
	navCube.windowResize();
}

function doPan() {
    $("#toolPan").addClass("toolSelected");
    $("#toolRotate").removeClass("toolSelected");
    $("#toolZoomIn").removeClass("toolSelected");
    $("#toolZoomOut").removeClass("toolSelected");
    controls.setPan();
    $("#toolPan").toggleClass("toolSelected");
    uiMode = 1;

} 

function doRotate() {
    $("#toolPan").removeClass("toolSelected");
    $("#toolRotate").addClass("toolSelected");
    $("#toolZoomIn").removeClass("toolSelected");
    $("#toolZoomOut").removeClass("toolSelected");
    controls.setRotate();
    $("#toolRotate").toggleClass("toolSelected");
    uiMode = 0;
} 

function doZoomIn() {
    $("#toolPan").removeClass("toolSelected");
    $("#toolRotate").removeClass("toolSelected");
    $("#toolZoomIn").addClass("toolSelected");
    $("#toolZoomOut").removeClass("toolSelected");
    controls.setZoom();
    $("#toolZoomIn").toggleClass("toolSelected");
    uiMode = 2;
} 

function gotoHome() {

    if ( bHomeTraversal == false ) {
        bHomeTraversal = true;

        incFov = (45.0 - VIEW_ANGLE) / HOME_STEPS;

        incPosition = new THREE.Vector3();
        incRotation = new THREE.Vector3();
        incUp       = new THREE.Vector3();
        incTarget       = new THREE.Vector3();


        incPosition.x = -camera.position.x / HOME_STEPS;
        incPosition.y = -camera.position.y / HOME_STEPS;
        incPosition.z = (4.0-camera.position.z) / HOME_STEPS;

        incRotation.x = -camera.rotation.x / HOME_STEPS;
        incRotation.y = -camera.rotation.y / HOME_STEPS;
        incRotation.z = -camera.rotation.z / HOME_STEPS;

        incRotation.x = -camera.rotation.x / HOME_STEPS;
        incRotation.y = -camera.rotation.y / HOME_STEPS;
        incRotation.z = -camera.rotation.z / HOME_STEPS;

        incUp.x = -camera.up.x / HOME_STEPS;
        incUp.y = 1-camera.up.y / HOME_STEPS;
        incUp.z = -camera.up.z / HOME_STEPS;

        incTarget.x = -controls.target.x / HOME_STEPS;
        incTarget.y = -controls.target.y / HOME_STEPS;
        incTarget.z = -controls.target.z / HOME_STEPS;
    }

}

function updateHomeTraversal() {
    if ( bHomeTraversal == true ) {
        camera.fov = VIEW_ANGLE + incFov * homeFrame++;

        camera.position.x += incPosition.x;
        camera.position.y += incPosition.y;
        camera.position.z += incPosition.z;

        camera.rotation.x += incRotation.x;
        camera.rotation.y += incRotation.y;
        camera.rotation.z += incRotation.z;

        camera.up.x += incUp.x;
        camera.up.y += incUp.y;
        camera.up.z += incUp.z;

        controls.target.x += incTarget.x;
        controls.target.y += incTarget.y;
        controls.target.z += incTarget.z;		
        //controls.target.set(0,0,0);	
        camera.updateProjectionMatrix();
        if ( homeFrame > HOME_STEPS) {
            bHomeTraversal = false;
            VIEW_ANGLE = camera.fov;
            homeFrame = 0;
        }	
    }
}

function doZoomOut() {
    $("#toolPan").removeClass("toolSelected");
    $("#toolRotate").removeClass("toolSelected");
    $("#toolZoomIn").removeClass("toolSelected");
    $("#toolZoomOut").addClass("toolSelected");
} 

function doWireframe() {
    $("#toolWireframe").toggleClass("toolSelected");
    bWire = !bWire;
} 

function glowOn(d) {
    var name = "#" + d.id.toString();
    $(name).toggleClass("toolSelected");
    $(name).addClass("toolHover");
}

function glowOff(d) {
    var name = "#" + d.id.toString();
    $(name).toggleClass("toolSelected");
    $(name).removeClass("toolHover");
}

function glowOnHome(d) {
    var name = "#" + d.id.toString();
    $(name).addClass("homeHover");
}

function glowOffHome(d) {
    var name = "#" + d.id.toString();
    $(name).removeClass("homeHover");
}

function requestFullScreen(el) {
    // Supports most browsers and their versions.
    var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(el);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function cancelFullScreen() {
    if ($.browser.mozilla) {
        document.mozCancelFullScreen();
    } else if ($.browser.safari || $.browser.chrome) {
        document.webkitCancelFullScreen();
    }
}

document.addEventListener("mozfullscreenchange", function () {
    if (document.mozFullScreen == false) {
        full_screen = 1;
        myfullscreen('1');
        $("#toolFullscreen").toggleClass("toolSelected");
    }
}, false);

document.addEventListener("webkitfullscreenchange", function () {
    if (document.webkitIsFullScreen == false) {
        full_screen = 1;
        myfullscreen('1');
    }
    $("#toolFullscreen").toggleClass("toolSelected");
}, false);


function myfullscreen( value )
{
    if (full_screen == 0) {
        requestFullScreen(document.getElementById("NimbusContext"));
        WIDTH = screen.width;
        HEIGHT = screen.height;
        $container.css("width", WIDTH);
        $container.css("height", HEIGHT);
        renderer.setSize( WIDTH, HEIGHT);

        camera.updateProjectionMatrix();

        $('#toolContainer').css("position","absolute");
        $('#toolContainer').css("width","45");
        $('#toolContainer').css("left",(WIDTH - 55).toString() + "px");


        $('#navCube').css("left", (WIDTH - 175).toString() + "px");
        $('#navCube').css("top", "-70px");
        $('#NimbusContext').css("margin-top","0px");

        $('#gotoHome').css("left", (WIDTH - 110).toString() + "px");
        $('#gotoHome').css("top", "15px");

        $('#autodeskattrib').css("left", (WIDTH - 110).toString() + "px");
        $('#autodeskattrib').css("top", (HEIGHT - 50).toString() + "px");


        $('#nimbusattrib').css("top", (HEIGHT - 50).toString() + "px");
        $('#iowaattrib').css("top", (HEIGHT - 50).toString() + "px");

        $('#toolFullscreen').addClass("toolFullscreenSelected");

        full_screen = 1;

    } else {
        cancelFullScreen();
        WIDTH = 800;
        HEIGHT = 600;
        $container.css("width", 800);
        $container.css("height", 600);
        renderer.setSize( WIDTH, HEIGHT);

        $('#NimbusContext').css("margin-top","80px");
        $('#navCube').css("left", "625px");
        $('#navCube').css("top", "180px");
        $('#gotoHome').css("left", "690px");
        $('#gotoHome').css("top", "265px");	   
        $('#toolContainer').css("position","absolute");
        $('#toolContainer').css("width","45");
        $('#toolContainer').css("left","747px");

        $('#autodeskattrib').css("left", "701px");
        $('#autodeskattrib').css("top", "828px");

        $('#nimbusattrib').css("top", "825px");
        $('#iowaattrib').css("top", "825px");
        $('#toolFullscreen').removeClass("toolFullscreenSelected");
        full_screen = 0;

        camera.aspect = 800 / 600;
        camera.updateProjectionMatrix();
    }
}

function NimbusRun() 
{
    requestAnimationFrame( NimbusRun );
    render();
}	

function render() 
{	
    controls.update();	
    updateHomeTraversal();

    renderer.clear();	

    holoimage.draw(scene, camera, mesh);
	navCube.render(camera);

    // Pass Debug - Render texture to screen for debugging
    //sceneScreenQuad.material = shaderTextureDisplay;
    //renderer.render(sceneScreen, sceneScreenCamera);
    //stats.update();
}
