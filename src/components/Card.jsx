/**
 * Card component for displaying fractal information
 * Supports HTML formatting in equations and optional navigation
 */

import { useNavigate } from "react-router-dom";
import styles from "./Card.module.css";



/**
 * Card component for displaying fractal information
 * @param {Object} props - Component props
 * @param {string} props.name - Name of the fractal
 * @param {string} props.equation - Equation describing the fractal
 * @param {string} props.imageUrl - URL of the fractal image
 * @param {string} [props.path] - Optional path for navigation
 * @returns {JSX.Element} The card component
 */
export default function Card({ name, equation, imageUrl, path, layout = "horizontal" }) {
    const navigate = useNavigate();
    const isWIP = name.includes("(W.I.P)");

    const handleClick = () => {
        if (path && !isWIP) {
            navigate(path);
        }
    };

    return (
        <div
            className={`${styles.card} ${isWIP ? styles.cardWip : styles.cardClickable} ${layout === 'horizontal' ? styles.cardHorizontal : ''}`}
            onClick={handleClick}
        >
            <img src={imageUrl} alt={name} className={styles.cardImage} />
            <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{name}</h2>
                <div
                    className={styles.cardEquation}
                    dangerouslySetInnerHTML={{ __html: equation }}
                />
            </div>
        </div>
    );
}
