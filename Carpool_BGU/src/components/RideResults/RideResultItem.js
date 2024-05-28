import * as React from "react";
import {
    Avatar, DialogContentText, ListItem,
    ListItemAvatar,
    ListItemText
} from "@mui/material";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import {getAddressFromCoords, joinRide} from "../../common/fetchers";
import {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import Map, {GeolocateControl, Layer, Marker, Source} from "react-map-gl/maplibre";
import RoomIcon from "@mui/icons-material/Room";
import circle from "@turf/circle";

export default function RideResultItem({item, handleCloseDialog, context}) {

    const [departureCity, setDepartureCity] = useState('')
    const [destinationCity, setDestinationCity] = useState('')
    const [rideDetails, setRideDetails] = useState({
        id: -1,
        driverId: -1,
        origin: {
            coords: {lat: 0, long: 0},
            radius: 0.0
        },
        destination: {
            coords: {lat: 0, long: 0},
            radius: 0.0
        },
        avSeats: 0,
        dateTime: null,
        notes: '',
        deltaHours: 0.5
    })
    const [retSuccess, setRetSuccess] = useState(false)
    const [successTitle, setSuccessTitle] = useState('')
    const [successDescription, setSuccessDescription] = useState('')

    const [moreDialogOpen, setMoreDialogOpen] = useState(false)
    const [responseDialogOpen, setResponseDialogOpen] = useState(false)

    useEffect(() => {
        getAddressFromCoords(item._departure_location)
            .then((ret) => {
                if (ret.address.city)
                    setDepartureCity(ret.address.city)
                else
                    setDepartureCity(ret.address.town)
            })
        getAddressFromCoords(item._destination)
            .then((ret) => {
                if (ret.address.city)
                    setDestinationCity(ret.address.city)
                else
                    setDestinationCity(ret.address.town)
            })
        setRideDetails({
            id: item.ride_id,
            driverId: item._driver_id,
            origin: {
                coords: {lat: item._departure_location.split(',')[0], long: item._departure_location.split(',')[1]},
                radius: item._pickup_radius
            },
            destination: {
                coords: {lat: item._destination.split(',')[0], long: item._destination.split(',')[1]},
                radius: item._drop_radius
            },
            avSeats: item._available_seats,
            dateTime: item._departure_datetime,
            notes: item._notes
        })
    }, []);

    const handleClickOpen = () => {
        setMoreDialogOpen(true);
    };

    const handleClose = () => {
        setMoreDialogOpen(false);
    };

    const handleOpenResponseDialog = () => {
        setResponseDialogOpen(true);
    };

    const handleCloseResponseDialog = () => {
        setResponseDialogOpen(false);
        if (retSuccess)
            handleCloseDialog(context.dialogLink)
    };

    const handleJoinRide = async () => {
        const ret = await joinRide(rideDetails.id, 1, localStorage.getItem('access_token'))
        if (ret.success) {
            setRetSuccess(true)
            setSuccessTitle('הפעולה הושלמה בהצלחה!')
            setSuccessDescription()
            handleClose()
            handleOpenResponseDialog()
        } else {
            setSuccessTitle('הפעולה נכשלה')
            setSuccessDescription(ret.msg)
            handleOpenResponseDialog()
        }
        console.log(ret)
    }

    const departureMarker = circle(
        [rideDetails.origin.coords.long, rideDetails.origin.coords.lat],
        rideDetails.origin.radius, {
            steps: 50,
            units: "kilometers",
            properties: {foo: "bar"}
        });

    const destinationMarker = circle(
        [rideDetails.destination.coords.long, rideDetails.destination.coords.lat],
        rideDetails.destination.radius, {
            steps: 50,
            units: "kilometers",
            properties: {foo: "bar"}
        });

    return (departureCity !== '' && destinationCity !== '' &&
        <React.Fragment>
            <ListItem alignItems="flex-start"
                      secondaryAction={
                          <Button variant="outlined" onClick={handleClickOpen}>קרא עוד</Button>
                      }>
                <ListItemAvatar><Avatar>{rideDetails.driverId}</Avatar></ListItemAvatar>
                <ListItemText
                    primary={rideDetails.driverId + ", ב-" + dayjs(rideDetails.dateTime).format("D/M/YY, H:mm")}
                    secondary={
                        <Typography>
                            מ-{departureCity}
                            <br/>
                            ל-{destinationCity}
                        </Typography>
                    }
                />
                <Dialog open={moreDialogOpen} onClose={handleClose} aria-labelledby="alert-dialog-title"
                        fullWidth={true}
                        maxWidth={'xs'}
                        aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        הנסיעה של {rideDetails.driverId}
                    </DialogTitle>
                    <DialogContent>
                        <Grid
                            container
                            display='flex'
                            justifyContent="center">
                            <Grid item xs={12}>
                                <Map
                                    initialViewState={{
                                        latitude: rideDetails.destination.coords.lat,
                                        longitude: rideDetails.destination.coords.long, zoom: 14
                                    }}
                                    style={{width: '100%', height: 300}}
                                    mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                                >
                                    <GeolocateControl position='bottom-left'/>
                                    <Marker anchor="bottom" latitude={rideDetails.destination.coords.lat}
                                            longitude={rideDetails.destination.coords.long}>
                                        <RoomIcon color='primary'/>
                                    </Marker>
                                    <Marker anchor="bottom" latitude={rideDetails.origin.coords.lat}
                                            longitude={rideDetails.origin.coords.long}>
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
                            <Grid item xs={12}>
                                <Typography variant='h5'>הערות מ{rideDetails.driverId}</Typography>
                                <Typography>
                                    {rideDetails.notes}
                                </Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleJoinRide} variant='outlined'>הצטרף לנסיעה</Button>
                        <Button onClick={handleClose}>חזרה לתוצאות</Button>
                    </DialogActions>
                </Dialog>
            </ListItem>
            <Dialog
                open={responseDialogOpen}
                onClose={handleCloseResponseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {successTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {successDescription}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseResponseDialog}>חזרה לדף הבית</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>);
}