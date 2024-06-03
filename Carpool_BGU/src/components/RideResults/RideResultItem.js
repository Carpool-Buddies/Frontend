import * as React from "react";
import {useEffect, useState} from "react";
import {DialogContentText, IconButton, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import {getAddressFromCoords, getProfile, joinRide} from "../../common/fetchers";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import Map, {GeolocateControl, Layer, Marker, Source} from "react-map-gl/maplibre";
import RoomIcon from "@mui/icons-material/Room";
import circle from "@turf/circle";
import {AvatarInitials} from "../../common/Functions";
import InfoIcon from "@mui/icons-material/Info";

function JoinRideResponseDialog(props) {
    return <Dialog
        open={props.open}
        onClose={props.onClose}
    >
        <DialogTitle id="alert-dialog-title">
            {props.successTitle}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {props.successDescription}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>חזרה לדף הבית</Button>
        </DialogActions>
    </Dialog>;
}

function RideInfoDialog(props) {
    const [profile, setProfile] = useState(null)
    const [responseDialogOpen, setResponseDialogOpen] = useState(false)
    const [retSuccess, setRetSuccess] = useState(false)
    const [successTitle, setSuccessTitle] = useState('')
    const [successDescription, setSuccessDescription] = useState('')

    useEffect(() => {
        getProfile(props.rideDetails.driverId, localStorage.getItem('access_token'))
            .then((ret) => {
                setProfile(ret.profile)
            })
            .catch(() => {
                setProfile({first_name: "CPB", last_name: ""})
            })
    }, [])

    const handleOpenResponseDialog = () => {
        setResponseDialogOpen(true);
    };

    const handleCloseResponseDialog = () => {
        setResponseDialogOpen(false);
        if (retSuccess)
            props.handleCloseDialog(props.context.dialogLink)
    };

    const handleJoinRide = async () => {
        const ret = await joinRide(props.rideDetails.id, 1, localStorage.getItem('access_token'))
        if (ret.success) {
            setRetSuccess(true)
            setSuccessTitle('הפעולה הושלמה בהצלחה!')
            setSuccessDescription('תוכל לראות את סטטוס הבקשה שלך בעמוד "הבקשות שלי"')
            props.onClose()
            handleOpenResponseDialog()
        } else {
            setSuccessTitle('הפעולה נכשלה')
            setSuccessDescription(ret.msg)
            handleOpenResponseDialog()
        }
    }

    const departureMarker = circle(
        [props.rideDetails.origin.coords.long, props.rideDetails.origin.coords.lat],
        props.rideDetails.origin.radius, {
            steps: 50,
            units: "kilometers",
            properties: {foo: "bar"}
        });

    const destinationMarker = circle(
        [props.rideDetails.destination.coords.long, props.rideDetails.destination.coords.lat],
        props.rideDetails.destination.radius, {
            steps: 50,
            units: "kilometers",
            properties: {foo: "bar"}
        });

    return <React.Fragment>
        <Dialog open={props.open} onClose={props.onClose}
                fullWidth={true}
                maxWidth={"xs"}>
            <DialogTitle id="alert-dialog-title">
                הנסיעה של {profile ? profile.first_name : "..."}
            </DialogTitle>
            <DialogContent>
                <Grid
                    container
                    display="flex"
                    justifyContent="center">
                    <Grid item xs={12}>
                        <Map
                            initialViewState={{
                                latitude: props.rideDetails.destination.coords.lat,
                                longitude: props.rideDetails.destination.coords.long, zoom: 14
                            }}
                            style={{width: "100%", height: 300}}
                            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                        >
                            <GeolocateControl position="bottom-left"/>
                            <Marker anchor="bottom" latitude={props.rideDetails.destination.coords.lat}
                                    longitude={props.rideDetails.destination.coords.long}>
                                <RoomIcon color="primary"/>
                            </Marker>
                            <Marker anchor="bottom" latitude={props.rideDetails.origin.coords.lat}
                                    longitude={props.rideDetails.origin.coords.long}>
                                <RoomIcon color="primary"/>
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
                        <Typography variant="h5">הערות מ{profile ? profile.first_name : "..."}</Typography>
                        <Typography>
                            {props.rideDetails.notes}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleJoinRide} variant="outlined">הצטרף לנסיעה</Button>
                <Button onClick={props.onClose}>חזרה לתוצאות</Button>
            </DialogActions>
        </Dialog>
        <JoinRideResponseDialog open={responseDialogOpen} onClose={handleCloseResponseDialog}
                                successTitle={successTitle} successDescription={successDescription}/>
    </React.Fragment>
}

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

    const [moreDialogOpen, setMoreDialogOpen] = useState(false)

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

    return (departureCity !== '' && destinationCity !== '' &&
        <React.Fragment>
            <ListItem alignItems="flex-start"
                      secondaryAction={
                          <IconButton variant='outlined' onClick={() => handleClickOpen()}><InfoIcon/></IconButton>
                      }>
                <ListItemAvatar><AvatarInitials userId={rideDetails.driverId}/></ListItemAvatar>
                <ListItemText
                    primary={"ב-" + dayjs(rideDetails.dateTime).format("D/M/YY, H:mm")}
                    secondary={
                        <React.Fragment>
                            מ-{departureCity}
                            <br/>
                            ל-{destinationCity}
                        </React.Fragment>
                    }
                />
                <RideInfoDialog open={moreDialogOpen} onClose={handleClose} rideDetails={rideDetails}
                                handleCloseDialog={handleCloseDialog} context={context}/>
            </ListItem>
        </React.Fragment>);
}