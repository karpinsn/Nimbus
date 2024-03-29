uniform sampler2D holoFrame;
uniform sampler2D filteredHoloFrame;

varying vec2 fragUV;

void main(void)
{
	vec4 holoPhase = texture2D(holoFrame, fragUV);
  vec4 filteredHoloPhase = texture2D(filteredHoloFrame, fragUV);

	float fringeFrequency = 8.0;							// Frequency of the fringe in Hz
	float pi = 3.14159265; 									// Mmmmmm PI
	float stepHeight = 1.0 / (2.0 * fringeFrequency) -.001;	// .001 is just a buffer so we dont get rounding errors

	float I1 = filteredHoloPhase.x * 255.0;
	float I2 = filteredHoloPhase.y * 255.0;
	float I3 = floor(holoPhase.z * 1.0 / stepHeight);

	if(holoPhase.rgb == vec3(0.0))
	{
		gl_FragColor = vec4(0.0);
	}
	else
	{
		float phaseA = atan((I1 - 127.5), (I2 - 127.5)) + (2.0 * pi * I3);		
		gl_FragColor = vec4(vec3(phaseA), 1.0);
	}
}
