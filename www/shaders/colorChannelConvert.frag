precision mediump float;

varying vec2 fragUV;

uniform sampler2D image;

void main(void) 
{
	vec4 color = texture2D(image, vec2(fragUV.s, fragUV.t));

	float r = color.x + 1.402 * (color.z - 0.5);
	float g = color.x - 0.344 * (color.y - 0.5) - .714 * (color.z - 0.5);
	float b = color.x + 1.772 * (color.y - 0.5);

	vec4 transformedColor = vec4(r, g, b, 1.0);
	//vec4 transformedColor = vec4(0.0, 0.0, b, 1.0);
	
	//gl_FragColor = vec4(1.0,1.0,1.0,1.0);
	gl_FragColor = transformedColor;
}