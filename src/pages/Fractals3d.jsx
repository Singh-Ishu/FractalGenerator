/**
 * 3D Fractals page component
 * Displays a carousel of 3D fractal cards with their equations
 */

import Card from "../components/Card";
import "./fractalinfo.css";

/**
 * Array of 3D fractal information
 * @type {Array<{name: string, equation: string, imageUrl: string, path?: string}>}
 */
const FRACTALS_3D = [
    {
        name: "Mandelbulb",
        equation: "z_n+1 = z_n^8 + c",
        imageUrl: "src/assets/PlainMandelbulb.png",
        path: "/3d/mandelbulb"
    },
    {
        name: "Menger Sponge (W.I.P)",
        equation: "3D generalization of the Sierpinski carpet",
        imageUrl: "src/assets/menger.png"
    },
    {
        name: "Quaternion Julia (W.I.P)",
        equation: "z_n+1 = z_n^2 + c, where z,c ∈ ℍ",
        imageUrl: "src/assets/quaternion.png"
    },
    {
        name: "Kleinian Groups (W.I.P)",
        equation: "Generated through Möbius transformations",
        imageUrl: "src/assets/kleinian.png"
    }
];

export default function Fractals3d() {
    // Duplicate the fractals array to create a seamless loop
    const duplicatedFractals = [...FRACTALS_3D, ...FRACTALS_3D];

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
