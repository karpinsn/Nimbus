uniform sampler2D phaseMap;
uniform float width;

varying vec2 fragUV;

void main()
{	
	float pi = 3.14159265;                  // Mmmmmm PI
	float theta = pi / 6.0;                 // Angle between camera and projector. 30 degrees
	float W = width;						// Width of the image
	float fringeFrequency = 6.0;            // Frequency of the fringe in Hz
	float P = W / (2.0 * fringeFrequency);  // Pixels per period of the projector

	vec4 vertPosition = vec4(fragUV.s - .5, fragUV.t - .5, 0.0, 0.0);
	float phaseR = (vertPosition.x * W) * ((2.0*pi*cos(theta))/P);
	float phaseA = texture2D(phaseMap, fragUV).x;
			
	if(0.0 == phaseA)
	{
		gl_FragColor = vec4(0.0);
	}
	else
	{
		//gl_FragColor = vec4(vec3(phaseR), 1.0);
		gl_FragColor = vec4(vec3((phaseA - phaseR) * P / (W * sin(theta)*2.0*pi)), 1.0);
	}
}
