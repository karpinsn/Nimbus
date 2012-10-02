Nimbus.Navcube = function()
{
    var navscene;
    var navrenderer = new THREE.WebGLRenderer();
    var navcam = new THREE.PerspectiveCamera(VIEW_ANGLE, 1, NEAR, FAR);
    navcam.position.z = 14;
 
    var navcontrols = new THREE.TrackballControls( navcam, navrenderer.domElement );
    navcontrols.rotateSpeed = 0.5;

    navcontrols.noZoom = true;
    navcontrols.noPan = true;
    navcontrols.noRotate = true;

    navcontrols.staticMoving = false;
    navcontrols.rotateSpeed = 1.0;
    navcontrols.dynamicDampingFactor = 0.3;

    navcontrols.minDistance = 1 * 1.1;
    navcontrols.maxDistance = 1 * 100;

    var NAV_WIDTH = 256;
    var NAV_HEIGHT = 256;

    navrenderer.setSize(NAV_WIDTH, NAV_HEIGHT);
    navrenderer.autoClear = false;
}

var init = function()
{
    $navCube = $('#navCube');
    $navCube.append(navrenderer.domElement);
}
 
    navscene = new THREE.Scene();
    var navmaterial = new THREE.MeshNormalMaterial({shading: THREE.SmoothShading, transparemt: true});
    var navmesh = new THREE.Mesh(
            new THREE.CubeGeometry(width, height, depth), navmaterial
            );		
    //////////////////
    var navmaterials = [];
    for (var i=0; i<6; i++) {
        var img = new Image();
        img.src = i + '.png';
        var tex = new THREE.Texture(img);
        img.tex = tex;
        img.onload = function() {
            this.tex.needsUpdate = true;
        };
        var mat = new THREE.MeshBasicMaterial({color: 0xffffff, map: tex});
        navmaterials.push(mat);
    }
    var cubeGeo = new THREE.CubeGeometry(width,height,depth,1,1,1, navmaterials);
    var cube = new THREE.Mesh(cubeGeo, new THREE.MeshFaceMaterial());	
    navscene.add(cube);
    navscene.add(navcam);
    navrenderer.setSize(NAV_WIDTH, NAV_HEIGHT);
    navrenderer.setClearColorHex(0x000000, 0.0);	


function onwindowresize( event ) 
{
    width = width;
    height = height;

    renderer.setsize( width, height );

    camera.aspect = width / height;
    camera.updateprojectionmatrix();

    controls.screen.width = width;
    controls.screen.height = height;

    camera.radius = ( width + height ) / 4;
 
    navrenderer.setsize(nav_width,nav_height);
    navcam.aspect = 1;
    navcam.updateProjectionMatrix();
    navcam.radius = ( 200 ) / 4;	
}


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

function render() 
{	
    controls.update();	
    updateHomeTraversal();

    navcam.position.x = camera.position.x;
    navcam.position.y = camera.position.y;
    navcam.position.z = camera.position.z;

    navcam.position.normalize().multiplyScalar(14);
    navcam.rotation.x = camera.rotation.x;
    navcam.rotation.y = camera.rotation.y;
    navcam.rotation.z = camera.rotation.z;

    navcam.up.x = camera.up.x;
    navcam.up.y = camera.up.y;		
    navcam.up.z = camera.up.z;		

    navcam.updateProjectionMatrix();
    navcontrols.target.set( 0, 0, 0 );
    navcontrols.update();

    renderer.clear();	
    navrenderer.clear();

    holoimage.draw(scene, camera, mesh);
    navrenderer.render( navscene, navcam );			

    // Pass Debug - Render texture to screen for debugging
    //sceneScreenQuad.material = shaderTextureDisplay;
    //renderer.render(sceneScreen, sceneScreenCamera);
    //stats.update();
}
