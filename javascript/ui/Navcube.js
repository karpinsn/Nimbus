Nimbus.Navcube = function()
{
    var navscene;
    var navrenderer = new THREE.WebGLRenderer();
    var navcam = new THREE.PerspectiveCamera(VIEW_ANGLE, 1, NEAR, FAR);
	var width = 2;
	var height = 2;
	var depth = 2;
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

	this.init = function()
	{
		$navCube = $('#navCube');
		$navCube.append(navrenderer.domElement);
	 
		navscene = new THREE.Scene();
		var navmaterial = new THREE.MeshNormalMaterial({shading: THREE.SmoothShading, transparemt: true});
		var navmesh = new THREE.Mesh(
				new THREE.CubeGeometry(width, height, depth), navmaterial
				);		
				
		//////////////////
		var navmaterials = [];
		for (var i=0; i<6; i++) {
			navmaterials.push(new THREE.MeshBasicMaterial({color: 0xffffff, map: THREE.ImageUtils.loadTexture('images/navcube/' + i + '.png', THREE.UVMapping)}));
		}
		var cubeGeo = new THREE.CubeGeometry(width,height,depth,1,1,1, navmaterials);
		var cube = new THREE.Mesh(cubeGeo, new THREE.MeshFaceMaterial());	
		navscene.add(cube);
		navscene.add(navcam);
		navrenderer.setSize(NAV_WIDTH, NAV_HEIGHT);
		navrenderer.setClearColorHex(0x000000, 0.0);	
	}
	
	this.windowResize = function()
	{
	    navrenderer.setSize(NAV_WIDTH,NAV_HEIGHT);
		navcam.aspect = 1;
		navcam.updateProjectionMatrix();
		navcam.radius = ( 200 ) / 4;	
	}

	this.render = function(camera) 
	{	
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

		navrenderer.clear();

		navrenderer.render( navscene, navcam );			
	}
};
