/**
 * Kleinian Groups fragment shader
 * Renders Kleinian limit sets using Möbius transformations
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
const float MAX_DIST = 50.0;
const float EPSILON = 0.001;
const int MAX_ITERATIONS = 20;

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

// Box folding
vec3 boxFold(vec3 p, float foldLimit) {
    return clamp(p, -foldLimit, foldLimit) * 2.0 - p;
}

// Sphere folding
vec3 sphereFold(vec3 p, float minRadius, float fixedRadius) {
    float r2 = dot(p, p);
    if (r2 < minRadius) {
        return p * (fixedRadius / minRadius);
    } else if (r2 < fixedRadius) {
        return p * (fixedRadius / r2);
    }
    return p;
}

// Kleinian distance estimator
float kleinian(vec3 p) {
    vec3 z = p;
    float dr = 1.0;
    float scale = 1.8;
    float foldLimit = 1.0;
    float minRadius = 0.5;
    float fixedRadius = 1.0;
    
    for (int i = 0; i < MAX_ITERATIONS; i++) {
        z = boxFold(z, foldLimit);
        z = sphereFold(z, minRadius, fixedRadius);
        z = z * scale + p;
        dr = dr * abs(scale) + 1.0;
    }
    
    return length(z) / abs(dr);
}

// Ray marching
float rayMarch(vec3 ro, vec3 rd) {
    float depth = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * depth;
        float dist = kleinian(p);
        depth += dist * 0.5;
        if (dist < EPSILON || depth > MAX_DIST) break;
    }
    return depth;
}

// Calculate normal
vec3 calcNormal(vec3 p) {
    vec2 e = vec2(EPSILON, 0.0);
    return normalize(vec3(
        kleinian(p + e.xyy) - kleinian(p - e.xyy),
        kleinian(p + e.yxy) - kleinian(p - e.yxy),
        kleinian(p + e.yyx) - kleinian(p - e.yyx)
    ));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - resolution * 0.5) / resolution.y;
    
    // Camera setup
    float camDist = 5.0 / zoom;
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
        float ambient = 0.2;
        float lighting = ambient + diff * 0.8;
        
        // Add glow effect
        float glow = 1.0 - smoothstep(0.0, MAX_DIST, depth);
        vec3 color = insideBW ? vec3(1.0) : colorMultiplier;
        color = mix(color, color * 1.5, glow * 0.3);
        
        outColor = vec4(color * lighting, 1.0);
    } else {
        outColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
`;
