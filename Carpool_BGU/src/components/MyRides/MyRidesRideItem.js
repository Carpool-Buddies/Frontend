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
    ListItemText,
    Rating,
    Typography
} from "@mui/material";
import dayjs from "dayjs";
import * as React from "react";
import {useEffect, useState} from "react";
import {
    endRide,
    getComments,
    getProfile,
    manageRequestsGet,
    manageRequestsPut,
    myRatingsByRide,
    startRide
} from "../../common/fetchers";
import RideViewMap from "../RideViewMap";
import {AvatarInitials, datePassed, dateSort, setCityName, startRideIsDue} from "../../common/Functions";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import ProfileViewDialog from "./ProfileViewDialog";
import {rideRequestResponseTypes, rideRequestStatusTypes, rideStatusTypes} from "../../common/backendTerms";
import RateUserDialog from "../rateUserDialog";
import Box from "@mui/material/Box";

function RideViewRequestListItem(props) {
    const [profile, setProfile] = useState(null)
    const [userRating, setUserRating] = useState()
    const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
    const [ratingDialogOpen, setRatingDialogOpen] = useState(false)

    useEffect(() => {
        getProfile(props.request.passenger_id, localStorage.getItem('access_token'))
            .then((ret) => setProfile(ret.profile))
        getComments(props.request.passenger_id, localStorage.getItem('access_token'))
            .then((ret) => {
                setUserRating(ret.comments)
            })
    }, [])

    const handleDetailsDialogClickOpen = () => {
        setDetailsDialogOpen(true);
    };

    const handleRespondToRequest = async (status) => {
        await manageRequestsPut(props.rideDetails._driver_id, props.rideDetails.ride_id, status, props.request.id, localStorage.getItem('access_token'))
        props.refreshRequestsList()
    }

    const ApproveRejectButtons = () => {
        return <ButtonGroup variant="contained">
            <IconButton disabled={datePassed(props.rideDetails._departure_datetime)}
                        onClick={() => handleRespondToRequest(rideRequestResponseTypes.accept)}><CheckIcon/></IconButton>
            <IconButton disabled={datePassed(props.rideDetails._departure_datetime)}
                        onClick={() => handleRespondToRequest(rideRequestResponseTypes.reject)}><CloseIcon/></IconButton>
        </ButtonGroup>
    }

    const DetailsButtons = () => {
        return <React.Fragment>
            <ButtonGroup variant="contained">
                {/*TODO: re-enable when it's possible to remove user from ride*/}
                <IconButton onClick={() => handleDetailsDialogClickOpen()}><InfoIcon/></IconButton>
                <IconButton disabled><CloseIcon/></IconButton>
            </ButtonGroup>
            <ProfileViewDialog profile={profile} detailsDialogOpen={detailsDialogOpen}
                               setDetailsDialogOpen={setDetailsDialogOpen}/>
        </React.Fragment>
    }

    const RateButtons = () => {
        return <React.Fragment>
            <ButtonGroup variant="contained">
                <Button onClick={() => setRatingDialogOpen(true)} disabled={!props.ratingData}>
                    {props.ratingData ? 'דרג' : 'דורג'}
                </Button>
            </ButtonGroup>
            {props.ratingData && <RateUserDialog profile={profile} ratingId={props.ratingData.rating_id}
                                                 ratingDialogOpen={ratingDialogOpen}
                                                 setRatingDialogOpen={setRatingDialogOpen} userId={props.userId}/>}
        </React.Fragment>
    }

    return profile &&
        <ListItem
            secondaryAction={
                props.type === rideRequestStatusTypes.pending ?
                    props.rideDetails._status === rideStatusTypes.waiting ?
                        <ApproveRejectButtons/> :
                        <React.Fragment/>
                    :
                    props.type === rideRequestStatusTypes.accepted ?
                        props.rideDetails._status === rideStatusTypes.completed ?
                            <RateButtons/> :
                            <DetailsButtons/>
                        :
                        <React.Fragment/>
            }>
            <ListItemAvatar><AvatarInitials userId={profile.id}/></ListItemAvatar>
            <ListItemText
                primary={profile.first_name + ' ' + profile.last_name}
                secondary={userRating ?
                    <Typography component="div">
                        <Box display='flex' alignItems='center'>
                            <Rating value={userRating.rating} size="small" readOnly precision={0.5}/>
                            <Typography component="span">
                                ({userRating.num_of_raters})
                            </Typography>
                        </Box>
                    </Typography>
                    : <React.Fragment/>}/>
        </ListItem>;
}

export function MyRideViewDialog(props) {

    const [rideRequests, setRideRequests] = useState([])
    const [rideActionButtonLabel, setRideActionButtonLabel] = useState('טוען')
    const [missingRatings, setMissingRatings] = useState(null)

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
        myRatingsByRide(props.rideDetails._driver_id, props.rideDetails.ride_id, localStorage.getItem('access_token'))
            .then((ret) => setMissingRatings(ret.my_ratings))
        setRideActionButtonLabel(
            props.rideDetails._status === rideStatusTypes.waiting ? 'התחל נסיעה' :
                props.rideDetails._status === rideStatusTypes.inProgress ? 'סיים נסיעה' : 'הנסיעה הסתיימה')
        refreshRequestsList()
    }, []);

    return missingRatings && <Dialog open={props.open} onClose={props.onClose}
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
                        {rideRequests && rideRequests.filter((request) => request.status === rideRequestStatusTypes.accepted).length > 0 ?
                            rideRequests
                                .filter((request) => request.status === rideRequestStatusTypes.accepted)
                                .sort((a, b) => dateSort(a, b))
                                .map(request => (
                                    <RideViewRequestListItem key={request.id} request={request}
                                                             rideDetails={props.rideDetails}
                                                             type={rideRequestStatusTypes.accepted}
                                                             userId={props.userId}
                                                             ratingData={missingRatings.find(item => item.user_id === request.passenger_id)}/>
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
                                                                 refreshRequestsList={refreshRequestsList}
                                                                 userId={props.userId}
                                                                 ratingData={missingRatings.find(item => item.user_id === request.passenger_id)}/>
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

export default function RideItem({ride, userFirstName, userId}) {

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
                    userId={userId}
                />}
        </React.Fragment>
    )
}