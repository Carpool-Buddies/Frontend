import {AvatarInitials, setCityName} from "../common/Functions";
import {AdvancedMarker, InfoWindow, useAdvancedMarkerRef} from "@vis.gl/react-google-maps";
import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {getProfile, getRating} from "../common/fetchers";
import {IconButton, ListItem, ListItemText, Rating} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import dayjs from "dayjs";
import {RideInfoDialog} from "./RideResults/RideResultItem";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

export default function MainMapMarker({ride}) {
    const [profile, setProfile] = useState(null)
    const [userRating, setUserRating] = useState(0)
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [infoWindowShown, setInfoWindowShown] = useState(false);

    const [departureCity, setDepartureCity] = useState(null)
    const [destinationCity, setDestinationCity] = useState(null)

    const [moreDialogOpen, setMoreDialogOpen] = useState(false)

    useEffect(() => {
        getProfile(ride.rideDetails._driver_id, localStorage.getItem('access_token'))
            .then((ret) => {
                setProfile(ret.profile)
            })
            .catch(() => {
                setProfile({first_name: "CPB", last_name: ""})
            })
        getRating(ride.rideDetails._driver_id, localStorage.getItem('access_token'))
            .then((ret) => {
                setUserRating(ret.rating)
            })
    }, [])

    const handleMarkerClick = useCallback(() => {
        if (!departureCity || !destinationCity) {
            setCityName(ride.rideDetails._departure_location, setDepartureCity)
            setCityName(ride.rideDetails._destination, setDestinationCity)
        }
        setInfoWindowShown(isShown => !isShown)
    }, []);

    const handleClose = useCallback(() => setInfoWindowShown(false), []);

    const handleClickOpen = () => {
        setMoreDialogOpen(true);
    };

    const handleDialogClose = () => {
        setMoreDialogOpen(false);
    };

    return (
        <React.Fragment key={ride.key}>
            <AdvancedMarker
                position={{
                    lat: Number(ride.rideDetails._departure_location.split(',')[0]),
                    lng: Number(ride.rideDetails._departure_location.split(',')[1])
                }}
                ref={markerRef}
                onClick={handleMarkerClick}
            >

                <AvatarInitials userId={ride.rideDetails._driver_id} mainMapMarkerRide={true}/>
            </AdvancedMarker>

            {profile && infoWindowShown && (
                <InfoWindow anchor={marker} onClose={handleClose}
                            minWidth='200'>
                    <ListItem alignItems="flex-start"
                              secondaryAction={
                                  <IconButton variant='outlined' onClick={() => handleClickOpen()}>
                                      <InfoIcon/>
                                  </IconButton>
                              }>
                        <ListItemText
                            primary={
                                <React.Fragment>
                                    {profile.first_name} {profile.last_name}
                                    <br/>
                                    ב-{dayjs(ride.rideDetails._departure_datetime).format("D/M/YY, H:mm")}
                                </React.Fragment>
                            }
                            secondary={
                                <Typography component="div">
                                    <Grid>
                                        <Grid item>
                                            <Typography component="span" color="secondary">
                                                מ{departureCity ? departureCity : '...'} ל{destinationCity ? destinationCity : '...'}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Rating value={userRating} size="small" readOnly/>
                                        </Grid>
                                    </Grid>
                                </Typography>
                            }
                        />
                        <RideInfoDialog open={moreDialogOpen} onClose={handleDialogClose} rideDetails={ride.rideDetails}
                                        isFromMarker={true}/>
                    </ListItem>
                </InfoWindow>
            )}
        </React.Fragment>
    )
}