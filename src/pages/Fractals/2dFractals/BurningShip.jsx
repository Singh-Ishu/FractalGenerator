/**
 * Burning Ship fractal visualization component
 * Renders the Burning Ship fractal using WebGL with zoom and pan controls
 */

import { useEffect, useRef } from "react";
import Sidebar from "../../../components/Sidebar";
import "../../fractal.css";

import BurningFrag from "../../../utils/shaders/Burningship-frag";
import AllVert from "../../../utils/shaders/vert";

import { compileShader, createProgram } from "../../../utils/Helpers";

// Constants
const INITIAL_ZOOM = 2.5;
const ZOOM_FACTOR = 1.1;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 400;

/**
 * BurningShip component that renders an interactive Burning Ship fractal
 * @returns {JSX.Element} The Burning Ship fractal page
 */
export default function BurningShip() {
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
        const canvas = gl.canvas;

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform2f(centerLoc, centerRef.current.x, -centerRef.current.y);
        gl.uniform1f(zoomLoc, zoomRef.current);

        gl.uniform3f(colorLoc, params.r || 0, params.g || 0, params.b || 0);
        gl.uniform1i(insideBWLoc, params.insideBW ? 1 : 0);

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
        const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, BurningFrag);
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
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    style={{ cursor: "grab" }}
                ></canvas>
            </div>
            <div className="fractal-info">
                <p>
                    The <strong>Burning Ship fractal</strong> is a chaotic and
                    mesmerizing fractal variation that follows a modification of
                    the Mandelbrot equation. Instead of using the standard
                    complex squaring operation, it applies absolute values to
                    the real and imaginary components separately:
                </p>
                <p>
                    z<sub>n+1</sub> = (|Re(z<sub>n</sub>)| + i |Im(z<sub>n</sub>
                    )|)
                    <sup>2</sup> + c
                </p>
                <p>
                    This small tweak results in a fractal with a{" "}
                    <strong>sharp, jagged, ship-like appearance</strong>, in
                    contrast to the smooth curves of the Mandelbrot Set. The
                    fractal often resembles a turbulent seascape, giving it the
                    name "Burning Ship." By zooming into different regions, one
                    can uncover a landscape of branching structures and
                    intricate, chaotic formations.
                </p>
            </div>
        </>
    );
}
