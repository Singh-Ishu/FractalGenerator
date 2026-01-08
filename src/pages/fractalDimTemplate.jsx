import styles from "./fractalDimTemplate.module.css";
import ImageCarousel from "../components/ImageCarousel";

// Placeholder data for the carousel
const carouselItems = [
    { url: "https://upload.wikimedia.org/wikipedia/commons/2/21/Mandel_zoom_00_mandelbrot_set.jpg", link: "/2d/mandelbrot", title: "Mandelbrot Set" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Julia_set_%28C_%3D_0.285_%2B_0.01i%29.jpg/1200px-Julia_set_%28C_%3D_0.285_%2B_0.01i%29.jpg", link: "/2d/julia", title: "Julia Set" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Menger_sponge_%28Level_4%29.jpg", link: "/3d/menger-sponge", title: "Menger Sponge" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Von_Koch_curve.gif", link: "/2d/koch-snowflake", title: "Koch Snowflake" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sierpinski_triangle.svg/1200px-Sierpinski_triangle.svg.png", link: "/2d/sierpinski", title: "Sierpinski Triangle" }
];

function fractalDimTemplate() {
    return (
        <div className={styles.fractalTemplateContainer}>
            {/* Image Carousel Section */}
            <div className={styles.carouselSection}>
                <ImageCarousel items={carouselItems} />
            </div>

            {/* Content Container */}
            <div className={styles.contentContainer}>

                {/* 7:3 Split Section */}
                <div className={styles.splitSection}>
                    <div className={styles.infoBox}>
                        <h3>What is a fractal</h3>
                        <p>A fractal is a complex geometric shape that exhibits self-similarity at different scales.</p>
                    </div>
                    <div className={styles.sampleImagesBox}>
                        <h3>Sample Images</h3>
                        <div className={styles.placeholderImage}>Image 1</div>
                        <div className={styles.placeholderImage}>Image 2</div>
                    </div>
                </div>

                {/* Sub Heading */}
                <div className={styles.subHeading}>
                    <h3>Sub heading 1</h3>
                </div>

                {/* Cards Section */}
                <div className={styles.cardsSection}>
                    <h3>Cards section</h3>
                    <div className={styles.cardPlaceholder}>Card 1</div>
                    <div className={styles.cardPlaceholder}>Card 2</div>
                    <div className={styles.cardPlaceholder}>Card 3</div>
                </div>

            </div>
        </div>
    );
}

export default fractalDimTemplate;
