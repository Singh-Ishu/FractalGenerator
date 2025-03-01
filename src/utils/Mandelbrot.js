let gl = null;
let program = null;
let resolutionLoc, centerLoc, zoomLoc, colorLoc, z0Loc;
let zoom = 4.0;
let centerX = 0.0,
  centerY = 0.0;

export default function renderMandelbrot() {
  const canvas = document.getElementById("drawing-board");
  if (!canvas) return;
  canvas.style.width = "65vw"; // Full width
  canvas.style.height = "70vh"; // Full height
  canvas.width = window.innerWidth * devicePixelRatio; // Scale for high DPI
  canvas.height = window.innerHeight * devicePixelRatio;
  if (!gl) {
    gl = canvas.getContext("webgl2");
    if (!gl) {
      console.error("WebGL2 not supported");
      return;
    }
  }

  // If program exists, no need to recompile shaders
  if (!program) {
    const vertexShaderSource = `#version 300 es
      in vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `#version 300 es
      precision highp float;
      out vec4 outColor;
      uniform vec2 resolution;
      uniform vec2 center;
      uniform float zoom;
      uniform vec3 colorMultiplier;
      uniform vec2 z0;
      
      void main() {
        vec2 c = (gl_FragCoord.xy / resolution - 0.5) * zoom + center;
        vec2 z = z0;
        int maxIteration = 300;
        int i;
        
        for (i = 0; i < maxIteration; i++) {
            if (dot(z, z) > 4.0) break;
            z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        }
        
        if (i == maxIteration) {
            // Point is inside the Mandelbrot set → BLACK
            outColor = vec4(0.0, 0.0, 0.0, 1.0);
        } else {
            // Escape points get colored
            float norm = float(i) / float(maxIteration);
            outColor = vec4(norm * colorMultiplier, 1.0);
        }
    }
    `;

    function compileShader(gl, source, type) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error: ", gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    const vertexShader = compileShader(
      gl,
      vertexShaderSource,
      gl.VERTEX_SHADER
    );
    const fragmentShader = compileShader(
      gl,
      fragmentShaderSource,
      gl.FRAGMENT_SHADER
    );

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Setup geometry (only once)
    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const positionLoc = gl.getAttribLocation(program, "position");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    // Get uniform locations (only once)
    resolutionLoc = gl.getUniformLocation(program, "resolution");
    centerLoc = gl.getUniformLocation(program, "center");
    zoomLoc = gl.getUniformLocation(program, "zoom");
    colorLoc = gl.getUniformLocation(program, "colorMultiplier");
    z0Loc = gl.getUniformLocation(program, "z0");
  }

  // Set initial values
  gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
  gl.uniform2f(centerLoc, centerX, centerY);
  gl.uniform1f(zoomLoc, zoom);
  gl.uniform3f(colorLoc, 1.0, 1.0, 1.0);
  gl.uniform2f(z0Loc, 0.0, 0.0);

  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  render();

  // Attach event listeners only once
  if (!canvas.hasEventListener) {
    canvas.hasEventListener = true;

    window.addEventListener("resize", renderMandelbrot);

    canvas.addEventListener("wheel", (event) => {
      zoom *= event.deltaY > 0 ? 1.1 : 0.9;
      gl.uniform1f(zoomLoc, zoom);
      render();
    });

    canvas.addEventListener("mousedown", (event) => {
      let startX = event.clientX;
      let startY = event.clientY;

      function onMouseMove(e) {
        centerX += ((startX - e.clientX) / canvas.width) * zoom;
        centerY -= ((startY - e.clientY) / canvas.height) * zoom;
        gl.uniform2f(centerLoc, centerX, centerY);
        render();
        startX = e.clientX;
        startY = e.clientY;
      }

      function onMouseUp() {
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mouseup", onMouseUp);
      }

      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseup", onMouseUp);
    });
  }
}

// Function to update fractal parameters (call this from Sidebar)
export function updateFractalParams() {
  const zr = parseFloat(document.getElementById("zr").value) || 0.0;
  const zi = parseFloat(document.getElementById("zi").value) || 0.0;
  const r = parseFloat(document.getElementById("r").value) || 1.0;
  const g = parseFloat(document.getElementById("g").value) || 1.0;
  const b = parseFloat(document.getElementById("b").value) || 1.0;

  gl.uniform2f(z0Loc, zr, zi);
  gl.uniform3f(colorLoc, r, g, b);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
