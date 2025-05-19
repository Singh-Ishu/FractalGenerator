export default `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 resolution;
uniform vec3 center; // 3D center of the fractal
uniform float zoom;  // Normal zoom: higher = closer
uniform vec3 colorMultiplier; // RGB color scaling
uniform bool insideBW; // Black/white interior coloring
uniform float yaw; // Camera yaw angle (degrees)
uniform float pitch; // Camera pitch angle (degrees)

// Mandelbulb parameters
const int maxIterations = 8; // Iteration count for fractal
const float power = 8.0; // Mandelbulb power
const int maxSteps = 100; // Max ray marching steps
const float maxDistance = 10.0; // Max ray distance
const float surfaceDistance = 0.001; // Surface hit threshold
const float baseDistance = 3.0; // Base camera distance

// Distance estimator for the Mandelbulb
float mandelbulbDE(vec3 pos) {
    vec3 z = pos;
    float dr = 1.0;
    float r = 0.0;
    
    for (int i = 0; i < maxIterations; i++) {
        r = length(z);
        if (r > 2.0) break;
        
        // Convert to spherical coordinates
        float theta = acos(z.z / r);
        float phi = atan(z.y, z.x);
        dr = pow(r, power - 1.0) * power * dr + 1.0;
        
        // Scale and rotate
        float zr = pow(r, power);
        theta *= power;
        phi *= power;
        
        // Convert back to Cartesian
        z = zr * vec3(
            sin(theta) * cos(phi),
            sin(theta) * sin(phi),
            cos(theta)
        ) + pos;
    }
    
    return 0.5 * log(r) * r / dr;
}

// Ray marching
float rayMarch(vec3 ro, vec3 rd, out int steps) {
    float totalDistance = 0.0;
    for (int i = 0; i < maxSteps; i++) {
        vec3 p = ro + totalDistance * rd;
        float d = mandelbulbDE(p);
        totalDistance += d;
        steps = i;
        if (d < surfaceDistance || totalDistance > maxDistance) break;
    }
    return totalDistance;
}

// Normal estimation
vec3 calcNormal(vec3 p) {
    const vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
        mandelbulbDE(p + e.xyy) - mandelbulbDE(p - e.xyy),
        mandelbulbDE(p + e.yxy) - mandelbulbDE(p - e.yxy),
        mandelbulbDE(p + e.yyx) - mandelbulbDE(p - e.yyx)
    ));
}

void main() {
    // Normalize pixel coordinates
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / resolution.y;
    
    // Camera setup
    vec3 ro = center + vec3(0.0, 0.0, baseDistance / zoom); // Initial camera position
    vec3 rd = normalize(vec3(uv, -1.0)); // Ray direction
    
    // Apply rotation
    float yawRad = radians(yaw);
    float pitchRad = radians(pitch);
    mat3 rotYaw = mat3(
        cos(yawRad), 0.0, sin(yawRad),
        0.0, 1.0, 0.0,
        -sin(yawRad), 0.0, cos(yawRad)
    );
    mat3 rotPitch = mat3(
        1.0, 0.0, 0.0,
        0.0, cos(pitchRad), -sin(pitchRad),
        0.0, sin(pitchRad), cos(pitchRad)
    );
    rd = rotPitch * rotYaw * rd;
    ro = center + rotPitch * rotYaw * (ro - center);
    
    // Ray march
    int steps;
    float dist = rayMarch(ro, rd, steps);
    
    // Coloring
    if (dist < maxDistance) {
        vec3 p = ro + dist * rd;
        vec3 normal = calcNormal(p);
        
        // Diffuse lighting
        vec3 lightDir = normalize(vec3(1.0, 1.0, -1.0));
        float diff = max(dot(normal, lightDir), 0.0);
        
        // Color based on steps
        float t = float(steps) / float(maxSteps);
        vec3 color = t * colorMultiplier * diff;
        outColor = vec4(color, 1.0);
    } else {
        outColor = insideBW ? vec4(1.0, 1.0, 1.0, 1.0) : vec4(0.0, 0.0, 0.0, 1.0);
    }
}`;
