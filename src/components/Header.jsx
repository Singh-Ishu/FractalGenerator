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
                        <Link to="/2D">2D Fractals</Link>
                    </li>
                    <li>
                        <Link to="/3D">3D Fractals</Link>
                    </li>
                    <li>
                        <Link to="/About">About</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
