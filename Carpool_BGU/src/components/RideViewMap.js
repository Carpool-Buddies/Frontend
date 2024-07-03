import Grid from "@mui/material/Grid";
import {AdvancedMarker, APIProvider, Map} from "@vis.gl/react-google-maps";
import RoomIcon from "@mui/icons-material/Room";
import * as React from "react";
import {Circle} from "./circle";

export default function RideViewMap({rideDetails}) {

    const departureCoords = {
        lat: Number(rideDetails._departure_location.split(',')[0]),
        long: Number(rideDetails._departure_location.split(',')[1])
    }

    const destinationCoords = {
        lat: Number(rideDetails._destination.split(',')[0]),
        long: Number(rideDetails._destination.split(',')[1])
    }

    return (
        <Grid item xs={12}>
            <APIProvider apiKey='AIzaSyCFaNEpBsTboNXUeUheimTz8AbP5BLPZ2g'>
                <Map
                    mapId={'a6c72e4f93862a68'}
                    style={{width: "100%", height: 300}}
                    defaultCenter={{lat: destinationCoords.lat, lng: destinationCoords.long}}
                    defaultZoom={14}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                >
                    <AdvancedMarker position={{lat: departureCoords.lat, lng: departureCoords.long}}>
                        <RoomIcon color="primary"/>
                    </AdvancedMarker>
                    <AdvancedMarker position={{lat: destinationCoords.lat, lng: destinationCoords.long}}>
                        <RoomIcon color="primary"/>
                    </AdvancedMarker>
                    <Circle
                        radius={rideDetails._pickup_radius * 1000}
                        center={{lat: departureCoords.lat, lng: departureCoords.long}}
                        strokeOpacity={0}
                        fillColor={'#088'}
                        fillOpacity={0.4}
                    />
                    <Circle
                        radius={rideDetails._drop_radius * 1000}
                        center={{lat: destinationCoords.lat, lng: destinationCoords.long}}
                        strokeOpacity={0}
                        fillColor={'#880000'}
                        fillOpacity={0.4}
                    />
                </Map>
            </APIProvider>
        </Grid>
    )
}