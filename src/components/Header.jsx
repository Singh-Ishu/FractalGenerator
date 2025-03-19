import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <div id="header-div">
      <Link to="/">
        <h1>Fractalite</h1>
      </Link>
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
    </div>
  );
}
