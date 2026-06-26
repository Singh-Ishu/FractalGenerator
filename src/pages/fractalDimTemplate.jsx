import React from 'react';
import styles from "./fractalDimTemplate.module.css";
import Card from "../components/Card";
import ImageCarousel from "../components/ImageCarousel";

import PlainMandelbrot from "../assets/PlainMandelbrot.png";
import PlainJulia from "../assets/PlainJulia.png";
import PlainBurningShip from "../assets/PlainBurningShip.png";
import SierpinskiTriangle from "../assets/SierpinskiTriangle.png";
import PlainMandelbulb from "../assets/PlainMandelbulb.png";
import ApollonianGasket from "../assets/ApollonianGasket.png";

// Placeholder data for the carousel
const DEFAULT_CAROUSEL_ITEMS = [
    { url: PlainMandelbrot, link: "/2d/mandelbrot", title: "Mandelbrot Set" },
    { url: PlainJulia, link: "/2d/julia", title: "Julia Set" },
    { url: PlainBurningShip, link: "/2d/burning-ship", title: "Burning Ship" },
    { url: PlainMandelbulb, link: "/3d/mandelbulb", title: "Mandelbulb" },
    { url: SierpinskiTriangle, link: "/2d/sierpinski", title: "Sierpinski Triangle" },
    { url: ApollonianGasket, link: "/", title: "Apollonian Gasket" }
];

function FractalDimTemplate({
    title,
    description,
    carouselItems = DEFAULT_CAROUSEL_ITEMS,
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
