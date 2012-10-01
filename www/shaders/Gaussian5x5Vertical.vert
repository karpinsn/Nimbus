#version 130

uniform float width;
uniform float height;

in vec3 vert;
in vec2 vertTexCoord;

out vec2 fragTexCoordOffset[5];

float step_w = 1.0/width;
float step_h = 1.0/height;

void main()
{
		fragTexCoordOffset[ 0] = vertTexCoord + vec2(0.0, 2.0 * -step_h);
		fragTexCoordOffset[ 1] = vertTexCoord + vec2(0.0, 1.0 * -step_h);
		fragTexCoordOffset[ 2] = vertTexCoord;
		fragTexCoordOffset[ 3] = vertTexCoord + vec2(0.0, 1.0 * step_h);
		fragTexCoordOffset[ 4] = vertTexCoord + vec2(0.0, 2.0 * step_h);
		
        gl_Position = vec4(vert, 1.0);
}
