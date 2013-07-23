uniform sampler2D depthMap;

uniform float size;

varying mat3 fragNormalMatrix;
varying vec4 fragVertex;

varying vec2 fragUV;

void main()
{
	fragNormalMatrix = normalMatrix;
	fragUV = position.xy;

	vec4 newVertexPosition = vec4(position, 1.0);		
	newVertexPosition.z = texture2D(depthMap, fragUV).x;

	fragVertex = modelViewMatrix * newVertexPosition;
	gl_PointSize = size;
	gl_Position = projectionMatrix * modelViewMatrix * newVertexPosition;
} 
