varying vec2 fragTexCoord;

void main()
{
        fragTexCoord = uv;

        gl_Position = vec4(position, 1.0);
}
