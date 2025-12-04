/**
 * Menger Sponge fragment shader
 * Renders a 3D Menger Sponge using ray marching
 */

export default `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 resolution;
uniform vec3 center;
uniform float zoom;
uniform vec3 colorMultiplier;
uniform bool insideBW;
uniform float yaw;
uniform float pitch;

const int MAX_STEPS = 100;
const float MAX_DIST = 100.0;
const float EPSILON = 0.001;
const int ITERATIONS = 4;

// Rotation matrices
mat3 rotateY(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
}

mat3 rotateX(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
}

// Box SDF
float sdBox(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

// Menger Sponge SDF
float mengerSponge(vec3 p) {
    float d = sdBox(p, vec3(1.0));
    float s = 1.0;
    
    for (int i = 0; i < ITERATIONS; i++) {
        vec3 a = mod(p * s, 2.0) - 1.0;
        s *= 3.0;
        vec3 r = abs(1.0 - 3.0 * abs(a));
        float da = max(r.x, r.y);
        float db = max(r.y, r.z);
        float dc = max(r.z, r.x);
        float c = (min(da, min(db, dc)) - 1.0) / s;
        d = max(d, c);
    }
    
    return d;
}

// Ray marching
float rayMarch(vec3 ro, vec3 rd) {
    float depth = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * depth;
        float dist = mengerSponge(p);
        depth += dist;
        if (dist < EPSILON || depth > MAX_DIST) break;
    }
    return depth;
}

// Calculate normal
vec3 calcNormal(vec3 p) {
    vec2 e = vec2(EPSILON, 0.0);
    return normalize(vec3(
        mengerSponge(p + e.xyy) - mengerSponge(p - e.xyy),
        mengerSponge(p + e.yxy) - mengerSponge(p - e.yxy),
        mengerSponge(p + e.yyx) - mengerSponge(p - e.yyx)
    ));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - resolution * 0.5) / resolution.y;
    
    // Camera setup
    float camDist = 3.0 / zoom;
    mat3 rotY = rotateY(radians(yaw));
    mat3 rotX = rotateX(radians(pitch));
    vec3 ro = rotY * rotX * vec3(0.0, 0.0, camDist) + center;
    vec3 target = center;
    vec3 forward = normalize(target - ro);
    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
    vec3 up = cross(forward, right);
    vec3 rd = normalize(forward + uv.x * right + uv.y * up);
    
    // Ray march
    float depth = rayMarch(ro, rd);
    
    if (depth < MAX_DIST) {
        vec3 p = ro + rd * depth;
        vec3 normal = calcNormal(p);
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        float diff = max(dot(normal, lightDir), 0.0);
        float ambient = 0.3;
        float lighting = ambient + diff * 0.7;
        
        vec3 color = insideBW ? vec3(1.0) : colorMultiplier;
        outColor = vec4(color * lighting, 1.0);
    } else {
        outColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
`;
