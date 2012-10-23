uniform sampler2D phaseMap;
uniform float width;

varying vec2 fragUV;

void main()
{	
	float fringeFrequency = 16.0;            		// Frequency of the fringe in Hz
	float pi = 3.14159265; 							// Mmmmmm PI
	float phaseA = texture2D(phaseMap, fragUV).x;
			
	if(0.0 == phaseA)
	{
		gl_FragColor = vec4(0.0);
	}
	else
	{
		gl_FragColor = vec4(phaseA / (2.0 * pi * fringeFrequency));
	}
}
