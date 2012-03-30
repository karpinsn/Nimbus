varying vec2 fragUV;

void main(void) 
{
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	fragUV = uv;
}
