/**
 * Sierpinski Triangle fragment shader
 * Generates the Sierpinski Triangle using iterative subdivision
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

// Check if point is inside triangle
bool inTriangle(vec2 p, vec2 a, vec2 b, vec2 c) {
    vec2 v0 = c - a;
    vec2 v1 = b - a;
    vec2 v2 = p - a;
    
    float dot00 = dot(v0, v0);
    float dot01 = dot(v0, v1);
    float dot02 = dot(v0, v2);
    float dot11 = dot(v1, v1);
    float dot12 = dot(v1, v2);
    
    float invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
    float u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    float v = (dot00 * dot12 - dot01 * dot02) * invDenom;
    
    return (u >= 0.0) && (v >= 0.0) && (u + v <= 1.0);
}

void main() {
    vec2 uv = (gl_FragCoord.xy / resolution - 0.5) * zoom + center;
    
    // Initial triangle vertices
    vec2 a = vec2(0.0, 0.866);
    vec2 b = vec2(-1.0, -0.866);
    vec2 c = vec2(1.0, -0.866);
    
    bool inside = inTriangle(uv, a, b, c);
    
    // Iteratively remove middle triangles
    for (int i = 0; i < 10; i++) {
        if (i >= iterations) break;
        
        vec2 mid_ab = (a + b) * 0.5;
        vec2 mid_bc = (b + c) * 0.5;
        vec2 mid_ca = (c + a) * 0.5;
        
        if (inTriangle(uv, mid_ab, mid_bc, mid_ca)) {
            inside = false;
            break;
        }
        
        // Determine which sub-triangle the point is in
        if (inTriangle(uv, a, mid_ab, mid_ca)) {
            b = mid_ab;
            c = mid_ca;
        } else if (inTriangle(uv, mid_ab, b, mid_bc)) {
            a = mid_ab;
            c = mid_bc;
        } else if (inTriangle(uv, mid_ca, mid_bc, c)) {
            a = mid_ca;
            b = mid_bc;
        } else {
            break;
        }
    }
    
    if (inside) {
        vec3 color = insideBW ? vec3(1.0) : colorMultiplier;
        outColor = vec4(color, 1.0);
    } else {
        outColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
`;
