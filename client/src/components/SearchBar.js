import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

// --- ADD `onSearchSubmit` prop ---
const SearchBar = ({ onSearchSubmit }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const debouncedFetchSuggestions = useRef(
        debounce(async (query) => {
            if (query.length > 1) {
                try {
                    // Use the correct query parameter name 'q' as defined earlier
                    const { data } = await axios.get(`/api/products/search-suggestions?q=${query}`);
                    setSuggestions(data);
                } catch (err) {
                    console.error("Failed to fetch suggestions", err);
                    setSuggestions([]);
                }
            } else {
                setSuggestions([]);
            }
        }, 300)
    ).current;

    useEffect(() => {
        // Call the debounced function held in the ref
        debouncedFetchSuggestions(searchTerm);

        // Cleanup function from debounce
        return () => {
            debouncedFetchSuggestions.cancel();
        };
    }, [searchTerm, debouncedFetchSuggestions]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSuggestionClick = (suggestionName) => {
        setSearchTerm(suggestionName);
        setSuggestions([]);
        onSearchSubmit(suggestionName);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSuggestions([]);
        onSearchSubmit(searchTerm);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setSuggestions([]);
        onSearchSubmit('');
    };

    return (
        <div className="search-bar-container" onSubmit={handleSearchSubmit}>
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleInputChange}
                className="input" // Use consistent class names if needed
            />
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion._id}
                            onClick={() => handleSuggestionClick(suggestion.name)}
                        >
                            {suggestion.name}
                        </li>
                    ))}
                </ul>
            )}
            <button type="submit" className="button" onClick={handleSearchSubmit}>Search</button>
            <button type="button" className="button" onClick={handleClearSearch}>Clear</button>
        </div>
    );
};

export default SearchBar;