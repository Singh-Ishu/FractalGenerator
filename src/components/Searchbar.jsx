/**
 * Searchbar component that provides search functionality across the application.
 * Includes autocomplete suggestions and navigation to matching pages.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Searchbar.css";

/**
 * Available pages configuration for search functionality
 * @type {Array<{name: string, path: string}>}
 */
const AVAILABLE_PAGES = [
    { name: "Home", path: "/" },
    { name: "2D Fractals", path: "/2d" },
    { name: "3D Fractals", path: "/3d" },
    { name: "About", path: "/about" },
    { name: "Mandelbrot", path: "/2d/mandelbrot" },
    { name: "Julia", path: "/2d/julia" },
    { name: "Burning Ship", path: "/2d/burning-ship" },
    { name: "Sierpinski Triangle", path: "/2d/sierpinski" },
    { name: "Koch Snowflake", path: "/2d/koch-snowflake" },
    { name: "Barnsley Fern", path: "/2d/barnsley-fern" },
    { name: "Mandelbulb", path: "/3d/mandelbulb" },
    { name: "Menger Sponge", path: "/3d/menger-sponge" },
    { name: "Quaternion Julia", path: "/3d/quaternion-julia" },
    { name: "Kleinian Groups", path: "/3d/kleinian" },
];

/**
 * Searchbar component that provides search and navigation functionality
 * @returns {JSX.Element} The searchbar component with suggestions
 */
const Searchbar = () => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    /**
     * Handles input changes and updates suggestions
     * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event
     */
    const handleInputChange = (event) => {
        const value = event.target.value;
        setQuery(value);

        if (value.trim() === "") {
            setSuggestions([]);
            return;
        }

        const filtered = AVAILABLE_PAGES.filter((page) =>
            page.name.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered);
    };

    /**
     * Handles suggestion click and navigates to the selected page
     * @param {string} path - The path to navigate to
     */
    const handleSuggestionClick = (path) => {
        setQuery("");
        setSuggestions([]);
        navigate(path);
    };

    /**
     * Handles form submission and navigates to exact matches
     * @param {React.FormEvent<HTMLFormElement>} event - The form submission event
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        const matchedPage = AVAILABLE_PAGES.find(
            (page) => page.name.toLowerCase() === query.toLowerCase()
        );
        if (matchedPage) {
            setQuery("");
            setSuggestions([]);
            navigate(matchedPage.path);
        }
    };

    return (
        <div className="searchbar">
            <form onSubmit={handleSubmit} className="searchbar__form">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search..."
                    className="searchbar__input"
                    aria-label="Search pages"
                />
            </form>
            
            {suggestions.length > 0 && (
                <ul className="searchbar__suggestions">
                    {suggestions.map((page) => (
                        <li
                            key={page.path}
                            onClick={() => handleSuggestionClick(page.path)}
                            className="searchbar__suggestion-item"
                        >
                            {page.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Searchbar;
