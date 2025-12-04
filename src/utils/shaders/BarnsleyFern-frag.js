/**
 * Barnsley Fern fragment shader
 * Generates the Barnsley Fern using Iterated Function System (IFS)
 */

export default `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 resolution;
uniform vec2 center;
uniform float zoom;
uniform vec3 colorMultiplier;
uniform bool insideBW;
uniform sampler2D fernTexture;

void main() {
    vec2 uv = (gl_FragCoord.xy / resolution - 0.5) * zoom + center;
    
    // Transform to fern coordinate space
    vec2 fernUV = (uv + vec2(0.0, 5.0)) / vec2(10.0, 10.0);
    fernUV.y = 1.0 - fernUV.y;
    
    if (fernUV.x < 0.0 || fernUV.x > 1.0 || fernUV.y < 0.0 || fernUV.y > 1.0) {
        outColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
    
    float density = texture(fernTexture, fernUV).r;
    
    if (density > 0.01) {
        vec3 color = insideBW ? vec3(1.0) : colorMultiplier * density;
        outColor = vec4(color, 1.0);
    } else {
        outColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
`;
