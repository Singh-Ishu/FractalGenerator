import Sidebar from "../components/Sidebar";
import "./fractal.css";

export default function Mandelbrot() {
  return (
    <>
      <Sidebar id="sidebar" />
      <canvas id="drawing-board"></canvas>
    </>
  );
}
