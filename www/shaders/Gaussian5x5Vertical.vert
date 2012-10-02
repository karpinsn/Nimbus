uniform float width;
uniform float height;

varying vec2 fragTexCoordOffset[5];

float step_w = 1.0/width;
float step_h = 1.0/height;

void main()
{
		fragTexCoordOffset[ 0] = uv + vec2(0.0, 2.0 * -step_h);
		fragTexCoordOffset[ 1] = uv + vec2(0.0, 1.0 * -step_h);
		fragTexCoordOffset[ 2] = uv;
		fragTexCoordOffset[ 3] = uv + vec2(0.0, 1.0 * step_h);
		fragTexCoordOffset[ 4] = uv + vec2(0.0, 2.0 * step_h);
		
        gl_Position = vec4(position, 1.0);
}
