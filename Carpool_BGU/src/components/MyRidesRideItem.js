import {ButtonGroup, IconButton, List, ListItem, ListItemText} from "@mui/material";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {useEffect, useState} from "react";
import {getAddressFromCoords, manageRequests} from "../common/fetchers";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import DialogActions from "@mui/material/DialogActions";
import RideViewMap from "./RideViewMap";
import {dateSort} from "../common/Functions";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function RideItem({ride}) {

    const [departureCity, setDepartureCity] = useState('')
    const [destinationCity, setDestinationCity] = useState('')
    const [rideRequests, setRideRequests] = useState([])

    const [moreDialogOpen, setMoreDialogOpen] = useState(false)
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
        confirmedPassengers: 0,
        dateTime: null,
        notes: '',
        deltaHours: 0.5
    })

    useEffect(() => {
        getAddressFromCoords(ride._departure_location)
            .then((ret) => {
                if (ret.address.city)
                    setDepartureCity(ret.address.city)
                else
                    setDepartureCity(ret.address.town)
            })
        getAddressFromCoords(ride._destination)
            .then((ret) => {
                if (ret.address.city)
                    setDestinationCity(ret.address.city)
                else
                    setDestinationCity(ret.address.town)
            })
        setRideDetails({
            id: ride.ride_id,
            driverId: ride._driver_id,
            origin: {
                coords: {lat: ride._departure_location.split(',')[0], long: ride._departure_location.split(',')[1]},
                radius: ride._pickup_radius
            },
            destination: {
                coords: {lat: ride._destination.split(',')[0], long: ride._destination.split(',')[1]},
                radius: ride._drop_radius
            },
            avSeats: ride._available_seats,
            confirmedPassengers: ride._confirmed_passengers,
            dateTime: ride._departure_datetime,
            notes: ride._notes
        })
        manageRequests(ride._driver_id, ride.ride_id, localStorage.getItem('access_token'))
            .then((ret) => setRideRequests(ret.pending_requests))
    }, []);

    const handleClickOpen = () => {
        setMoreDialogOpen(true);
    };

    const handleClose = () => {
        setMoreDialogOpen(false);
    };

    return (
        <React.Fragment>
            <ListItem alignItems="flex-start"
                      secondaryAction={
                          <Button variant="outlined" onClick={handleClickOpen}>פתח</Button>
                      }>
                <ListItemText
                    primary={"ב-" + dayjs(rideDetails.dateTime).format("D/M/YY, H:mm")}
                    secondary={
                        <React.Fragment>
                            מ-{departureCity}
                            <br/>
                            ל-{destinationCity}
                            <br/>
                            {rideDetails.confirmedPassengers}/{rideDetails.avSeats} מקומות נתפסו
                        </React.Fragment>
                    }
                />
            </ListItem>
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
                        <RideViewMap rideDetails={rideDetails}/>
                        <Grid item xs={12}>
                            <Typography variant='h5'>הערות</Typography>
                            <Typography>
                                {rideDetails.notes}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h5'>טרמפיסטים בנסיעה</Typography>
                            <List>
                                {/*{rideRequests*/}
                                {/*    .filter((request) => request.status === 'pending')*/}
                                {/*    .sort((a, b) => dateSort(a, b))*/}
                                {/*    .map(request => (*/}
                                {/*        <ListItem key={request.id} alignItems="flex-start"*/}
                                {/*                  secondaryAction={*/}
                                {/*                      <ButtonGroup variant='contained'>*/}
                                {/*                          <IconButton><CloseIcon/></IconButton>*/}
                                {/*                      </ButtonGroup>*/}
                                {/*                  }>*/}
                                {/*            <ListItemText primary={request.passenger_id}/>*/}
                                {/*        </ListItem>*/}
                                {/*    ))}*/}
                            </List>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h5'>בקשות הצטרפות</Typography>
                            <List>
                                {rideRequests
                                    .filter((request) => request.status === 'pending')
                                    .sort((a, b) => dateSort(a, b))
                                    .map(request => (
                                        <ListItem key={request.id} alignItems="flex-start"
                                                  secondaryAction={
                                                      <ButtonGroup variant='contained'>
                                                          <IconButton><CheckIcon/></IconButton>
                                                          <IconButton><CloseIcon/></IconButton>
                                                      </ButtonGroup>
                                                  }>
                                            <ListItemText primary={request.passenger_id}/>
                                        </ListItem>
                                    ))}
                            </List>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>חזרה לתוצאות</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}