uniform sampler2D image;

varying vec2 fragUV;

void main()
{
	//float maxPhase = 12.0 * 3.14159 * 2.0 * 60.0;
	float maxPhase = 100.0;
	gl_FragColor = texture2D(image, fragUV) / vec4(maxPhase, maxPhase, maxPhase, 1.0);
}
