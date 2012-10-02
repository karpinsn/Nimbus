/*
  5x5 Gaussian Filter

  Author: Nik Karpinsky

  Adopted from:
	Faster Gaussian Blur in GLSL
	http://xissburg.com/?p=197
*/

precision highp float;

uniform sampler2D image;
uniform float kernel[5];

varying vec2 fragTexCoordOffset[5];
 
void main(void)
{
    gl_FragColor = vec4(0.0);
    gl_FragColor += texture2D(image, fragTexCoordOffset[ 0])*kernel[ 0];
    gl_FragColor += texture2D(image, fragTexCoordOffset[ 1])*kernel[ 1];
    gl_FragColor += texture2D(image, fragTexCoordOffset[ 2])*kernel[ 2];
    gl_FragColor += texture2D(image, fragTexCoordOffset[ 3])*kernel[ 3];
    gl_FragColor += texture2D(image, fragTexCoordOffset[ 4])*kernel[ 4];
}
