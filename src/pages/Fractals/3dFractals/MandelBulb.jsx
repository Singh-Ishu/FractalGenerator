import React, { useEffect, useRef } from "react";
import Sidebar from "../../../components/Sidebar";
import "../../fractal.css";

import MandelbulbFrag from "../../../utils/shaders/Mandelbulb-frag";
import AllVert from "../../../utils/shaders/vert";

import { compileShader, createProgram } from "../../../utils/Helpers";

export default function Mandelbulb() {
    const canvasRef = useRef(null);
    const glRef = useRef(null);
    const programRef = useRef(null);
    const zoomRef = useRef(1.0); // Normal zoom: higher = closer
    const centerRef = useRef({ x: 0.0, y: 0.0, z: 0.0 }); // Mandelbulb center
    const anglesRef = useRef({ yaw: 0.0, pitch: 0.0 }); // Camera angles (degrees)
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
        const yawLoc = gl.getUniformLocation(program, "yaw");
        const pitchLoc = gl.getUniformLocation(program, "pitch");
        const canvas = gl.canvas;

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform3f(
            centerLoc,
            centerRef.current.x,
            centerRef.current.y,
            centerRef.current.z
        );
        gl.uniform1f(zoomLoc, zoomRef.current);
        gl.uniform3f(
            colorLoc,
            params.r || 1.0,
            params.g || 0.5,
            params.b || 0.2
        );
        gl.uniform1i(insideBWLoc, params.insideBW ? 1 : 0);
        gl.uniform1f(yawLoc, anglesRef.current.yaw);
        gl.uniform1f(pitchLoc, anglesRef.current.pitch);

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
            MandelbulbFrag
        );
        const program = createProgram(gl, vertShader, fragShader);
        programRef.current = program;
        gl.useProgram(program);

        // Set up full-screen triangle
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

        // Zoom functionality (normal: scroll up to zoom in)
        const handleWheel = (event) => {
            event.preventDefault();
            const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9; // Scroll up: increase zoom
            zoomRef.current *= zoomFactor;
            renderFractal();
        };

        canvas.addEventListener("wheel", handleWheel, { passive: false });

        // Rotation functionality (drag to rotate, Shift+drag for z-translation)
        const handleMouseDown = (event) => {
            draggingRef.current = true;
            startPosRef.current = { x: event.clientX, y: event.clientY };
            canvas.style.cursor = "grabbing";
        };

        const handleMouseMove = (event) => {
            if (!draggingRef.current) return;

            const deltaX = event.clientX - startPosRef.current.x;
            const deltaY = event.clientY - startPosRef.current.y;

            if (event.shiftKey) {
                // Translate in z-axis
                const scale = zoomRef.current / 1.0;
                centerRef.current.z += (deltaY / canvas.height) * scale;
            } else {
                // Rotate (yaw and pitch)
                const sensitivity = 0.5; // Degrees per pixel
                anglesRef.current.yaw -= deltaX * sensitivity;
                anglesRef.current.pitch -= deltaY * sensitivity;
                // Clamp pitch to avoid flipping
                anglesRef.current.pitch = Math.max(
                    -90.0,
                    Math.min(90.0, anglesRef.current.pitch)
                );
            }

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
        canvas.addEventListener("mouseout", handleMouseUp);

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
            <div id="container">
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
                    The Mandelbulb is a three-dimensional fractal, extending the
                    Mandelbrot Set into 3D space. It is generated using a
                    formula involving spherical coordinates and higher powers,
                    typically
                    <b>
                        z<sub>n+1</sub> = z<sub>n</sub>
                        <sup>8</sup> + c
                    </b>
                    , where z and c are 3D vectors.
                    <br />
                    This page renders the Mandelbulb using WebGL, allowing
                    smooth zooming and real-time rotation. Use the mouse wheel
                    to zoom (scroll up to zoom in), drag to rotate around the
                    fractal, or hold Shift and drag to translate along the
                    z-axis. Explore the complex, organic patterns within this
                    fractal, revealing the beauty of mathematical structures in
                    three dimensions.
                </p>
            </div>
        </>
    );
}
