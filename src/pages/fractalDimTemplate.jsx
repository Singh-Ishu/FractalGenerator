import React from 'react';
import styles from "./fractalDimTemplate.module.css";
import Card from "../components/Card";
import ImageCarousel from "../components/ImageCarousel";

// Placeholder data for the carousel
const carouselItems = [
    { url: "https://upload.wikimedia.org/wikipedia/commons/2/21/Mandel_zoom_00_mandelbrot_set.jpg", link: "/2d/mandelbrot", title: "Mandelbrot Set" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Julia_set_%28C_%3D_0.285_%2B_0.01i%29.jpg/1200px-Julia_set_%28C_%3D_0.285_%2B_0.01i%29.jpg", link: "/2d/julia", title: "Julia Set" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Menger_sponge_%28Level_4%29.jpg", link: "/3d/menger-sponge", title: "Menger Sponge" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Von_Koch_curve.gif", link: "/2d/koch-snowflake", title: "Koch Snowflake" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sierpinski_triangle.svg/1200px-Sierpinski_triangle.svg.png", link: "/2d/sierpinski", title: "Sierpinski Triangle" }
];

function FractalDimTemplate({
    title,
    description,
    carouselItems,
    sampleImages, // For now assuming this might be an array or just children
    subHeading,
    cards, // Kept cards prop
}) {
    const [isCompact, setIsCompact] = React.useState(false);
    const contentRef = React.useRef(null);

    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        // Threshold to trigger shrink. Small amount (e.g. 50px) gives a responsive feel.
        if (scrollTop > 50 && !isCompact) {
            setIsCompact(true);
        } else if (scrollTop < 20 && isCompact) {
            setIsCompact(false);
        }
    };

    // Bridge wheel events from carousel to content
    const handleCarouselWheel = (e) => {
        if (contentRef.current) {
            contentRef.current.scrollTop += e.deltaY;
        }
    };

    return (
        <div className={styles.fractalTemplateContainer}>
            {/* Image Carousel Section - Dynamic Height */}
            <div
                className={styles.carouselSection}
                style={{ height: isCompact ? '40%' : '70%' }}
                onWheel={handleCarouselWheel} // Capture scroll over carousel
            >
                <ImageCarousel items={carouselItems} />
            </div>

            {/* Content Container - Scrollable */}
            <div
                className={styles.contentContainer}
                onScroll={handleScroll}
                ref={contentRef}
            >

                {/* 7:3 Split Section */}
                <div className={styles.splitSection}>
                    <div className={styles.infoBox}>
                        <h3>{title}</h3>
                        <div className={styles.descriptionText}>
                            {/* Allow simple text or Rich text/children */}
                            {typeof description === 'string' ? <p>{description}</p> : description}
                        </div>
                    </div>
                    <div className={styles.sampleImagesBox}>
                        <h3>Sample Images</h3>
                        {/* Placeholder or dynamic images */}
                        <div className={styles.placeholderImage}>Image 1</div>
                        <div className={styles.placeholderImage}>Image 2</div>
                    </div>
                </div>

                {/* Sub Heading */}
                {subHeading && (
                    <div className={styles.subHeading}>
                        {typeof subHeading === 'string' ? <h3>{subHeading}</h3> : subHeading}
                    </div>
                )}

                {/* Cards Section */}
                <div className={styles.cardsSection}>

                    {cards.map((card, index) => (
                        <Card
                            key={`${card.name}-${index}`}
                            name={card.name}
                            equation={card.equation}
                            imageUrl={card.imageUrl}
                            path={card.path}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}

export default FractalDimTemplate;
