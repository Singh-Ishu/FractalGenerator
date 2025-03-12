import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "./Header.css";

export default function Header() {
  return (
    <div id="header-div">
      <Link to="/FractalGenerator/Home">
        <h1>Fractalite</h1>
      </Link>
      <Navbar />
    </div>
  );
}
