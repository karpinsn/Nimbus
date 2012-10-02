/*
  5x5 Gaussian Filter

  Author: Nik Karpinsky

  Adopted from:
	Faster Gaussian Blur in GLSL
	http://xissburg.com/?p=197
*/

precision highp float;

uniform sampler2D image;

varying vec2 fragTexCoordOffset[5];
 
void main(void)
{
    gl_FragColor = vec4(0.0);
    gl_FragColor += texture2D(image, fragTexCoordOffset[ 0])*.1336;
    gl_FragColor += texture2D(image, fragTexCoordOffset[ 1])*.2292;
    gl_FragColor += texture2D(image, fragTexCoordOffset[ 2])*.2744;
    gl_FragColor += texture2D(image, fragTexCoordOffset[ 3])*.2292;
    gl_FragColor += texture2D(image, fragTexCoordOffset[ 4])*.1336;
}
