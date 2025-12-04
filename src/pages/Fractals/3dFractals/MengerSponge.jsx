/**
 * Menger Sponge 3D fractal visualization component
 * Renders the Menger Sponge using WebGL with rotation and zoom controls
 */

import { useEffect, useRef } from "react";
import Sidebar from "../../../components/Sidebar";
import "../../fractal.css";

import MengerSpongeFrag from "../../../utils/shaders/MengerSponge-frag";
import AllVert from "../../../utils/shaders/vert";

import { compileShader, createProgram } from "../../../utils/Helpers";

// Constants
const INITIAL_ZOOM_3D = 1.0;
const ZOOM_FACTOR = 1.1;
const ROTATION_SENSITIVITY = 0.5;
const MIN_PITCH = -90.0;
const MAX_PITCH = 90.0;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 400;

/**
 * MengerSponge component that renders an interactive 3D Menger Sponge fractal
 * @returns {JSX.Element} The Menger Sponge fractal page
 */
export default function MengerSponge() {
    // Canvas and WebGL references
    const canvasRef = useRef(null);
    const glRef = useRef(null);
    const programRef = useRef(null);
    
    // View state
    const zoomRef = useRef(INITIAL_ZOOM_3D);
    const centerRef = useRef({ x: 0.0, y: 0.0, z: 0.0 });
    const anglesRef = useRef({ yaw: 0.0, pitch: 0.0 });
    
    // Interaction state
    const draggingRef = useRef(false);
    const startPosRef = useRef({ x: 0, y: 0 });

    /**
     * Renders the Menger Sponge with current parameters
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
        const yawLocation = gl.getUniformLocation(program, "yaw");
        const pitchLocation = gl.getUniformLocation(program, "pitch");
        const canvas = gl.canvas;

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform3f(
            centerLocation,
            centerRef.current.x,
            centerRef.current.y,
            centerRef.current.z
        );
        gl.uniform1f(zoomLocation, zoomRef.current);
        gl.uniform3f(
            colorLocation,
            params.r || 1.0,
            params.g || 0.8,
            params.b || 0.6
        );
        gl.uniform1i(insideBWLocation, params.insideBW ? 1 : 0);
        gl.uniform1f(yawLocation, anglesRef.current.yaw);
        gl.uniform1f(pitchLocation, anglesRef.current.pitch);

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
            MengerSpongeFrag
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

        renderFractal();

        // Listen for updates
        window.addEventListener("fractal2dparams-update", renderFractal);

        // Zoom functionality
        const handleWheel = (event) => {
            event.preventDefault();
            const zoomMultiplier = event.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
            zoomRef.current *= zoomMultiplier;
            renderFractal();
        };

        canvas.addEventListener("wheel", handleWheel, { passive: false });

        // Rotation functionality
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
                centerRef.current.z += (deltaY / canvas.height) * zoomRef.current;
            } else {
                // Rotate (yaw and pitch)
                anglesRef.current.yaw -= deltaX * ROTATION_SENSITIVITY;
                anglesRef.current.pitch -= deltaY * ROTATION_SENSITIVITY;
                
                // Clamp pitch to avoid flipping
                anglesRef.current.pitch = Math.max(
                    MIN_PITCH,
                    Math.min(MAX_PITCH, anglesRef.current.pitch)
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
            <div className="fractal-page-container">
                <Sidebar />
                <canvas
                    ref={canvasRef}
                    id="drawing-board"
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                ></canvas>
            </div>
            <div className="fractal-info">
                <p>
                    The <strong>Menger Sponge</strong> is a three-dimensional fractal curve, first 
                    described by Austrian mathematician Karl Menger in 1926. It's the 3D analog of the 
                    Sierpinski carpet and is constructed by recursively removing cubes from a larger cube.
                </p>
                <p>
                    Starting with a cube, the construction divides it into 27 smaller cubes (3×3×3) and 
                    removes the center cube and the six cubes touching its faces. This process is repeated 
                    infinitely on each remaining cube. The result is a structure with zero volume but 
                    infinite surface area—a mind-bending property that challenges our understanding of 
                    three-dimensional space.
                </p>
                <p>
                    The Menger Sponge has a fractal dimension of approximately 2.727, placing it between 
                    a two-dimensional surface and a three-dimensional solid. Use your mouse to rotate the 
                    sponge and explore its intricate, porous structure. Hold Shift while dragging to 
                    translate along the z-axis.
                </p>
            </div>
        </>
    );
}
