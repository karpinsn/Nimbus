uniform sampler2D textureOverTime;

varying vec2 fragUV;

void main()
{
	vec4 timeClippedFrame = texture2D(textureOverTime, fragUV);

	gl_FragColor = texture2D(normalMap, fragUVFlipped);
}
