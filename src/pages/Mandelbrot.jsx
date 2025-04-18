import React, { useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import "./fractal.css";

import MandelbrotFrag from "../utils/shaders/Mandelbrot-frag";
import MandelbrotVert from "../utils/shaders/Mandelbrot-vert";

export default function Mandelbrot() {
    window.addEventListener("storage", () => {});
    return (
        <>
            <div id="container">
                <Sidebar />

                <canvas id="drawing-board" width={800} height={800}></canvas>
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
