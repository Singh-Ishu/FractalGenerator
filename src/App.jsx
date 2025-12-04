/**
 * Main App component that handles routing and layout structure.
 * Contains all the route definitions for the application.
 */

import { Route, Routes } from "react-router-dom";
import "../index.css";

// Page Components
import Home from "./pages/Home";
import About from "./pages/About";
import Fractals2d from "./pages/Fractals2d";
import Fractals3d from "./pages/Fractals3d";

// 2D Fractal Components
import Mandelbrot from "./pages/Fractals/2dFractals/Mandelbrot";
import Julia from "./pages/Fractals/2dFractals/Julia";
import BurningShip from "./pages/Fractals/2dFractals/BurningShip";
import Sierpinski from "./pages/Fractals/2dFractals/Sierpinski";
import KochSnowflake from "./pages/Fractals/2dFractals/KochSnowflake";
import BarnsleyFern from "./pages/Fractals/2dFractals/BarnsleyFern";

// 3D Fractal Components
import Mandelbulb from "./pages/Fractals/3dFractals/MandelBulb";
import MengerSponge from "./pages/Fractals/3dFractals/MengerSponge";
import QuaternionJulia from "./pages/Fractals/3dFractals/QuaternionJulia";
import Kleinian from "./pages/Fractals/3dFractals/Kleinian";

// Layout Components
import Header from "./components/Header";

/**
 * App component that defines the main application structure and routing.
 * @returns {JSX.Element} The rendered application
 */
function App() {
    return (
        <>
            <Header />
            <Routes>
                {/* Main Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                
                {/* 2D Fractal Routes */}
                <Route path="/2d" element={<Fractals2d />} />
                <Route path="/2d/mandelbrot" element={<Mandelbrot />} />
                <Route path="/2d/julia" element={<Julia />} />
                <Route path="/2d/burning-ship" element={<BurningShip />} />
                <Route path="/2d/sierpinski" element={<Sierpinski />} />
                <Route path="/2d/koch-snowflake" element={<KochSnowflake />} />
                <Route path="/2d/barnsley-fern" element={<BarnsleyFern />} />
                
                {/* 3D Fractal Routes */}
                <Route path="/3d" element={<Fractals3d />} />
                <Route path="/3d/mandelbulb" element={<Mandelbulb />} />
                <Route path="/3d/menger-sponge" element={<MengerSponge />} />
                <Route path="/3d/quaternion-julia" element={<QuaternionJulia />} />
                <Route path="/3d/kleinian" element={<Kleinian />} />
            </Routes>
        </>
    );
}

export default App;
