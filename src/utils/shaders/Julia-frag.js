export default `#version 300 es
    precision highp float;
    out vec4 outColor;

    uniform vec2 resolution;
    uniform vec2 center;
    uniform float zoom;
    uniform vec2 juliaC; // Fixed complex constant for the Julia set
    uniform vec3 colorMultiplier;
    uniform bool insideBW;

    void main() {
        // Map pixel coordinate to complex plane
        vec2 z = (gl_FragCoord.xy / resolution - 0.5) * zoom + center;

        float x = z.x;
        float y = z.y;
        float x2 = x * x;
        float y2 = y * y;

        int maxIteration = 300;
        int iteration = 0;

        // Julia set iteration: z = z^2 + c
        while ((x2 + y2 <= 4.0) && (iteration < maxIteration)) {
            y = 2.0 * x * y + juliaC.y;
            x = x2 - y2 + juliaC.x;
            x2 = x * x;
            y2 = y * y;
            iteration++;
        }

        if (iteration == maxIteration) {
            outColor = insideBW ? vec4(1.0, 1.0, 1.0, 1.0) : vec4(0.0, 0.0, 0.0, 1.0);
        } else {
            float norm = float(iteration) / float(maxIteration);
            vec3 color = norm * colorMultiplier;
            outColor = vec4(color, 1.0);
        }
    }
`;
