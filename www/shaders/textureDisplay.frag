precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) 
{
	vec4 color = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));

	float r = color.x + 1.402 * (color.z - 128.0);
	float g = color.x - .344 * (color.y - 128.0) - .714 * (color.z - 128.0);
	float b = color.x + 1.772 * (color.y - 128.0);

	vec4 transformedColor = vec4(r, g, b, 1.0);

	gl_FragColor = color;
}