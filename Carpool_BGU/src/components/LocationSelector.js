import React, {useState} from 'react';
import Map, {GeolocateControl, Marker} from "react-map-gl/maplibre";
import Box from "@mui/material/Box";
import RoomIcon from '@mui/icons-material/Room';

const LocationSelector = () => {

    const lat = 32.034191
    const long = 34.87721

    const [markerPosition, setMarkerPosition] = useState({
        latitude: lat,
        longitude: long,
    });

    const handleSubmit = () => {
        console.log('Chosen location:', markerPosition);
    };

    const handleViewportChange = (newViewport) => {
        setMarkerPosition({
            latitude: newViewport.viewState.latitude,
            longitude: newViewport.viewState.longitude,
        });
    };

    return (
        <Box display='flex' height="100vh">
            <Map
                initialViewState={{
                    longitude: long,
                    latitude: lat,
                    zoom: 14
                }}
                onMove={handleViewportChange}
                style={{width: '100%', height: '100%', zIndex: 0}}
                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            >
                <GeolocateControl position='bottom-left'/>
                <Marker
                    latitude={markerPosition.latitude}
                    longitude={markerPosition.longitude}
                >
                    <RoomIcon color='primary'/>
                </Marker>
            </Map>
            <button onClick={handleSubmit}>Submit</button>
        </Box>
    );
};

export default LocationSelector;
