/**
 * Quaternion Julia Set fragment shader
 * Renders a 4D Julia Set using quaternion mathematics and ray marching
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
uniform vec4 juliaC;

const int MAX_STEPS = 100;
const float MAX_DIST = 20.0;
const float EPSILON = 0.001;
const int MAX_ITERATIONS = 16;

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

// Quaternion multiplication
vec4 qMul(vec4 a, vec4 b) {
    return vec4(
        a.x * b.x - a.y * b.y - a.z * b.z - a.w * b.w,
        a.x * b.y + a.y * b.x + a.z * b.w - a.w * b.z,
        a.x * b.z - a.y * b.w + a.z * b.x + a.w * b.y,
        a.x * b.w + a.y * b.z - a.z * b.y + a.w * b.x
    );
}

// Quaternion square
vec4 qSquare(vec4 q) {
    return qMul(q, q);
}

// Distance estimator for quaternion Julia set
float quaternionJulia(vec3 p) {
    vec4 z = vec4(p, 0.0);
    vec4 c = juliaC;
    float dr = 1.0;
    float r = 0.0;
    
    for (int i = 0; i < MAX_ITERATIONS; i++) {
        r = length(z);
        if (r > 2.0) break;
        
        // Derivative
        dr = 2.0 * r * dr;
        
        // z = z^2 + c
        z = qSquare(z) + c;
    }
    
    return 0.5 * log(r) * r / dr;
}

// Ray marching
float rayMarch(vec3 ro, vec3 rd) {
    float depth = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * depth;
        float dist = quaternionJulia(p);
        depth += dist * 0.5;
        if (dist < EPSILON || depth > MAX_DIST) break;
    }
    return depth;
}

// Calculate normal
vec3 calcNormal(vec3 p) {
    vec2 e = vec2(EPSILON, 0.0);
    return normalize(vec3(
        quaternionJulia(p + e.xyy) - quaternionJulia(p - e.xyy),
        quaternionJulia(p + e.yxy) - quaternionJulia(p - e.yxy),
        quaternionJulia(p + e.yyx) - quaternionJulia(p - e.yyx)
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
        
        // Add some color variation based on position
        float colorVar = sin(p.x * 2.0) * 0.5 + 0.5;
        vec3 color = insideBW ? vec3(1.0) : mix(colorMultiplier, colorMultiplier * 0.5, colorVar);
        outColor = vec4(color * lighting, 1.0);
    } else {
        outColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
`;
