/*
  Phase Median Filter

  Author: Nik Karpinsky

  Adopted from:
    A Fast, Small-Radius GPU Median Filter
    by Morgan McGuire
    from Shader X6 Advanced Rendering Techniques
*/

#define m2(a,b) 	    t = a; a = min(a,b); b = max(t,b);
#define m3(a,b,c) 	    m2(b,c); m2(a,c); m2(a,b);
#define m4(a,b,c,d) 	m2(a,b); m2(c,d); m2(a,c); m2(b,d);
#define m5(a,b,c,d,e) 	m2(a,b); m2(c,d); m2(a,c); m2(a,e); m2(d,e); m2(b,e);
#define m6(a,b,c,d,e,f)	m2(a,d); m2(b,e); m2(c,f); m2(a,b); m2(a,c); m2(e,f); m2(d,f);

uniform sampler2D image;
uniform float width;
uniform float height;

varying vec2 fragUV;

float step_w = 1.0/width;
float step_h = 1.0/height;

void main(void)
{
  float twoPi = 2.0 * 3.14159;
  float v[5];
  float t;

  for(int dX = -2; dX <= 2; ++dX)
  {
    vec2 offset = vec2(float(dX) * step_w, 0.0);
    v[dX + 2] = texture2D(image, fragUV + offset).x;
  }

  m5(v[0], v[1], v[2], v[3], v[4]);
  
  // Using the median phase value and the actual find the correct number of phase jumps
  vec4 originalValue = texture2D(image, fragUV);
  float phaseJump = (v[2] - originalValue.x) / twoPi;
  int jumps = phaseJump < 0.0 ? int(phaseJump - .5) : int(phaseJump + .5); 

  gl_FragColor = vec4( vec3( originalValue.x + float(jumps) * twoPi), originalValue.a);
}
