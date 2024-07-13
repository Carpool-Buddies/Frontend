import {
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
    ListItemText, Rating,
    Typography
} from "@mui/material";
import dayjs from "dayjs";
import * as React from "react";
import {useEffect, useState} from "react";
import {endRide, getProfile, getRating, manageRequestsGet, manageRequestsPut, startRide} from "../common/fetchers";
import RideViewMap from "./RideViewMap";
import {AvatarInitials, datePassed, dateSort, setCityName, startRideIsDue} from "../common/Functions";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import ProfileViewDialog from "./ProfileViewDialog";
import {rideRequestResponseTypes, rideRequestStatusTypes, rideStatusTypes} from "../common/backendTerms";
import RateUserDialog from "./rateUserDialog";

function RideViewRequestListItem(props) {
    const [profile, setProfile] = useState(null)
    const [userRating, setUserRating] = useState(0)
    const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
    const [ratingDialogOpen, setRatingDialogOpen] = useState(false)

    useEffect(() => {
        getProfile(props.request.passenger_id, localStorage.getItem('access_token'))
            .then((ret) => setProfile(ret.profile))
        getRating(props.request.passenger_id, localStorage.getItem('access_token'))
            .then((ret) => {
                setUserRating(ret.rating)
            })
    }, [])

    const handleDetailsDialogClickOpen = () => {
        setDetailsDialogOpen(true);
    };

    const handleRespondToRequest = async (status) => {
        await manageRequestsPut(props.rideDetails._driver_id, props.rideDetails.ride_id, status, props.request.id, localStorage.getItem('access_token'))
        props.refreshRequestsList()
    }

    return profile &&
        <ListItem
            secondaryAction={props.type === rideRequestStatusTypes.accepted ?
                props.rideDetails._status === rideStatusTypes.completed ?
                    <ButtonGroup variant="contained">
                        <Button onClick={() => setRatingDialogOpen(true)}>דרג</Button>
                    </ButtonGroup>
                    :
                    <ButtonGroup variant="contained">
                        {/*TODO: re-enable when it's possible to remove user from ride*/}
                        <IconButton onClick={() => handleDetailsDialogClickOpen()}><InfoIcon/></IconButton>
                        <IconButton disabled><CloseIcon/></IconButton>
                    </ButtonGroup>
                :
                <ButtonGroup variant="contained">
                    <IconButton disabled={datePassed(props.rideDetails._departure_datetime)}
                                onClick={() => handleRespondToRequest(rideRequestResponseTypes.accept)}><CheckIcon/></IconButton>
                    <IconButton disabled={datePassed(props.rideDetails._departure_datetime)}
                                onClick={() => handleRespondToRequest('reject')}><CloseIcon/></IconButton>
                </ButtonGroup>
            }>
            <ListItemAvatar><AvatarInitials userId={profile.id}/></ListItemAvatar>
            <ListItemText primary={profile.first_name + ' ' + profile.last_name}
                          secondary={<Rating value={userRating} size="small" readOnly/>}/>
            <ProfileViewDialog profile={profile} detailsDialogOpen={detailsDialogOpen}
                               setDetailsDialogOpen={setDetailsDialogOpen}/>
            <RateUserDialog profile={profile} ratingDialogOpen={ratingDialogOpen} setRatingDialogOpen={setRatingDialogOpen}/>
        </ListItem>;
}

export function MyRideViewDialog(props) {

    const [rideRequests, setRideRequests] = useState([])
    const [rideActionButtonLabel, setRideActionButtonLabel] = useState('טוען')

    const refreshRequestsList = () => {
        manageRequestsGet(props.rideDetails._driver_id, props.rideDetails.ride_id, localStorage.getItem('access_token'))
            .then((ret) => {
                setRideRequests(ret.join_ride_requests)
            })
    }

    async function handleStartRideClick() {
        const ret = await startRide(props.rideDetails._driver_id, props.rideDetails.ride_id, localStorage.getItem('access_token'))
        console.log(ret)
    }

    async function handleEndRideClick() {
        const ret = await endRide(props.rideDetails._driver_id, props.rideDetails.ride_id, localStorage.getItem('access_token'))
        console.log(ret)
    }

    useEffect(() => {
        setRideActionButtonLabel(
            props.rideDetails._status === rideStatusTypes.waiting ? 'התחל נסיעה' :
                props.rideDetails._status === rideStatusTypes.inProgress ? 'סיים נסיעה' : 'הנסיעה הסתיימה')
        refreshRequestsList()
    }, []);

    return <Dialog open={props.open} onClose={props.onClose}
                   fullWidth={true}
                   maxWidth={"xs"}>
        <DialogTitle>
            הנסיעה של {props.userFirstName}
        </DialogTitle>
        <DialogContent>
            <Grid
                container
                display="flex"
                justifyContent="center">
                <RideViewMap rideDetails={props.rideDetails}/>
                <Grid item xs={12}>
                    <Typography variant="h5">הערות</Typography>
                    <Typography sx={{whiteSpace: 'pre-wrap'}}>
                        {props.rideDetails ? props.rideDetails._notes : "..."}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">טרמפיסטים בנסיעה</Typography>
                    <List>
                        {rideRequests && rideRequests.filter((request) => request.status === 'accepted').length > 0 ?
                            rideRequests
                                .filter((request) => request.status === 'accepted')
                                .sort((a, b) => dateSort(a, b))
                                .map(request => (
                                    <RideViewRequestListItem key={request.id} request={request}
                                                             rideDetails={props.rideDetails} type='accepted'/>
                                )) : <ListItem><ListItemText primary="לא נמצאו רשומות"/></ListItem>
                        }
                    </List>
                </Grid>
                {props.rideDetails._status === rideStatusTypes.waiting ?
                    <Grid item xs={12}>
                        <Typography variant="h5">בקשות הצטרפות</Typography>
                        <List>
                            {rideRequests && rideRequests.filter((request) => request.status === 'pending').length > 0 ?
                                rideRequests
                                    .filter((request) => request.status === 'pending')
                                    .sort((a, b) => dateSort(a, b))
                                    .map(request => (
                                        <RideViewRequestListItem key={request.id} request={request}
                                                                 rideDetails={props.rideDetails} type='pending'
                                                                 refreshRequestsList={refreshRequestsList}/>
                                    )) : <ListItem><ListItemText primary="לא נמצאו רשומות"/></ListItem>
                            }
                        </List>
                    </Grid> : <React.Fragment/>}
            </Grid>
        </DialogContent>
        <DialogActions>
            <Grid container>
                <Grid item xs={6} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                    <Button onClick={props.rideDetails._status === rideStatusTypes.waiting ?
                        handleStartRideClick : handleEndRideClick}
                            disabled={props.rideDetails._status === rideStatusTypes.waiting ?
                                !startRideIsDue(props.rideDetails._departure_datetime) :
                                props.rideDetails._status !== rideStatusTypes.inProgress}>
                        {rideActionButtonLabel}
                    </Button>
                </Grid>
                <Grid item xs={6} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button onClick={props.onClose}>חזרה לתוצאות</Button>
                </Grid>
            </Grid>
        </DialogActions>
    </Dialog>
}

export default function RideItem({ride, userFirstName}) {

    const [departureCity, setDepartureCity] = useState('')
    const [destinationCity, setDestinationCity] = useState('')

    const [moreDialogOpen, setMoreDialogOpen] = useState(false)
    const [rideDetails, setRideDetails] = useState(null)

    const [clicked, setClicked] = useState(false)

    useEffect(() => {
        setCityName(ride._departure_location, setDepartureCity)
        setCityName(ride._destination, setDestinationCity)
        setRideDetails(ride)
    }, []);

    const handleClickOpen = () => {
        setClicked(true)
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
                    primary={"ב-" + (rideDetails ? dayjs(rideDetails._departure_datetime).format("D/M/YY, H:mm") : "...")}
                    secondary={
                        <React.Fragment>
                            מ{departureCity === '' ? "..." : departureCity} ל{destinationCity === '' ? "..." : destinationCity}
                            <br/>
                            {rideDetails ? (rideDetails._confirmed_passengers + '/' + rideDetails._available_seats) : "..."} מקומות
                            נתפסו
                        </React.Fragment>
                    }
                />
            </ListItem>
            {rideDetails && clicked &&
                <MyRideViewDialog
                    open={moreDialogOpen}
                    onClose={handleClose}
                    userFirstName={userFirstName}
                    rideDetails={rideDetails}
                />}
        </React.Fragment>
    )
}