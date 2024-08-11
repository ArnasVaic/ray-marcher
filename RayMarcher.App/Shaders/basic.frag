#version 330 core
out vec4 FragColor;

uniform vec2 iResolution;

#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURFACE_DIST 0.01

float sd_sphere(vec3 origin, vec3 position, float radius)
{
    return length(origin - position) - radius;
}

float scene(vec3 position)
{
    return sd_sphere(vec3(0.0), position, 1);
}

vec3 scene_normal(vec3 position) {
  vec2 epsilon = vec2(.01, 0);

  vec3 n = scene(position) - vec3(
    scene(position - epsilon.xyy),
    scene(position - epsilon.yxy),
    scene(position - epsilon.yyx));

  return normalize(n);
}

float ray_march(vec3 origin, vec3 direction)
{
    float distance_marched = 0.0;

    for(int i = 0; i < MAX_STEPS; ++i)
    {
        vec3 current_position = origin + distance_marched * direction;

        float distance_from = scene(current_position);

        if (distance_from < SURFACE_DIST || distance_from > MAX_DIST)
        {
            break;
        }

        distance_marched += distance_from;
    }

    return distance_marched;
}

vec3 lightDirection = vec3(-1.0, 0.0, 0.0);

void main() 
{
    vec2 uv = gl_FragCoord.xy / iResolution.xy;

    uv -= 0.5;

    vec3 origin = vec3(0, 0, 5);
    vec3 direction = normalize(vec3(uv, -1.0));

    float distance_from = ray_march(origin, direction);

    // Normal at point
    vec3 normal = scene_normal(origin + distance_from * direction);
    float diffuse = max(dot(normal, lightDirection), 0.0);

    vec3 color = vec3(0.0);
    if(distance_from < MAX_DIST)
    {
        color = vec3(1, 0, 0) * diffuse;
    }    

    FragColor = vec4(color, 1.0);
}