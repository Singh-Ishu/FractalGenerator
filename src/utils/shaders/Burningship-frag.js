export default `#version 300 es
    precision highp float;
    out vec4 outColor;

    uniform vec2 resolution;
    uniform vec2 center;
    uniform float zoom;
    uniform vec3 colorMultiplier;
    uniform bool insideBW;

    void main() {
        vec2 c = vec2(
    (gl_FragCoord.x / resolution.x - 0.5) * zoom + center.x,
    -(gl_FragCoord.y / resolution.y - 0.5) * zoom + center.y
);
        float x = 0.0;
        float y = 0.0;
        float x2 = 0.0;
        float y2 = 0.0;

        int maxIteration = 300;
        int iteration = 0;

        // Burning Ship iteration: z = (|Re(z)| + i|Im(z)|)^2 + c
        while ((x2 + y2 <= 4.0) && (iteration < maxIteration)) {
            float absX = abs(x);
            float absY = abs(y);

            y = 2.0 * absX * absY + c.y;
            x = x2 - y2 + c.x;

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
