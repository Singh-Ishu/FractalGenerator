import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./fractal.css";

import JuliaFrag from "../utils/shaders/Julia-frag";
import MandelbrotVert from "../utils/shaders/vert"; // Using the same vertex shader

export default function JuliaSet() {
    const canvasRef = useRef(null);
    const glRef = useRef(null);
    const programRef = useRef(null);

    const [center, setCenter] = useState({ x: 0.0, y: 0.0 });
    const [zoom, setZoom] = useState(2.5);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext("webgl2");
        if (!gl) {
            alert("WebGL2 not supported");
            return;
        }

        glRef.current = gl;

        const vertShader = compileShader(gl, gl.VERTEX_SHADER, MandelbrotVert);
        const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, JuliaFrag);
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

        // Listen for updates from the sidebar
        window.addEventListener("fractal2dparams-update", renderFractal);

        // Handle zooming with the mouse wheel
        const handleWheel = (event) => {
            event.preventDefault(); // Prevent default scrolling
            const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
            setZoom((prevZoom) => prevZoom * zoomFactor);
        };

        canvas.addEventListener("wheel", handleWheel, { passive: false });

        // Handle panning with mouse drag
        const handleMouseDown = (event) => {
            setIsDragging(true);
            setDragStart({ x: event.clientX, y: event.clientY });
            canvas.style.cursor = "grabbing";
        };

        const handleMouseMove = (event) => {
            if (!isDragging) return;
            const deltaX = event.clientX - dragStart.x;
            const deltaY = event.clientY - dragStart.y;

            // Convert pixel movement to complex plane movement
            const moveX = (deltaX / canvas.width) * zoom;
            const moveY = (deltaY / canvas.height) * zoom;

            setCenter((prevCenter) => ({
                x: prevCenter.x - moveX,
                y: prevCenter.y + moveY, // Invert Y because screen Y goes down, complex Y goes up
            }));

            setDragStart({ x: event.clientX, y: event.clientY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            canvas.style.cursor = "grab";
        };

        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mouseout", handleMouseUp); // End drag if mouse leaves canvas

        // Clean up on unmount
        return () => {
            window.removeEventListener("fractal2dparams-update", renderFractal);
            canvas.removeEventListener("wheel", handleWheel);
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mouseout", handleMouseUp);
        };
    }, []); // Empty dependency array to run only once on mount

    // Re-render the fractal whenever center or zoom changes
    useEffect(() => {
        renderFractal();
    }, [center, zoom]);

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
        const juliaCLoc = gl.getUniformLocation(program, "juliaC");

        const canvas = gl.canvas;
        const aspectRatio = canvas.width / canvas.height;

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform2f(centerLoc, center.x * aspectRatio, center.y); // Adjust center for aspect ratio
        gl.uniform1f(zoomLoc, zoom);

        gl.uniform3f(
            colorLoc,
            params.r || 1.0,
            params.g || 1.0,
            params.b || 1.0
        ); // Default to white if not provided
        gl.uniform1i(insideBWLoc, params.insideBW ? 1 : 0);
        gl.uniform2f(juliaCLoc, params.zr || 0.285, params.zi || 0.01); // Default Julia constant

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
                    width={1200}
                    height={400}
                    style={{ cursor: "grab" }}
                ></canvas>
            </div>
            <div>
                <p>
                    The <strong>Julia Set</strong> is a family of fractals
                    closely related to the Mandelbrot Set. Unlike the Mandelbrot
                    Set, which explores whether a complex number remains bounded
                    when iterated, the Julia Set visualizes the behavior of{" "}
                    <strong>individual complex numbers</strong> under similar
                    iterative transformations. The general formula used is:
                </p>
                <p>
                    z<sub>n+1</sub> = z<sub>n</sub>
                    <sup>2</sup> + c
                </p>
                <p>
                    where <i>c</i> is a fixed complex constant. Different values
                    of <i>c</i> generate vastly different Julia Sets, some
                    appearing connected and others fragmented into intricate
                    dust-like structures. This visualization allows users to
                    explore how slight changes in parameters lead to strikingly
                    different patterns.
                </p>
            </div>
        </>
    );
}
