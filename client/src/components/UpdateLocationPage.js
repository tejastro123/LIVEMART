// client/src/components/UpdateLocationPage.js
import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import axios from 'axios';
import { toast } from 'react-toastify';

const containerStyle = {
    width: '100%',
    height: '500px'
};

const UpdateLocationPage = ({ user, loadUser }) => {
    const [markerPosition, setMarkerPosition] = useState({
        lat: user?.location?.coordinates[1] || 17.43, // Default to Secunderabad's latitude
        lng: user?.location?.coordinates[0] || 78.50  // Default to Secunderabad's longitude
    });

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBGcB_DMnP8OKj1w_kElU23DGNIBY9_a8o" // <-- IMPORTANT: Add your key here
    });

    const onMarkerDragEnd = useCallback((event) => {
        setMarkerPosition({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        });
    }, []);

    const handleSaveLocation = async () => {
        try {
            await axios.put('/api/users/updatelocation', {
                latitude: markerPosition.lat,
                longitude: markerPosition.lng,
            });
            toast.success('Location updated successfully!');
            loadUser(); // Refresh the global user state
        } catch (err) {
            toast.error('Failed to update location.');
        }
    };

    return isLoaded ? (
        <div>
        <h2>Update Your Location</h2>
        <p>Drag the marker to your current location and click save.</p>
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={markerPosition}
            zoom={12}
        >
            <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
            />
        </GoogleMap>
        <button onClick={handleSaveLocation} style={{ marginTop: '1rem' }}>
            Save New Location
        </button>
        </div>
    ) : <p>Loading Map...</p>;
};

export default UpdateLocationPage;