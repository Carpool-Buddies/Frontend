import Grid from "@mui/material/Grid";
import Map, {GeolocateControl, Layer, Marker, Source} from "react-map-gl/maplibre";
import RoomIcon from "@mui/icons-material/Room";
import * as React from "react";
import circle from "@turf/circle";

export default function RideViewMap({rideDetails}) {

    const departureCoords = {
        lat: rideDetails._departure_location.split(',')[0],
        long: rideDetails._departure_location.split(',')[1]
    }

    const destinationCoords = {
        lat: rideDetails._destination.split(',')[0],
        long: rideDetails._destination.split(',')[1]
    }

    const departureMarker = circle(
        [departureCoords.long, departureCoords.lat],
        rideDetails._pickup_radius, {
            steps: 50,
            units: "kilometers",
            properties: {foo: "bar"}
        });

    const destinationMarker = circle(
        [destinationCoords.long, destinationCoords.lat],
        rideDetails._drop_radius, {
            steps: 50,
            units: "kilometers",
            properties: {foo: "bar"}
        });

    return (
        <Grid item xs={12}>
            <Map
                initialViewState={{
                    latitude: destinationCoords.lat, longitude: destinationCoords.long, zoom: 14
                }}
                style={{width: '100%', height: 300}}
                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            >
                <GeolocateControl position='bottom-left'/>
                <Marker anchor="bottom" latitude={departureCoords.lat} longitude={departureCoords.long}>
                    <RoomIcon color='primary'/>
                </Marker>
                <Marker anchor="bottom" latitude={departureCoords.lat}
                        longitude={departureCoords.long}>
                    <RoomIcon color='primary'/>
                </Marker>
                <Source id="my-data" type="geojson" data={departureMarker}>
                    <Layer
                        id="point-90-hi"
                        type="fill"
                        paint={{
                            "fill-color": "#088",
                            "fill-opacity": 0.4,
                            "fill-outline-color": "yellow"
                        }}
                    />
                </Source>
                <Source id="my-data2" type="geojson" data={destinationMarker}>
                    <Layer
                        id="point-90-hi2"
                        type="fill"
                        paint={{
                            "fill-color": "#880000",
                            "fill-opacity": 0.4,
                            "fill-outline-color": "yellow"
                        }}
                    />
                </Source>
            </Map>
        </Grid>
    )
}