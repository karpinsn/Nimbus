uniform sampler2D depthMap;

varying mat3 fragNormalMatrix;
varying vec4 fragVertex;

varying vec2 fragUV;

void main()
{
	fragNormalMatrix = normalMatrix;
	fragUV = uv;
	
	vec4 newVertexPosition = vec4(position, 1.0);		
	newVertexPosition.z = texture2D(depthMap, uv).x;

	fragVertex = modelViewMatrix * newVertexPosition;
	gl_Position = projectionMatrix * modelViewMatrix * newVertexPosition;
} 
