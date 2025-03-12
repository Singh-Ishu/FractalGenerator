import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./fractal.css";
import renderMandelbrot from "../utils/Mandelbrot";

export default function Mandelbrot() {
  const location = useLocation(); // Get current route

  useEffect(() => {
    renderMandelbrot(); // Re-run WebGL rendering when navigating back
  }, [location.pathname]); // Depend on the route, so it re-renders

  return (
    <div id="container">
      <Sidebar />
      <canvas id="drawing-board" onLoad={renderMandelbrot()}></canvas>
    </div>
  );
}
