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
		fragTexCoordOffset[ 0] = vertTexCoord + vec2(2.0 * -step_w, 0.0);
		fragTexCoordOffset[ 1] = vertTexCoord + vec2(1.0 * -step_w, 0.0);
		fragTexCoordOffset[ 2] = vertTexCoord;
		fragTexCoordOffset[ 3] = vertTexCoord + vec2(1.0 * step_w, 0.0);
		fragTexCoordOffset[ 4] = vertTexCoord + vec2(2.0 * step_w, 0.0);
		
        gl_Position = vec4(vert, 1.0);
}
