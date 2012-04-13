uniform sampler2D textureOverTime;

uniform float cols;
uniform float rows;

varying vec2 fragUV;

void main()
{
	//	Total time in milliseconds
	//float totalTime = (cols * rows) / 30 * 1000;
	
	float index = 12;
	
	vec2 clipSize = vec2(1.0/cols, 1.0/rows);
	vec2 location = vec2(mod(index, cols), mod((index/cols), rows));

	vec2 clipStart = clipSize * location;
	vec2 clipEnd = clipStart + clipSize;
	
	vec2 clippedUV = mix(clipStart, clipEnd, fragUV);

	gl_FragColor = texture2D(textureOverTime, clippedUV);
}

