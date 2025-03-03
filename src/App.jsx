import { Route, Routes } from "react-router-dom";
import "../index.css";

import Home from "./pages/Home";
import Mandelbrot from "./pages/Mandelbrot";
import Julia from "./pages/Julia";
import BurningShip from "./pages/BurningShip";
import Mandelbulb from "./pages/MandelBulb";

import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/FractalGenerator/Mandelbrot" element={<Mandelbrot />} />
        <Route path="/Julia" element={<Julia />} />
        <Route path="/Burningship" element={<BurningShip />} />
        <Route path="/Mandelbulb" element={<Mandelbulb />} />
      </Routes>
    </>
  );
}

export default App;
