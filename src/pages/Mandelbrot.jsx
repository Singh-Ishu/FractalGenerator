import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "./fractal.css";
import renderMandelbrot from "../utils/Mandelbrot";

export default function Mandelbrot() {
  useEffect(() => {
    renderMandelbrot();
  }, []);

  return (
    <div id="container">
      <Sidebar onGenerate={renderMandelbrot} />
      <canvas id="drawing-board"></canvas>
    </div>
  );
}
