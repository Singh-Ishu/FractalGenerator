/**
 * Koch Snowflake fractal visualization component
 * Renders the Koch Snowflake using WebGL with zoom and pan controls
 */

import { useEffect, useRef } from "react";
import Sidebar from "../../../components/Sidebar";
import "../../fractal.css";

import KochSnowflakeFrag from "../../../utils/shaders/KochSnowflake-frag";
import AllVert from "../../../utils/shaders/vert";

import { compileShader, createProgram } from "../../../utils/Helpers";

// Constants
const INITIAL_ZOOM = 3.0;
const ZOOM_FACTOR = 1.1;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 400;
const DEFAULT_ITERATIONS = 5;

/**
 * KochSnowflake component that renders an interactive Koch Snowflake
 * @returns {JSX.Element} The Koch Snowflake fractal page
 */
export default function KochSnowflake() {
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
     * Renders the Koch Snowflake with current parameters
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

        // Enable blending for smooth lines
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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
        const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, KochSnowflakeFrag);
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
                    The <strong>Koch Snowflake</strong> is a mathematical curve and one of the earliest 
                    fractal curves to be described. It was introduced by Swedish mathematician Helge von 
                    Koch in 1904. The snowflake is constructed by starting with an equilateral triangle 
                    and recursively adding smaller triangles to each line segment.
                </p>
                <p>
                    The Koch Snowflake has several fascinating properties: it has an infinite perimeter 
                    but encloses a finite area. With each iteration, the perimeter increases by a factor 
                    of 4/3, approaching infinity, while the area converges to 8/5 of the original triangle's 
                    area. This paradoxical nature makes it a perfect example of how fractals challenge our 
                    intuition about geometry.
                </p>
                <p>
                    The fractal dimension of the Koch Snowflake is approximately 1.262, placing it between 
                    a one-dimensional line and a two-dimensional surface. This property reflects its 
                    intricate, space-filling nature.
                </p>
            </div>
        </>
    );
}
