import {
    Avatar,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography
} from "@mui/material";
import dayjs from "dayjs";
import * as React from "react";
import {useEffect, useState} from "react";
import {getAddressFromCoords, getProfile, manageRequestsGet, manageRequestsPut} from "../common/fetchers";
import RideViewMap from "./RideViewMap";
import {dateSort} from "../common/Functions";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

function RideViewRequestListItem(props) {
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        getProfile(props.request.passenger_id, localStorage.getItem('access_token'))
            .then((ret) => setProfile(ret.profile))
    }, [])

    const handleRespondToRequest = async (status) => {
        const ret = await manageRequestsPut(props.rideDetails.driverId, props.rideDetails.id, status, props.request.id, localStorage.getItem('access_token'))
        //TODO: handle success
        props.refreshRequestsList()
    }

    return profile &&
        <ListItem
            secondaryAction={props.type === 'accepted' ?
                <ButtonGroup variant="contained">
                    {/*TODO: re-enable when it's possible to remove user from ride*/}
                    <IconButton disabled><CloseIcon/></IconButton>
                </ButtonGroup>
                :
                <ButtonGroup variant="contained">
                    <IconButton onClick={() => handleRespondToRequest('accept')}><CheckIcon/></IconButton>
                    <IconButton onClick={() => handleRespondToRequest('reject')}><CloseIcon/></IconButton>
                </ButtonGroup>
            }>
            <ListItemAvatar><Avatar>{profile.first_name[0] + profile.last_name[0]}</Avatar></ListItemAvatar>
            <ListItemText primary={profile.first_name + ' ' + profile.last_name}/>
        </ListItem>;
}

export default function RideItem({ride, userFirstName}) {

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

    function refreshRequestsList() {
        manageRequestsGet(ride._driver_id, ride.ride_id, localStorage.getItem('access_token'))
            .then((ret) => setRideRequests(ret.pending_requests))
    }

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
        refreshRequestsList();
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
                            מ-{departureCity === '' ? "..." : departureCity}
                            <br/>
                            ל-{destinationCity === '' ? "..." : destinationCity}
                            <br/>
                            {rideDetails.confirmedPassengers}/{rideDetails.avSeats} מקומות נתפסו
                        </React.Fragment>
                    }
                />
            </ListItem>
            <Dialog open={moreDialogOpen} onClose={handleClose}
                    fullWidth={true}
                    maxWidth={'xs'}>
                <DialogTitle id="alert-dialog-title">
                    הנסיעה של {userFirstName}
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
                                {rideRequests.filter((request) => request.status === 'accepted').length > 0 ?
                                    rideRequests
                                        .filter((request) => request.status === 'accepted')
                                        .sort((a, b) => dateSort(a, b))
                                        .map(request => (
                                            <RideViewRequestListItem key={request.id} request={request}
                                                                     rideDetails={rideDetails} type='accepted'/>
                                        )) : <ListItem><ListItemText primary='לא נמצאו רשומות'/></ListItem>
                                }
                            </List>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h5'>בקשות הצטרפות</Typography>
                            <List>
                                {rideRequests.filter((request) => request.status === 'pending').length > 0 ?
                                    rideRequests
                                        .filter((request) => request.status === 'pending')
                                        .sort((a, b) => dateSort(a, b))
                                        .map(request => (
                                            <RideViewRequestListItem key={request.id} request={request}
                                                                     rideDetails={rideDetails} type='pending'
                                                                     refreshRequestsList={refreshRequestsList}/>
                                        )) : <ListItem><ListItemText primary='לא נמצאו רשומות'/></ListItem>
                                }
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