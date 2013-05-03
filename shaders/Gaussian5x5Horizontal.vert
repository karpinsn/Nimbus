uniform float width;
uniform float height;

varying vec2 fragTexCoordOffset[5];

float step_w = 1.0/width;
float step_h = 1.0/height;

void main()
{
		fragTexCoordOffset[ 0] = uv + vec2(2.0 * -step_w, 0.0);
		fragTexCoordOffset[ 1] = uv + vec2(1.0 * -step_w, 0.0);
		fragTexCoordOffset[ 2] = uv;
		fragTexCoordOffset[ 3] = uv + vec2(1.0 * step_w, 0.0);
		fragTexCoordOffset[ 4] = uv + vec2(2.0 * step_w, 0.0);
		
        gl_Position = vec4(position, 1.0);
}
