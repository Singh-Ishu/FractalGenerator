/**
 * Koch Snowflake fragment shader
 * Generates the Koch Snowflake using distance field approximation
 */

export default `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 resolution;
uniform vec2 center;
uniform float zoom;
uniform vec3 colorMultiplier;
uniform bool insideBW;
uniform int iterations;

const float PI = 3.14159265359;

// Rotate point around origin
vec2 rotate(vec2 p, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

// Distance to line segment
float sdSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

// Koch curve distance
float kochCurve(vec2 p, vec2 a, vec2 b, int depth) {
    float minDist = sdSegment(p, a, b);
    
    if (depth <= 0) return minDist;
    
    vec2 dir = b - a;
    float len = length(dir);
    dir = normalize(dir);
    
    vec2 p1 = a + dir * len / 3.0;
    vec2 p3 = a + dir * len * 2.0 / 3.0;
    vec2 p2 = p1 + rotate(p3 - p1, PI / 3.0);
    
    minDist = min(minDist, kochCurve(p, a, p1, depth - 1));
    minDist = min(minDist, kochCurve(p, p1, p2, depth - 1));
    minDist = min(minDist, kochCurve(p, p2, p3, depth - 1));
    minDist = min(minDist, kochCurve(p, p3, b, depth - 1));
    
    return minDist;
}

void main() {
    vec2 uv = (gl_FragCoord.xy / resolution - 0.5) * zoom + center;
    
    // Initial triangle vertices
    vec2 a = vec2(0.0, 0.577);
    vec2 b = vec2(-0.866, -0.289);
    vec2 c = vec2(0.866, -0.289);
    
    int depth = min(iterations, 6);
    
    float dist = kochCurve(uv, a, b, depth);
    dist = min(dist, kochCurve(uv, b, c, depth));
    dist = min(dist, kochCurve(uv, c, a, depth));
    
    float thickness = 0.005 / zoom;
    float alpha = smoothstep(thickness, thickness * 0.5, dist);
    
    vec3 color = insideBW ? vec3(1.0) : colorMultiplier;
    outColor = vec4(color * alpha, alpha);
}
`;
