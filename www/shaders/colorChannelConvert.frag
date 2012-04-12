precision mediump float;

varying vec2 fragUV;

uniform sampler2D image;

void main(void) 
{
	vec4 color = texture2D(image, vec2(fragUV.s, fragUV.t));

	/*
	float r = color.x + 1.402 * (color.z - 0.5);
	float g = color.x - 0.344 * (color.y - 0.5) - .714 * (color.z - 0.5);
	float b = color.x + 1.772 * (color.y - 0.5);
	*/
	
	float r = .299 * color.x + .587 * color.y + .114 * color.z;
	float g = -.147 * color.x - .289 * color.y + .436 * color.z;
	float b = .615 * color.x - .515 * color.y - .1 * color.z;
	
	/*
	float r = .299 * color.z + .587 * color.y + .114 * color.x;
	float g = -.147 * color.z - .289 * color.y + .436 * color.x;
	float b = .615 * color.z - .515 * color.y - .1 * color.x;
	*/
	//vec4 transformedColor = vec4(r, g, b, 1.0);
	vec4 transformedColor = vec4(b, g, r, 1.0);
	
	//gl_FragColor = vec4(1.0,1.0,1.0,1.0);
	gl_FragColor = transformedColor;
}