uniform sampler2D phaseMap;
uniform float width;

varying vec2 fragUV;

void main()
{	
	vec4 phaseA = texture2D(phaseMap, fragUV);
	if(0.0 == phaseA.a) // If alpha is zero we are supposed to filter this off
	{
		gl_FragColor = vec4( 0.0 );
        return;
	}
    
    float pi = 3.14159265;
    float twoPi = 2.0 * pi;                  // Mmmmmm PI
	float theta = pi / 6.0;                 // Angle between camera and projector. 30 degrees
	float fringeFrequency = 6.0;            // Frequency of the fringe in Hz
	float P = width / (2.0 * fringeFrequency);  // Pixels per period of the projector

	vec4 vertPosition = vec4(fragUV.s - .5, fragUV.t - .5, 0.0, 0.0);
	float phaseR = ( vertPosition.x * width ) * ( ( twoPi * cos( theta ) ) / P );	
	gl_FragColor = vec4( vec3( ( phaseA.x - phaseR ) * P / ( width * sin( theta ) * twoPi ) ), 1.0 );
}
