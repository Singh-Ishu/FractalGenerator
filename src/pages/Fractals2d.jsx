/**
 * 2D Fractals page component
 * Displays a carousel of 2D fractal cards with their equations
 */

import Card from "../components/Card";
import "./fractalinfo.css";

/**
 * Array of 2D fractal information
 * @type {Array<{name: string, equation: string, imageUrl: string, path?: string}>}
 */
const FRACTALS_2D = [
    {
        name: "Mandelbrot",
        equation: "z_n+1 = z_n^2 + c",
        imageUrl: "src/assets/PlainMandelbrot.png",
        path: "/2d/mandelbrot"
    },
    {
        name: "Julia",
        equation: "z_n+1 = z_n^2 + c",
        imageUrl: "src/assets/PlainJulia.png",
        path: "/2d/julia"
    },
    {
        name: "Burning Ship",
        equation: "z_n+1 = (|Re(z_n)| + i|Im(z_n)|)^2 + c",
        imageUrl: "src/assets/PlainBurningShip.png",
        path: "/2d/burning-ship"
    },
    {
        name: "Sierpinski Triangle (W.I.P)",
        equation: "Fractal generated through recursive subdivision",
        imageUrl: "src/assets/sierpinski.png"
    },
    {
        name: "Koch Snowflake (W.I.P)",
        equation: "Fractal generated through recursive edge replacement",
        imageUrl: "src/assets/koch.png"
    },
    {
        name: "Barnsley Fern (W.I.P)",
        equation: "Generated using iterated function system (IFS)",
        imageUrl: "src/assets/fern.png"
    }
];

export default function Fractals2d() {
    // Duplicate the fractals array to create a seamless loop
    const duplicatedFractals = [...FRACTALS_2D, ...FRACTALS_2D];

    return (
        <div className="fractal-info-page-container">
            <div className="card-carousel">
                {duplicatedFractals.map((fractal, index) => (
                    <Card
                        key={`${fractal.name}-${index}`}
                        name={fractal.name}
                        equation={fractal.equation}
                        imageUrl={fractal.imageUrl}
                        path={fractal.path}
                    />
                ))}
            </div>
        </div>
    );
}
