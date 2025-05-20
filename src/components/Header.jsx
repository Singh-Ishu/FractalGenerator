/**
 * Header component that displays the main navigation and search functionality.
 * Contains the site title, navigation links, and search bar.
 */

import { Link } from "react-router-dom";
import Searchbar from "./Searchbar";
import "./Header.css";

/**
 * Header component that renders the main navigation header.
 * @returns {JSX.Element} The header component with navigation and search
 */
export default function Header() {
    return (
        <header className="header">
            <div className="header__title">
                <Link to="/">
                    <h1>Fractalite</h1>
                </Link>
            </div>
            
            <nav className="header__nav">
                <ul className="header__nav-list">
                    <li className="header__nav-item">
                        <Link to="/2d">2D Fractals</Link>
                    </li>
                    <li className="header__nav-item">
                        <Link to="/3d">3D Fractals</Link>
                    </li>
                    <li className="header__nav-item">
                        <Link to="/about">About</Link>
                    </li>
                </ul>
            </nav>
            
            <Searchbar />
        </header>
    );
}
