/**
 * 2D Fractals page component
 * Displays a carousel of 2D fractal cards with their equations
 */

import Card from "../components/Card";
import "./fractalinfo.css";

//Import fractal images
import PlainMandelbrot from "../assets/PlainMandelbrot.png";
import PlainJulia from "../assets/PlainJulia.png";
import PlainBurningShip from "../assets/PlainBurningShip.png";

/**
 * Array of 2D fractal information
 * @type {Array<{name: string, equation: string, imageUrl: string, path?: string}>}
 */
const FRACTALS_2D = [
    {
        name: "Mandelbrot",
        equation: "z_n+1 = z_n^2 + c",
        imageUrl: PlainMandelbrot,
        path: "/2d/mandelbrot",
    },
    {
        name: "Julia",
        equation: "z_n+1 = z_n^2 + c",
        imageUrl: PlainJulia,
        path: "/2d/julia",
    },
    {
        name: "Burning Ship",
        equation: "z_n+1 = (|Re(z_n)| + i|Im(z_n)|)^2 + c",
        imageUrl: PlainBurningShip,
        path: "/2d/burning-ship",
    },
    {
        name: "Sierpinski Triangle",
        equation: "Fractal generated through recursive subdivision",
        imageUrl: PlainMandelbrot,
        path: "/2d/sierpinski",
    },
    {
        name: "Koch Snowflake",
        equation: "Fractal generated through recursive edge replacement",
        imageUrl: PlainJulia,
        path: "/2d/koch-snowflake",
    },
    {
        name: "Barnsley Fern",
        equation: "Generated using iterated function system (IFS)",
        imageUrl: PlainBurningShip,
        path: "/2d/barnsley-fern",
    },
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
            <div className="fractal-info-text">
                <h2>What Are 2D Fractals?</h2>
                <br />
                <p>
                    Fractals are nature’s artwork, mathematical marvels that
                    repeat intricate patterns at every scale, creating visuals
                    that are both mind-bending and beautiful. On Fractalite, we
                    bring these captivating structures to life using WebGL,
                    letting you dive into the infinite complexity of 2D fractals
                    right in your browser. But what makes 2D fractals so
                    special? Let’s explore their magic and spotlight some famous
                    ones, each with its own unique "cool factor."
                </p>
                <p>
                    A 2D fractal is a geometric shape that exhibits
                    self-similarity—meaning zooming in reveals smaller versions
                    of the same pattern, repeating endlessly. Unlike 3D
                    fractals, which add depth, 2D fractals thrive in a flat
                    plane, yet their complexity creates an illusion of infinite
                    depth. From spiraling swirls to jagged edges, these shapes
                    are defined by simple mathematical rules that produce
                    stunningly intricate results. Our WebGL implementations let
                    you interact with these patterns, zooming and panning to
                    uncover their hidden layers.
                </p>
                <h2>Famous 2D Fractals and Their Cool Factors</h2>
                <ol>
                    <li>
                        <p>
                            <strong>The Mandelbrot Set:</strong> Discovered by
                            Benoit Mandelbrot, the "father of fractals," this is
                            the rockstar of 2D fractals. It’s a set of complex
                            numbers plotted on a plane, creating a jagged, black
                            shape surrounded by vibrant, infinitely detailed
                            boundaries. The Mandelbrot Set is like a cosmic
                            treasure map. Zoom into its edges, and you’ll find
                            miniature versions of the set itself, alongside
                            swirling spirals, seahorse-like curls, and
                            psychedelic colors. No matter how deep you go, new
                            patterns emerge, making it a perfect showcase for
                            WebGL’s smooth rendering. It’s a visual proof that
                            simple math can create infinite beauty. Fun fact:
                            The Mandelbrot Set’s boundary is so complex that its
                            length is infinite, yet it fits within a finite
                            area!
                        </p>
                    </li>
                    <li>
                        <p>
                            <strong>The Julia Set:</strong> Closely related to
                            the Mandelbrot Set, Julia Sets are generated using
                            similar complex number iterations but vary depending
                            on a chosen constant. Each constant creates a unique
                            fractal shape. Julia Sets are like the Mandelbrot’s
                            adventurous cousins, offering endless variety. Some
                            resemble spiraling galaxies, while others look like
                            jagged lightning bolts. With Fractalite’s WebGL
                            tools, you can tweak parameters in real-time to
                            explore countless Julia Set variations, each a new
                            visual surprise. Fun fact: The Mandelbrot Set acts
                            as a "map" for Julia Sets—points inside the
                            Mandelbrot Set produce connected Julia fractals,
                            while points outside yield scattered, dust-like
                            patterns.
                        </p>
                    </li>
                    <li>
                        <p>
                            <strong>The Sierpinski Triangle:</strong> This
                            fractal starts with a single triangle, which is
                            recursively divided into smaller triangles, leaving
                            gaps that form a pattern resembling a sieve. Its
                            simplicity is its charm. The Sierpinski Triangle
                            looks like a geometric puzzle, with a lace-like
                            structure that’s both orderly and chaotic. It’s a
                            fantastic example of how a straightforward
                            rule—remove the center of a triangle
                            repeatedly—creates intricate beauty. Our WebGL
                            animations make it mesmerizing to watch the triangle
                            evolve. Fun fact: The Sierpinski Triangle appears in
                            unexpected places, like the patterns of some
                            seashells or the structure of certain algorithms!
                        </p>
                    </li>
                    <li>
                        <p>
                            <strong>The Koch Snowflake:</strong> Start with a
                            triangle, then add smaller triangles to each side,
                            repeating infinitely. The result is a snowflake-like
                            shape with a jagged, ever-expanding perimeter. The
                            Koch Snowflake is a paradox in action: its boundary
                            grows infinitely long while enclosing a finite area.
                            Its crystalline, wintry aesthetic makes it a visual
                            delight, and our WebGL rendering lets you zoom into
                            its delicate edges, revealing endless detail. Fun
                            fact: If you could fold a piece of paper using the
                            Koch Snowflake’s recursive rule, you’d end up with
                            an impossibly long edge in a tiny space!
                        </p>
                    </li>
                </ol>

                <h2>Why 2D Fractals Are So Cool</h2>

                <ul>
                    <li>
                        <p>
                            <strong>Infinite Exploration:</strong> Zooming into
                            a 2D fractal feels like diving into a universe where
                            every level reveals new surprises. WebGL makes this
                            journey smooth and interactive.
                        </p>
                    </li>
                    <li>
                        <p>
                            <strong>Math Meets Art:</strong> Fractals bridge the
                            gap between cold equations and stunning visuals,
                            showing how beauty can emerge from logic.
                        </p>
                    </li>
                    <li>
                        <p>
                            <strong>Nature’s Blueprint:</strong> Fractals mimic
                            patterns in nature—think coastlines, ferns, or
                            lightning. Exploring them feels like decoding the
                            universe’s design.
                        </p>
                    </li>
                    <li>
                        <p>
                            <strong>Endless Variety:</strong> From the cosmic
                            Mandelbrot Set to the delicate Sierpinski Triangle,
                            each fractal offers a unique visual experience,
                            perfect for Fractalite’s interactive displays.
                        </p>
                    </li>
                </ul>
                <p>
                    <strong>Experience Fractals on Fractalite</strong>
                    <br />
                    With Fractalite’s WebGL-powered platform, you can explore
                    these 2D fractals in real-time, zooming into their infinite
                    depths or tweaking parameters to create your own variations.
                    Whether you’re a math enthusiast, an artist, or just
                    curious, our visualizations make fractals accessible and
                    awe-inspiring. Dive into the Mandelbrot Set’s psychedelic
                    edges, play with Julia Set patterns, or marvel at the Koch
                    Snowflake’s icy elegance. The world of 2D fractals is
                    waiting for you to explore—start your journey today!
                </p>
            </div>
        </div>
    );
}
