// client/src/components/ApodBanner.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApodBanner = () => {
    const [apodData, setApodData] = useState(null);
    // --- IMPORTANT: Replace with your actual key! ---
    const NASA_API_KEY = 'B30KKrsAv3SBNMmGcolenhmd3QOOMwhnzzPYyUSA';
    // --------------------------------------------------

    useEffect(() => {
        const fetchApod = async () => {
        console.log('Attempting to fetch APOD data...');
        try {
            const { data } = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
            console.log('NASA API Response Received:', data); // Log the response

            if (data && data.media_type === 'image') {
            setApodData(data);
            console.log('SUCCESS: APOD image data set.');
            } else if (data) {
            console.log('INFO: APOD is not an image today:', data.media_type);
            } else {
            console.error('ERROR: Received unexpected data structure from NASA API.');
            }
        } catch (error) {
            // --- THIS IS THE IMPORTANT PART ---
            // Log the specific error object to see the details
            console.error("CRITICAL: Failed to fetch APOD:", error); 
            if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Error Response Data:", error.response.data);
            console.error("Error Response Status:", error.response.status);
            } else if (error.request) {
            // The request was made but no response was received
            console.error("Error Request Data:", error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error Message:', error.message);
            }
            // ------------------------------------
        }
        };
        fetchApod();
    }, []); // Empty dependency array means this runs once

    if (!apodData) {
        // This log should now only appear if the fetch failed or it wasn't an image
        console.log('ApodBanner rendering null (apodData is still null).'); 
        return null;
    }

    // --- Render the banner if apodData is set ---
    return (
        <div className="apod-banner" style={{ backgroundImage: `url(${apodData.hdurl || apodData.url})` }}>
        <div className="apod-overlay">
            <h2>{apodData.title}</h2>
            <p>{apodData.explanation?.substring(0, 150)}...</p>
        </div>
        </div>
    );
};

export default ApodBanner;
