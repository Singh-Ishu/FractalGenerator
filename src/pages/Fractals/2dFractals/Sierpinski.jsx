/**
 * Sierpinski Triangle fractal visualization component
 * Renders the Sierpinski Triangle using WebGL with zoom and pan controls
 */

import { useEffect, useRef } from "react";
import Sidebar from "../../../components/Sidebar";
import "../../fractal.css";

import SierpinskiFrag from "../../../utils/shaders/Sierpinski-frag";
import AllVert from "../../../utils/shaders/vert";

import { compileShader, createProgram } from "../../../utils/Helpers";

// Constants
const INITIAL_ZOOM = 2.5;
const ZOOM_FACTOR = 1.1;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 400;
const DEFAULT_ITERATIONS = 7;

/**
 * Sierpinski component that renders an interactive Sierpinski Triangle
 * @returns {JSX.Element} The Sierpinski Triangle fractal page
 */
export default function Sierpinski() {
    // Canvas and WebGL references
    const canvasRef = useRef(null);
    const glRef = useRef(null);
    const programRef = useRef(null);
    
    // View state
    const zoomRef = useRef(INITIAL_ZOOM);
    const centerRef = useRef({ x: 0.0, y: 0.0 });
    
    // Interaction state
    const draggingRef = useRef(false);
    const startPosRef = useRef({ x: 0, y: 0 });

    /**
     * Renders the Sierpinski Triangle with current parameters
     */
    function renderFractal() {
        const gl = glRef.current;
        const program = programRef.current;
        if (!gl || !program) return;

        gl.useProgram(program);
        const params =
            JSON.parse(localStorage.getItem("fractal2dparams")) || {};

        // Get uniform locations
        const resolutionLocation = gl.getUniformLocation(program, "resolution");
        const centerLocation = gl.getUniformLocation(program, "center");
        const zoomLocation = gl.getUniformLocation(program, "zoom");
        const colorLocation = gl.getUniformLocation(program, "colorMultiplier");
        const insideBWLocation = gl.getUniformLocation(program, "insideBW");
        const iterationsLocation = gl.getUniformLocation(program, "iterations");
        const canvas = gl.canvas;

        // Set viewport and uniforms
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform2f(centerLocation, centerRef.current.x, centerRef.current.y);
        gl.uniform1f(zoomLocation, zoomRef.current);

        gl.uniform3f(colorLocation, params.r || 1, params.g || 1, params.b || 1);
        gl.uniform1i(insideBWLocation, params.insideBW ? 1 : 0);
        gl.uniform1i(iterationsLocation, DEFAULT_ITERATIONS);

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
        const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, SierpinskiFrag);
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

        renderFractal();

        // Listen for updates
        window.addEventListener("fractal2dparams-update", renderFractal);

        // Zoom functionality
        const handleWheel = (event) => {
            event.preventDefault();
            const zoomMultiplier = event.deltaY > 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
            zoomRef.current *= zoomMultiplier;
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
            centerRef.current.y += (deltaY / canvas.height) * zoomRef.current;

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
            <div className="fractal-page-container">
                <Sidebar />
                <canvas
                    ref={canvasRef}
                    id="drawing-board"
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    style={{ cursor: "grab" }}
                ></canvas>
            </div>
            <div className="fractal-info">
                <p>
                    The <strong>Sierpinski Triangle</strong> is one of the most recognizable fractals, 
                    created through recursive subdivision. Starting with an equilateral triangle, the 
                    process repeatedly removes the middle triangle from each remaining triangle, creating 
                    a pattern that exhibits perfect self-similarity at every scale.
                </p>
                <p>
                    Named after Polish mathematician Wacław Sierpiński, this fractal demonstrates how 
                    simple geometric rules can create infinitely complex patterns. The Sierpinski Triangle 
                    has a fractal dimension of approximately 1.585, falling between a one-dimensional line 
                    and a two-dimensional plane.
                </p>
                <p>
                    Interestingly, the Sierpinski Triangle appears in Pascal's triangle when odd numbers 
                    are colored differently from even numbers, revealing deep connections between geometry 
                    and number theory.
                </p>
            </div>
        </>
    );
}
