uniform sampler2D holovideoFrame;

varying vec2 fragUV;

void main( void )
{
	vec4 holoPhase = texture2D(holovideoFrame, fragUV);

	float fringeFrequency = 6.0;							// Frequency of the fringe in Hz
	float pi = 3.14159265; 									// Mmmmmm PI
	float stepHeight = 1.0 / (2.0 * fringeFrequency) -.001;	// .001 is just a buffer so we dont get rounding errors

	float I1 = holoPhase.x * 255.0;
	float I2 = holoPhase.y * 255.0;
	float I3 = floor(holoPhase.z * 1.0 / stepHeight);

	if(holoPhase.rgb == vec3(0.0))
	{
        // Zero in alpha means that this should be filtered off
		gl_FragColor = vec4( 0.0 );
	}
	else
	{
		float phaseA = atan((I1 - 127.5), (I2 - 127.5)) + (2.0 * pi * I3);		
		gl_FragColor = vec4(vec3(phaseA), 1.0);
	}
}
