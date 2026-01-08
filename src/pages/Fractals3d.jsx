import FractalDimTemplate from "./fractalDimTemplate";
// import "./fractalinfo.css"; // Removed to use clean template styles

//Import fractal images
import PlainMandelbulb from "../assets/PlainMandelbulb.png";

const FRACTALS_3D = [
    {
        name: "Mandelbulb",
        equation: "z_n+1 = z_n^8 + c",
        imageUrl: PlainMandelbulb,
        path: "/3d/mandelbulb",
    },
    {
        name: "Menger Sponge",
        equation: "3D generalization of the Sierpinski carpet",
        imageUrl: PlainMandelbulb,
        path: "/3d/menger-sponge",
    },
    {
        name: "Quaternion Julia",
        equation: "z_n+1 = z_n^2 + c, where z,c ∈ ℍ",
        imageUrl: PlainMandelbulb,
        path: "/3d/quaternion-julia",
    },
    {
        name: "Kleinian Groups",
        equation: "Generated through Möbius transformations",
        imageUrl: PlainMandelbulb,
        path: "/3d/kleinian",
    },
];

const CAROUSEL_ITEMS = [
    { url: "https://upload.wikimedia.org/wikipedia/commons/2/21/Mandel_zoom_00_mandelbrot_set.jpg", link: "/3d/mandelbulb", title: "Mandelbulb" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Menger_sponge_%28Level_4%29.jpg", link: "/3d/menger-sponge", title: "Menger Sponge" }
];

export default function Fractals3d() {

    const description = (
        <>
            <p>
                3D fractals are the three-dimensional cousins of their 2D
                counterparts, extending the magic of self-similarity into
                space. These mathematical wonders repeat intricate patterns
                at every scale, creating structures that seem to defy
                reality with their infinite complexity.
            </p>
            <p>
                A 3D fractal is a geometric form that exhibits
                self-similarity in three dimensions—zooming in reveals
                smaller versions of the same structure, endlessly repeating.
                Unlike 2D fractals, which captivate on a flat plane, 3D
                fractals add depth, creating sponge-like, crystalline, or
                otherworldly shapes.
            </p>
        </>
    );

    const subHeadingContent = (
        <div className="fractal-info-text">
            <h2>Famous 3D Fractals</h2>
            <p>Discover the Mandelbulb, Menger Sponge, and more.</p>
        </div>
    );

    return (
        <FractalDimTemplate
            title="What Are 3D Fractals?"
            description={description}
            carouselItems={CAROUSEL_ITEMS}
            subHeading={subHeadingContent}
            cards={FRACTALS_3D}

        />
    );
}
