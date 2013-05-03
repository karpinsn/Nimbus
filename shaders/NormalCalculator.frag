uniform sampler2D depthMap;
uniform float width;
uniform float height;

varying vec2 fragUV;

float step_w = 1.0/width;
float step_h = 1.0/height;

void main(void)
{
  vec2 offset[9];
  offset[3] = vec2(-step_w, step_h); 	offset[2] = vec2(0.0, step_h); 	offset[1] = vec2(step_w, step_h);
  offset[4] = vec2(-step_w, 0.0);   					offset[0] = vec2(step_w, 0.0);		offset[8] = vec2(step_w, 0.0);
  offset[5] = vec2(-step_w, -step_h);  	offset[6] = vec2(0.0, -step_h);	offset[7] = vec2(step_w, -step_h); 
 
  vec3 newVertex = vec3(fragUV.s-.5, fragUV.t-.5, 0.0);
  newVertex.z = texture2D(depthMap, fragUV).x;

  vec3 normal = vec3(0.0);

  for(int i=0; i<8; ++i)
  {
    vec3 currentNeighbor = newVertex;
    currentNeighbor.xy = currentNeighbor.xy + offset[i];
    currentNeighbor.z = texture2D(depthMap, fragUV +offset[i]).x;

    vec3 nextNeighbor = newVertex;
    nextNeighbor.xy = nextNeighbor.xy + offset[i+1];
    nextNeighbor.z = texture2D(depthMap, fragUV + offset[i+1]).x;

    vec3 v1 = normalize(currentNeighbor - newVertex);
    vec3 v2 = normalize(nextNeighbor - newVertex);
    normal += cross(v1, v2);
  }

  normal /= 8.0;
  normal = normalize(normal);
  
  gl_FragColor = vec4(normal, 1.0);
}
