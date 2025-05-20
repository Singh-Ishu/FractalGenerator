import React, { useEffect, useRef } from "react";
import Sidebar from "../../../components/Sidebar";
import "../../fractal.css";

import MandelbrotFrag from "../../../utils/shaders/Mandelbrot-frag";
import AllVert from "../../../utils/shaders/vert";

import { compileShader, createProgram } from "../../../utils/Helpers";

export default function Mandelbrot() {
    const canvasRef = useRef(null);
    const glRef = useRef(null);
    const programRef = useRef(null);
    const zoomRef = useRef(2.5); // Initial zoom level
    const centerRef = useRef({ x: 0.0, y: 0.0 });
    const draggingRef = useRef(false);
    const startPosRef = useRef({ x: 0, y: 0 });

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
        const initialZLoc = gl.getUniformLocation(program, "initialZ");
        const canvas = gl.canvas;

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform2f(centerLoc, centerRef.current.x, centerRef.current.y);
        gl.uniform1f(zoomLoc, zoomRef.current);

        gl.uniform3f(colorLoc, params.r || 0, params.g || 0, params.b || 0);
        gl.uniform1i(insideBWLoc, params.insideBW ? 1 : 0);
        gl.uniform2f(
            initialZLoc,
            parseFloat(params.zr) || 0.0,
            parseFloat(params.zi) || 0.0
        );

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext("webgl2");
        if (!gl) {
            alert("WebGL2 not supported");
            return;
        }

        glRef.current = gl;

        const vertShader = compileShader(gl, gl.VERTEX_SHADER, AllVert);
        const fragShader = compileShader(
            gl,
            gl.FRAGMENT_SHADER,
            MandelbrotFrag
        );
        const program = createProgram(gl, vertShader, fragShader);
        programRef.current = program;
        gl.useProgram(program);

        // Set up full screen triangle
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

        renderFractal(); // Initial render

        // Listen for updates
        window.addEventListener("fractal2dparams-update", renderFractal);

        // Zoom functionality
        const handleWheel = (event) => {
            event.preventDefault(); // Prevent default scrolling behavior
            const zoomFactor = event.deltaY > 0 ? 1.1 : 0.9;
            zoomRef.current *= zoomFactor;
            renderFractal();
        };

        canvas.addEventListener("wheel", handleWheel, { passive: false });

        // Panning functionality
        const handleMouseDown = (event) => {
            draggingRef.current = true;
            startPosRef.current = { x: event.clientX, y: event.clientY };
            canvas.style.cursor = "grabbing";
        };

        const handleMouseMove = (event) => {
            if (!draggingRef.current) return;

            const deltaX = event.clientX - startPosRef.current.x;
            const deltaY = event.clientY - startPosRef.current.y;

            centerRef.current.x -= (deltaX / canvas.width) * zoomRef.current;
            centerRef.current.y += (deltaY / canvas.height) * zoomRef.current; // Invert Y for correct direction

            renderFractal();

            startPosRef.current = { x: event.clientX, y: event.clientY };
        };

        const handleMouseUp = () => {
            draggingRef.current = false;
            canvas.style.cursor = "default";
        };

        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mouseout", handleMouseUp); // Stop dragging if mouse leaves canvas

        // Clean up on unmount
        return () => {
            window.removeEventListener("fractal2dparams-update", renderFractal);
            canvas.removeEventListener("wheel", handleWheel);
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mouseout", handleMouseUp);
        };
    }, []);

    return (
        <>
            <div className="fractal-page-container">
                <Sidebar />
                <canvas
                    ref={canvasRef}
                    id="drawing-board"
                    width={1200}
                    height={400}
                ></canvas>
            </div>
            <div className="fractal-info">
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
