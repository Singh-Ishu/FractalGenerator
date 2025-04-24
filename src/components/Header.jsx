import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
    return (
        <div id="header-container-div">
            <div id="header-div">
                <Link to="/">
                    <h1>Fractalite</h1>
                </Link>
            </div>
            <div id="header-navbar-div">
                <ul>
                    <li>
                        <Link to="/2D/Mandelbrot">Mandelbrot</Link>
                    </li>
                    <li>
                        <Link to="/2D/Julia">Julia</Link>
                    </li>
                    <li>
                        <Link to="/2D/Burningship">Burning Ship</Link>
                    </li>
                    <li />
                    <li>
                        <Link to="/3D/Mandelbulb">Mandelbulb</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
