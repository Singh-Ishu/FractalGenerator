/**
 * Barnsley Fern fractal visualization component
 * Renders the Barnsley Fern using Iterated Function System (IFS)
 */

import { useEffect, useRef } from "react";
import Sidebar from "../../../components/Sidebar";
import "../../fractal.css";

import BarnsleyFernFrag from "../../../utils/shaders/BarnsleyFern-frag";
import AllVert from "../../../utils/shaders/vert";

import { compileShader, createProgram } from "../../../utils/Helpers";

// Constants
const INITIAL_ZOOM = 5.0;
const ZOOM_FACTOR = 1.1;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 400;
const FERN_POINTS = 100000;

/**
 * BarnsleyFern component that renders an interactive Barnsley Fern
 * @returns {JSX.Element} The Barnsley Fern fractal page
 */
export default function BarnsleyFern() {
    // Canvas and WebGL references
    const canvasRef = useRef(null);
    const glRef = useRef(null);
    const programRef = useRef(null);
    const textureRef = useRef(null);
    
    // View state
    const zoomRef = useRef(INITIAL_ZOOM);
    const centerRef = useRef({ x: 0.0, y: -2.5 });
    
    // Interaction state
    const draggingRef = useRef(false);
    const startPosRef = useRef({ x: 0, y: 0 });

    /**
     * Generates the Barnsley Fern using IFS
     */
    function generateFern() {
        const size = 512;
        const data = new Uint8Array(size * size);
        
        let x = 0;
        let y = 0;
        
        for (let i = 0; i < FERN_POINTS; i++) {
            const r = Math.random();
            let nextX, nextY;
            
            if (r < 0.01) {
                // Stem
                nextX = 0;
                nextY = 0.16 * y;
            } else if (r < 0.86) {
                // Successively smaller leaflets
                nextX = 0.85 * x + 0.04 * y;
                nextY = -0.04 * x + 0.85 * y + 1.6;
            } else if (r < 0.93) {
                // Largest left-hand leaflet
                nextX = 0.2 * x - 0.26 * y;
                nextY = 0.23 * x + 0.22 * y + 1.6;
            } else {
                // Largest right-hand leaflet
                nextX = -0.15 * x + 0.28 * y;
                nextY = 0.26 * x + 0.24 * y + 0.44;
            }
            
            x = nextX;
            y = nextY;
            
            // Map to texture coordinates
            const px = Math.floor((x + 3) * size / 6);
            const py = Math.floor((y) * size / 10);
            
            if (px >= 0 && px < size && py >= 0 && py < size) {
                const idx = py * size + px;
                data[idx] = Math.min(255, data[idx] + 1);
            }
        }
        
        return data;
    }

    /**
     * Renders the Barnsley Fern with current parameters
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
        const canvas = gl.canvas;

        // Set viewport and uniforms
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform2f(centerLocation, centerRef.current.x, centerRef.current.y);
        gl.uniform1f(zoomLocation, zoomRef.current);

        gl.uniform3f(colorLocation, params.r || 0, params.g || 1, params.b || 0);
        gl.uniform1i(insideBWLocation, params.insideBW ? 1 : 0);

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

        // Generate fern texture
        const fernData = generateFern();
        const texture = gl.createTexture();
        textureRef.current = texture;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, 512, 512, 0, gl.RED, gl.UNSIGNED_BYTE, fernData);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const vertShader = compileShader(gl, gl.VERTEX_SHADER, AllVert);
        const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, BarnsleyFernFrag);
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
                    The <strong>Barnsley Fern</strong> is a fractal named after British mathematician 
                    Michael Barnsley, who first described it in his book "Fractals Everywhere" in 1988. 
                    Unlike many fractals that use recursive geometric subdivision, the Barnsley Fern is 
                    generated using an Iterated Function System (IFS).
                </p>
                <p>
                    The fern is created by repeatedly applying one of four affine transformations, each 
                    chosen with a specific probability. These transformations represent different parts 
                    of the fern: the stem (1% probability), the successively smaller leaflets (85%), and 
                    the largest left and right leaflets (7% each). This probabilistic approach creates a 
                    remarkably realistic representation of a natural fern.
                </p>
                <p>
                    The Barnsley Fern demonstrates how simple mathematical rules can produce complex, 
                    organic-looking structures that closely resemble forms found in nature. It's a 
                    beautiful example of how fractals bridge the gap between mathematics and biology.
                </p>
            </div>
        </>
    );
}
