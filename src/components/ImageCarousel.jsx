import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ImageCarousel.module.css';

const ImageCarousel = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const nextSlide = (e) => {
        e.stopPropagation();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    };

    const prevSlide = (e) => {
        e.stopPropagation();
        setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
    };

    const handleImageClick = (link, index) => {
        if (index === currentIndex) {
            navigate(link);
        } else {
            setCurrentIndex(index);
        }
    };

    const getSlideClass = (index) => {
        if (index === currentIndex) return styles.active;
        if (index === (currentIndex - 1 + items.length) % items.length) return styles.prev;
        if (index === (currentIndex + 1) % items.length) return styles.next;
        return styles.hidden;
    };

    if (!items || items.length === 0) {
        return <div className={styles.carouselContainer}>No images to display</div>;
    }

    return (
        <div className={styles.carouselContainer}>
            <div className={styles.carouselTrack}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`${styles.carouselItem} ${getSlideClass(index)}`}
                        onClick={() => handleImageClick(item.link, index)}
                    >
                        <img src={item.url} alt={item.title} className={styles.carouselImage} />
                        <div className={styles.caption}>{item.title}</div>
                    </div>
                ))}
            </div>

            <button className={styles.navButton} onClick={prevSlide} style={{ left: '10px' }}>
                &#10094;
            </button>
            <button className={styles.navButton} onClick={nextSlide} style={{ right: '10px' }}>
                &#10095;
            </button>
        </div>
    );
};

export default ImageCarousel;
