uniform sampler2D textureOverTime;

uniform float deltaTime;		// Delta time in milliseconds
uniform float framesPerSecond;  // Number of frames in 1 second

uniform float cols;
uniform float rows;

varying vec2 fragUV;

void main()
{
	float index		= floor( mod( deltaTime * framesPerSecond / 1000.0, cols * rows ) );	// Figure out which frame to display.
	
	vec2 location 	= vec2( mod( index, cols ) , mod( rows - floor( index / cols ), rows ) );
	vec2 clipSize 	= vec2( 1.0 / cols, 1.0 / rows );
	vec2 clipStart 	= clipSize * location;
	vec2 clipEnd 	= clipStart + clipSize;
	
	vec2 clippedUV 	= mix( clipStart, clipEnd, fragUV );

	gl_FragColor 	= texture2D(textureOverTime, clippedUV);
}

