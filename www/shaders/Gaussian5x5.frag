#version 130

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

in vec2 fragTexCoordOffset[5];

out vec4 filteredImage;
 
void main(void)
{
    filteredImage = vec4(0.0);
    filteredImage += texture2D(image, fragTexCoordOffset[ 0])*kernel[ 0];
    filteredImage += texture2D(image, fragTexCoordOffset[ 1])*kernel[ 1];
    filteredImage += texture2D(image, fragTexCoordOffset[ 2])*kernel[ 2];
    filteredImage += texture2D(image, fragTexCoordOffset[ 3])*kernel[ 3];
    filteredImage += texture2D(image, fragTexCoordOffset[ 4])*kernel[ 4];
}
