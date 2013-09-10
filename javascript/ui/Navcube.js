Nimbus.Navcube = function( )
{
    var navscene;
    var navcam = new THREE.PerspectiveCamera(VIEW_ANGLE, 1, NEAR, FAR);
	var width = 4;
	var height = 4;
	var depth = 4;
    navcam.position.z = 14;
 
    var NAV_WIDTH = 128;
    var NAV_HEIGHT = 128;

	this.init = function()
	{		
		// Load the textures
		var navmaterials = [];
		for (var i=0; i<6; i++) {
			navmaterials.push( new THREE.MeshBasicMaterial(
				{color: 0xffffff, 
				 map: THREE.ImageUtils.loadTexture('images/navcube/' + i + '.png', THREE.UVMapping)
				} ) );
		}
		
		// Create the navigation cube
		var cube = new THREE.Mesh( 
			new THREE.CubeGeometry( width, height, depth, 1, 1, 1 ), 
			new THREE.MeshFaceMaterial( navmaterials ) );	
			
		// Add to the scene
		navscene = new THREE.Scene( );	
		navscene.add( cube );
		navscene.add( navcam );
	}
	
	this.windowResize = function()
	{
		navcam.aspect = 1;
		navcam.updateProjectionMatrix();
		navcam.radius = ( 200 ) / 4;	
	}

	this.render = function( renderer, camera ) 
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

		navcam.lookAt( new THREE.Vector3( 0, 0, 0 ) );
		navcam.updateProjectionMatrix();

		renderer.setViewport( Nimbus.Settings.SceneWidth - NAV_WIDTH, 
							  Nimbus.Settings.SceneHeight - NAV_HEIGHT, 
							  NAV_WIDTH, 
							  NAV_HEIGHT);
							  
		renderer.render( navscene, navcam );	
		renderer.setViewport( 0, 0, Nimbus.Settings.SceneWidth, Nimbus.Settings.SceneHeight );
	}
};
