import { Link, Route, Routes } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <div id="navbar-div">
      <ul>
        <li>
          <Link to="/FractalGenerator/Mandelbrot">Mandelbrot</Link>
        </li>
        <li>
          <Link to="/FractalGenerator/Julia">Julia</Link>
        </li>
        <li>
          <Link to="/FractalGenerator/Burningship">Burning Ship</Link>
        </li>
        <li>
          <Link to="/FractalGenerator/Mandelbulb">Mandelbulb</Link>
        </li>
      </ul>
    </div>
  );
}
