/**
 * WebGL helper utilities for shader compilation and program creation
 */

/**
 * Compiles a WebGL shader from source code
 * @param {WebGLRenderingContext} gl - The WebGL rendering context
 * @param {number} type - The shader type (gl.VERTEX_SHADER or gl.FRAGMENT_SHADER)
 * @param {string} source - The shader source code
 * @returns {WebGLShader|null} The compiled shader or null if compilation failed
 */
function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation failed:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    
    return shader;
}

/**
 * Creates a WebGL program from vertex and fragment shaders
 * @param {WebGLRenderingContext} gl - The WebGL rendering context
 * @param {WebGLShader} vertexShader - The compiled vertex shader
 * @param {WebGLShader} fragmentShader - The compiled fragment shader
 * @returns {WebGLProgram|null} The linked program or null if linking failed
 */
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program linking failed:", gl.getProgramInfoLog(program));
        return null;
    }
    
    return program;
}

export { compileShader, createProgram };
