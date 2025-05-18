import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    // List of available pages with their display names and paths
    const pages = [
        { name: "Home", path: "/" },
        { name: "2D Fractals", path: "/2D" },
        { name: "3D Fractals", path: "/3D" },
        { name: "About", path: "/About" },
        { name: "Mandelbrot", path: "/2D/Mandelbrot" },
        { name: "Julia", path: "/2D/Julia" },
        { name: "Burning Ship", path: "/2D/Burningship" },
        { name: "Mandelbulb", path: "/3D/Mandelbulb" },
    ];

    // Handle input change
    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === "") {
            setSuggestions([]);
            return;
        }

        // Filter pages based on query
        const filtered = pages.filter((page) =>
            page.name.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered);
    };

    // Handle suggestion click
    const handleSuggestionClick = (path) => {
        setQuery("");
        setSuggestions([]);
        navigate(path);
    };

    // Handle form submission (e.g., pressing Enter)
    const handleSubmit = (e) => {
        e.preventDefault();
        const matchedPage = pages.find(
            (page) => page.name.toLowerCase() === query.toLowerCase()
        );
        if (matchedPage) {
            setQuery("");
            setSuggestions([]);
            navigate(matchedPage.path);
        }
    };

    return (
        <div className="search-bar-container">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search..."
                    className="search-bar-input"
                />
            </form>
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((page) => (
                        <li
                            key={page.path}
                            onClick={() => handleSuggestionClick(page.path)}
                            className="suggestion-item"
                        >
                            {page.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
