/**
 * 3D Fractals page component
 * Displays a carousel of 3D fractal cards with their equations
 */

import Card from "../components/Card";
import "./fractalinfo.css";

//Import fractal images
import PlainMandelbulb from "../assets/PlainMandelbulb.png";

/**
 * Array of 3D fractal information
 * @type {Array<{name: string, equation: string, imageUrl: string, path?: string}>}
 */
const FRACTALS_3D = [
    {
        name: "Mandelbulb",
        equation: "z_n+1 = z_n^8 + c",
        imageUrl: PlainMandelbulb,
        path: "/3d/mandelbulb",
    },
    {
        name: "Menger Sponge (W.I.P)",
        equation: "3D generalization of the Sierpinski carpet",
        imageUrl: "src/assets/menger.png",
    },
    {
        name: "Quaternion Julia (W.I.P)",
        equation: "z_n+1 = z_n^2 + c, where z,c ∈ ℍ",
        imageUrl: "src/assets/quaternion.png",
    },
    {
        name: "Kleinian Groups (W.I.P)",
        equation: "Generated through Möbius transformations",
        imageUrl: "src/assets/kleinian.png",
    },
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
            <div className="fractal-info-text">
                <h2>What Are 3D Fractals?</h2>
                <br />
                <p>
                    3D fractals are the three-dimensional cousins of their 2D
                    counterparts, extending the magic of self-similarity into
                    space. These mathematical wonders repeat intricate patterns
                    at every scale, creating structures that seem to defy
                    reality with their infinite complexity. On{" "}
                    <em>Fractalite</em>, our WebGL-powered visualizations bring
                    these mesmerizing 3D fractals to life, letting you rotate,
                    zoom, and explore their depths right in your browser. What
                    makes 3D fractals so extraordinary? Let’s dive into their
                    spatial splendor and highlight some famous examples, each
                    with its own unique "cool factor."
                </p>
                <p>
                    A 3D fractal is a geometric form that exhibits
                    self-similarity in three dimensions—zooming in reveals
                    smaller versions of the same structure, endlessly repeating.
                    Unlike 2D fractals, which captivate on a flat plane, 3D
                    fractals add depth, creating sponge-like, crystalline, or
                    otherworldly shapes. Defined by surprisingly simple
                    mathematical rules, they produce intricate, almost alien
                    architectures. Our WebGL implementations allow you to
                    interact with these forms, rotating and slicing through
                    their layers to uncover their hidden beauty.
                </p>
                <h2>Famous 3D Fractals and Their Cool Factors</h2>
                <ol>
                    <li>
                        <p>
                            <strong>The Mandelbulb:</strong> An extension of the
                            2D Mandelbrot Set into three dimensions, the
                            Mandelbulb is a bulbous, organic-looking fractal
                            discovered through complex number iterations in 3D
                            space. Its surface is a chaotic blend of smooth
                            curves and jagged details. The Mandelbulb is like a
                            cosmic sculpture, with intricate, cloud-like
                            surfaces that seem to pulse with life. Zooming in
                            reveals miniature bulbs and spiraling patterns,
                            making it a perfect candidate for WebGL’s dynamic
                            rendering. It’s a testament to how math can sculpt
                            otherworldly beauty. Fun fact: The Mandelbulb was
                            only discovered in 2009, showing how 3D fractals
                            continue to push mathematical boundaries!
                        </p>
                    </li>
                    <li>
                        <p>
                            <strong>The Menger Sponge:</strong> Start with a
                            cube, divide it into 27 smaller cubes, and remove
                            the center cube and the six cubes touching its
                            faces. Repeat this process infinitely on the
                            remaining cubes. The result is a porous,
                            lattice-like structure. The Menger Sponge is a
                            marvel of negative space—its volume approaches zero
                            while its surface area grows infinitely. Rotating it
                            in WebGL reveals its cube-within-cube complexity,
                            like a futuristic architectural model. Fun fact: If
                            you could physically build a Menger Sponge, it would
                            be impossibly light yet infinitely detailed!
                        </p>
                    </li>
                    <li>
                        <p>
                            <strong>The Sierpinski Tetrahedron:</strong> A 3D
                            version of the Sierpinski Triangle, this fractal
                            starts with a tetrahedron (a four-sided pyramid) and
                            recursively removes smaller tetrahedra from its
                            corners, creating a porous, geometric web. Its
                            hypnotic, pyramid-like structure feels both solid
                            and ethereal, with repeating tetrahedral voids.
                            WebGL lets you spin and slice through its lattice,
                            revealing its orderly chaos. Fun fact: The
                            Sierpinski Tetrahedron’s structure inspires designs
                            in 3D printing and nanotechnology!
                        </p>
                    </li>
                </ol>
                <h2>Why 3D Fractals Are So Cool</h2>
                <ul>
                    <li>
                        <p>
                            <strong>Immersive Exploration:</strong> Rotating and
                            zooming into a 3D fractal feels like navigating an
                            alien world, with WebGL enabling smooth, interactive
                            journeys through their depths.
                        </p>
                    </li>
                    <li>
                        <p>
                            <strong>Math in Space:</strong> 3D fractals turn
                            abstract equations into tangible, sculptural forms,
                            blending logic with visual awe.
                        </p>
                    </li>
                    <li>
                        <p>
                            <strong>Nature’s 3D Echoes:</strong> From coral
                            reefs to mountain ranges, 3D fractals mimic nature’s
                            complex structures, offering a glimpse into the
                            universe’s design code.
                        </p>
                    </li>
                    <li>
                        <p>
                            <strong>Boundless Variety:</strong> From the organic
                            Mandelbulb to the geometric Menger Sponge, each 3D
                            fractal offers a unique visual adventure, perfect
                            for <em>Fractalite</em>’s interactive platform.
                        </p>
                    </li>
                </ul>
                <p>
                    <strong>Experience 3D Fractals on Fractalite</strong>
                    <br />
                    With <em>Fractalite</em>’s WebGL-powered platform, you can
                    explore these 3D fractals in real-time, rotating their
                    structures, zooming into their infinite details, or tweaking
                    parameters to create your own variations. Whether you’re a
                    math enthusiast, a 3D artist, or simply curious, our
                    visualizations make 3D fractals accessible and breathtaking.
                    Spin through the Mandelbulb’s organic curves, dissect the
                    Menger Sponge’s lattice, or marvel at the Sierpinski
                    Tetrahedron’s geometric elegance. The world of 3D fractals
                    awaits—start your journey today!
                </p>
            </div>
        </div>
    );
}
