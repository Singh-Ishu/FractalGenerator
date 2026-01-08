import FractalDimTemplate from "./fractalDimTemplate";
// import "./fractalinfo.css"; // Removed to use clean template styles

//Import fractal images
import PlainMandelbrot from "../assets/PlainMandelbrot.png";
import PlainJulia from "../assets/PlainJulia.png";
import PlainBurningShip from "../assets/PlainBurningShip.png";

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

const CAROUSEL_ITEMS = [
    { url: "https://upload.wikimedia.org/wikipedia/commons/2/21/Mandel_zoom_00_mandelbrot_set.jpg", link: "/2d/mandelbrot", title: "Mandelbrot Set" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Julia_set_%28C_%3D_0.285_%2B_0.01i%29.jpg/1200px-Julia_set_%28C_%3D_0.285_%2B_0.01i%29.jpg", link: "/2d/julia", title: "Julia Set" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Von_Koch_curve.gif", link: "/2d/koch-snowflake", title: "Koch Snowflake" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sierpinski_triangle.svg/1200px-Sierpinski_triangle.svg.png", link: "/2d/sierpinski", title: "Sierpinski Triangle" }
];

export default function Fractals2d() {
    // Duplicate the fractals for loop in the template (template doesn't loop automatically unless we pass a lot? Logic is in map)
    // Actually the card section in template just maps over 'cards'.
    // The previous implementation mapped duplicatedFractals. Let's pass FRACTALS_2D directly or duplicated if we want a long list.
    // User requested "horizontal layout" which implies a list, maybe specific count.
    // The original `Fractals2d.jsx` looped `duplicatedFractals` inside a `.card-carousel`. 
    // The NEW template uses `.cardsSection` which is a vertical stack of horizontal cards.
    // So we should pass FRACTALS_2D directly.

    const description = (
        <>
            <p>
                Fractals are nature’s artwork, mathematical marvels that
                repeat intricate patterns at every scale, creating visuals
                that are both mind-bending and beautiful. On Fractalite, we
                bring these captivating structures to life using WebGL,
                letting you dive into the infinite complexity of 2D fractals
                right in your browser.
            </p>
            <p>
                A 2D fractal is a geometric shape that exhibits
                self-similarity—meaning zooming in reveals smaller versions
                of the same pattern, repeating endlessly. Unlike 3D
                fractals, which add depth, 2D fractals thrive in a flat
                plane, yet their complexity creates an illusion of infinite
                depth.
            </p>
        </>
    );

    const subHeadingContent = (
        <div className="fractal-info-text">
            <h2>Famous 2D Fractals</h2>
            {/* We can re-use the detailed list here if needed, or simplify. 
                 The original had a big <ol> list. I will try to preserve some of it or keep it cleaner as per "clean" request.
                 Let's put the big detailed text here properly structured or simplifed.
             */}
            <p>From the Mandelbrot Set to the Sierpinski Triangle, explore the classics.</p>
        </div>
    );

    return (
        <FractalDimTemplate
            title="What Are 2D Fractals?"
            description={description}
            carouselItems={CAROUSEL_ITEMS}
            subHeading={subHeadingContent}
            cards={FRACTALS_2D}

        />
    );
}
