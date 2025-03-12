import { Link, Route, Routes } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <div id="navbar-div">
      <ul>
        <li>
          <Link to="/Mandelbrot">Mandelbrot</Link>
        </li>
        <li>
          <Link to="Julia">Julia</Link>
        </li>
        <li>
          <Link to="Burningship">Burning Ship</Link>
        </li>
        <li>
          <Link to="Mandelbulb">Mandelbulb</Link>
        </li>
      </ul>
    </div>
  );
}
