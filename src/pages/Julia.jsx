import React, { useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import "./fractal.css";
import renderMandelbrot from "../utils/Mandelbrot";
import { useLocation } from "react-router-dom";

export default function Mandelbrot() {
  const canvasRef = useRef(null);
  let location = useLocation();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      renderMandelbrot();
      console.log(location);
    }
  }, [canvasRef, location]);

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
          The <strong>Julia Set</strong> is a family of fractals closely related
          to the Mandelbrot Set. Unlike the Mandelbrot Set, which explores
          whether a complex number remains bounded when iterated, the Julia Set
          visualizes the behavior of <strong>individual complex numbers</strong>{" "}
          under similar iterative transformations. The general formula used is:
        </p>
        <p>
          z<sub>n+1</sub> = z<sub>n</sub>
          <sup>2</sup> + c
        </p>
        <p>
          where <i>c</i> is a fixed complex constant. Different values of{" "}
          <i>c</i> generate vastly different Julia Sets, some appearing
          connected and others fragmented into intricate dust-like structures.
          This visualization allows users to explore how slight changes in
          parameters lead to strikingly different patterns.
        </p>
      </div>
    </>
  );
}

// import Sidebar from "../components/Sidebar";

// export default function Julia() {
//   return (
//     <>
//       <div id="container">
//         <Sidebar />
//         <canvas id="drawing-board"></canvas>
//       </div>
//
//     </>
//   );
// }
