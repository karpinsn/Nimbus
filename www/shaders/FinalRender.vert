uniform sampler2D depthMap;

varying mat3 fragNormalMatrix;
varying vec4 fragVertex;

varying vec2 fragUV;
varying vec2 fragUVFlipped;

void main()
{
	fragNormalMatrix = normalMatrix;
	fragUV = uv;
	fragUVFlipped = vec2(1.0) - uv;
	fragUVFlipped.x = uv.x;
	
	vec4 newVertexPosition = vec4(position, 1.0);		
	newVertexPosition.z = texture2D(depthMap, uv).x;

	fragVertex = modelViewMatrix * newVertexPosition;
	gl_Position = projectionMatrix * modelViewMatrix * newVertexPosition;
} 
