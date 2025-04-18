import React, { useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import "./fractal.css";

import MandelbrotFrag from "../utils/shaders/Mandelbrot-frag";
import MandelbrotVert from "../utils/shaders/vert";

export default function Mandelbrot() {
    const canvasRef = useRef(null);
    const glRef = useRef(null);
    const programRef = useRef(null);

    // Initialize WebGL, compile shaders, etc.
    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext("webgl2");
        if (!gl) {
            alert("WebGL2 not supported");
            return;
        }
        glRef.current = gl;

        // Compile shaders
        const vertShader = compileShader(gl, gl.VERTEX_SHADER, MandelbrotVert);
        const fragShader = compileShader(
            gl,
            gl.FRAGMENT_SHADER,
            MandelbrotFrag
        );
        const program = createProgram(gl, vertShader, fragShader);
        programRef.current = program;
        gl.useProgram(program);

        // Set up fullscreen quad
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
        );

        const positionLoc = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        renderFractal(); // initial render

        // Listen to changes from localStorage (when "Generate" is clicked)
        window.addEventListener("storage", () => {
            renderFractal();
        });

        // Cleanup on unmount
        return () => {
            window.removeEventListener("storage", renderFractal);
        };
    }, []);

    function renderFractal() {
        const gl = glRef.current;
        const program = programRef.current;
        if (!gl || !program) return;

        gl.useProgram(program);
        const params =
            JSON.parse(localStorage.getItem("fractal2dparams")) || {};

        // Set uniforms
        const resLoc = gl.getUniformLocation(program, "resolution");
        const centerLoc = gl.getUniformLocation(program, "center");
        const zoomLoc = gl.getUniformLocation(program, "zoom");
        const colorLoc = gl.getUniformLocation(program, "colorMultiplier");
        const insideBWLoc = gl.getUniformLocation(program, "insideBW");
        const zrLoc = gl.getUniformLocation(program, "juliaC");

        const canvas = gl.canvas;

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform2f(centerLoc, 0.0, 0.0); // you can make this interactive
        gl.uniform1f(zoomLoc, 2.5); // same here

        gl.uniform3f(colorLoc, params.r || 0, params.g || 0, params.b || 0);
        gl.uniform1i(insideBWLoc, params.insideBW ? 1 : 0);
        gl.uniform2f(zrLoc, params.zr || 0, params.zi || 0);

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function compileShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    function createProgram(gl, vertShader, fragShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            return null;
        }
        return program;
    }

    return (
        <>
            <div id="container">
                <Sidebar />
                <canvas
                    ref={canvasRef}
                    id="drawing-board"
                    width={800}
                    height={800}
                ></canvas>
            </div>
            <div>
                <p>
                    The Mandelbrot Set is one of the most famous fractals, known
                    for its infinite complexity and self-repeating patterns. It
                    is generated using a simple mathematical formula:{" "}
                    <b>
                        z<sub>n+1</sub> = z<sub>n</sub>
                        <sup>2</sup> + c
                    </b>{" "}
                    where z and c are complex numbers.
                    <br />
                    By iterating this equation and tracking how fast the values
                    escape to infinity, we can visualize the intricate and
                    mesmerizing structures of the Mandelbrot Set. This page
                    renders the Mandelbrot Set using WebGL, allowing for smooth
                    zooming and real-time interaction. Explore deeper, and
                    you'll discover endless variations of patterns hidden within
                    the fractal, revealing nature's deep mathematical beauty.
                </p>
            </div>
        </>
    );
}
