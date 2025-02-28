import Navbar from "./Navbar";
import "./Header.css";

export default function Header() {
  return (
    <div id="header-div">
      <a href="/">
        <h1>Fractalite</h1>
      </a>
      <Navbar />
    </div>
  );
}
