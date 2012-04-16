uniform sampler2D normalMap;
uniform sampler2D holovideoFrame;

varying mat3 fragNormalMatrix;
varying vec4 fragVertex;

varying vec2 fragUV;

void main()
{
	vec3 lightPosition = vec3(4.0, 4.0, 4.0);

	vec3 fragNormal = normalize(fragNormalMatrix * vec3(texture2D(normalMap, fragUV)));
	vec3 holoFrag = vec3(texture2D(holovideoFrame, fragUV));
	vec3 L = normalize(lightPosition - fragVertex.xyz);
	vec3 E = normalize(-fragVertex.xyz);
	vec3 R = normalize(-reflect(L,fragNormal));
	
	vec4 ambientColor = vec4(.2, .2, .2, 1.0);
	vec4 diffuseColor = vec4(.2, .2, .2, 1.0);
	vec4 specularColor = vec4(.2, .2, .2, 1.0);
	
	//	Ambient light
	vec4 Iamb = ambientColor;
	
	//	Diffuse light
	vec4 Idiff = diffuseColor * max(dot(fragNormal,L), 0.0);
	
	//	Specular light
	//	.2 = shinyness
	vec4 Ispec = specularColor * pow(max(dot(R,E),0.0), .2);
	
	//	Total color
	if(holoFrag.rgb == vec3(0.0))
	{
		discard;
	}
	else
	{
		//gl_FragColor = Iamb + Idiff + Ispec;
		gl_FragColor = texture2D(normalMap, fragUV);
		//gl_FragColor = vec4(fragUV.x, fragUV.y, 0.0, 1.0);
	}
}
