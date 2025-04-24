import { Route, Routes } from "react-router-dom";
import "../index.css";

import Home from "./pages/Home";
import Mandelbrot from "./pages/Fractals/2dFractals/Mandelbrot";
import Julia from "./pages/Fractals/2dFractals/Julia";
import BurningShip from "./pages/Fractals/2dFractals/BurningShip";
import Mandelbulb from "./pages/Fractals/3dFractals/MandelBulb";

import Header from "./components/Header";

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/2D/Mandelbrot" element={<Mandelbrot />} />
                <Route path="/2D/Julia" element={<Julia />} />
                <Route path="/2D/Burningship" element={<BurningShip />} />
                <Route path="/3D/Mandelbulb" element={<Mandelbulb />} />
            </Routes>
        </>
    );
}

export default App;
