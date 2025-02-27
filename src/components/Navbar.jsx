import "./Navbar.css";

export default function Navbar() {
  return (
    <div id="navbar-div">
      <ul>
        <a href="/pages/Mandelbrot.jsx">
          <li>Mandelbrot</li>
        </a>
        <a href="/pages/Julia.jsx">
          <li>Julia</li>
        </a>
        <a href="/pages/BurningShip.jsx">
          <li>Burning Ship</li>
        </a>
        <a href="/pages/Mandelbulb.jsx">
          <li>Mandelbulb</li>
        </a>
      </ul>
    </div>
  );
}
