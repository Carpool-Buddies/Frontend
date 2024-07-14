import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";
import dayjs from "dayjs";
import * as React from "react";
import {useEffect, useState} from "react";
import {getProfile, myRatingsByRide} from "../common/fetchers";
import RideViewMap from "./RideViewMap";
import {AvatarInitials, formatPhoneNumber, setCityName} from "../common/Functions";
import CallIcon from "@mui/icons-material/Call";
import {rideRequestStatusTypes, rideStatusTypes} from "../common/backendTerms";
import RateUserDialog from "./rateUserDialog";

function MyRideViewDialog(props) {
    const [driverProfile, getDriverProfile] = useState(null)
    const [missingRatings, setMissingRatings] = useState(null)
    const [ratingDialogOpen, setRatingDialogOpen] = useState(false)

    const notYetRated = () => {
        return props.joinRequestDetails.ride_status === rideRequestStatusTypes.accepted &&
            props.joinRequestDetails._status === rideStatusTypes.completed &&
            missingRatings &&
            missingRatings.find(item => item.user_id === props.joinRequestDetails._driver_id)
    }

    useEffect(() => {
        myRatingsByRide(props.userId, props.joinRequestDetails.ride_id, localStorage.getItem('access_token'))
            .then((ret) => setMissingRatings(ret.my_ratings))
        getProfile(props.joinRequestDetails._driver_id, localStorage.getItem('access_token'))
            .then((ret) => getDriverProfile(ret.profile))
    }, []);

    return <Dialog open={props.open} onClose={props.onClose}
                   fullWidth={true}
                   maxWidth={"xs"}>
        <DialogTitle>
            הנסיעה של {driverProfile ? driverProfile.first_name : "..."}
        </DialogTitle>
        <DialogContent>
            <Grid
                container
                display="flex"
                justifyContent="center">
                <RideViewMap rideDetails={props.joinRequestDetails}/>
                <Grid item xs={12}>
                    <Typography variant="h5">הערות</Typography>
                    <Typography sx={{whiteSpace:'pre-wrap'}}>
                        {props.joinRequestDetails ? props.joinRequestDetails._notes : "..."}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">פרטי הנהג</Typography>
                    <List>
                        <ListItemButton onClick={() => alert('one day this will call a number!')}>
                            <ListItemIcon>
                                <CallIcon/>
                            </ListItemIcon>
                            <ListItemText dir='ltr' primary={driverProfile ? formatPhoneNumber(driverProfile.phone_number) : "..."}/>
                        </ListItemButton>
                    </List>
                </Grid>
                {props.joinRequestDetails.ride_status === rideRequestStatusTypes.accepted &&
                    <Grid item xs={12} textAlign='center'>
                        <Button onClick={() => setRatingDialogOpen(true)} variant='contained'
                                disabled={!notYetRated()}>
                            {notYetRated() || props.joinRequestDetails._status !== rideStatusTypes.completed ?
                                <Typography>
                                    דרג את {driverProfile ? driverProfile.first_name : "..."}
                                </Typography> :
                                <Typography>
                                    דירגת את {driverProfile ? driverProfile.first_name : "..."}
                                </Typography>}
                        </Button>
                    </Grid>}
                {props.joinRequestDetails.ride_status === rideRequestStatusTypes.accepted &&
                    props.joinRequestDetails._status !== rideStatusTypes.completed &&
                    <Grid item xs={12} textAlign='center'>
                        <Typography variant="caption">
                            דירוג יתאפשר לאחר שהנסיעה תסומן כהושלמה
                        </Typography>
                    </Grid>}
            </Grid>
            {props.joinRequestDetails.ride_status === rideRequestStatusTypes.accepted &&
                props.joinRequestDetails._status === rideStatusTypes.completed &&
                missingRatings && missingRatings.find(item => item.user_id === props.joinRequestDetails._driver_id) &&
                driverProfile && <RateUserDialog profile={driverProfile}
                                                 ratingId={missingRatings.find(item => item.user_id === props.joinRequestDetails._driver_id).rating_id || -1}
                                                 ratingDialogOpen={ratingDialogOpen}
                                                 setRatingDialogOpen={setRatingDialogOpen}
                                                 userId={props.userId}/>}
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>חזרה לתוצאות</Button>
        </DialogActions>
    </Dialog>
}

export default function JoinRequestItem({joinRequest, userFirstName, userId}) {

    const [departureCity, setDepartureCity] = useState('')
    const [destinationCity, setDestinationCity] = useState('')

    const [moreDialogOpen, setMoreDialogOpen] = useState(false)
    const [joinRequestDetails, setJoinRequestDetails] = useState(null)
    const [clicked, setClicked] = useState(false)

    useEffect(() => {
        setCityName(joinRequest._departure_location, setDepartureCity)
        setCityName(joinRequest._destination, setDestinationCity)
        setJoinRequestDetails(joinRequest)
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
            <ListItem
                secondaryAction={
                    <Button variant="outlined" onClick={handleClickOpen}>פתח</Button>
                }>
                <ListItemAvatar><AvatarInitials userId={joinRequest._driver_id}/></ListItemAvatar>
                <ListItemText
                    primary={"ב-" + (joinRequestDetails ? dayjs(joinRequestDetails._departure_datetime).format("D/M/YY, H:mm") : "...")}
                    secondary={
                        <React.Fragment>
                            מ{departureCity === '' ? "..." : departureCity} ל{destinationCity === '' ? "..." : destinationCity}
                            <br/>
                            {joinRequestDetails ?
                                (joinRequestDetails.ride_status === rideRequestStatusTypes.accepted ? "הבקשה אושרה!" :
                                    joinRequestDetails.ride_status === rideRequestStatusTypes.rejected ? "הבקשה נדחתה" :
                                        joinRequestDetails.ride_status === rideRequestStatusTypes.pending ? "הבקשה טרם אושרה" : '') : "..."}
                        </React.Fragment>
                    }
                />
            </ListItem>
            {joinRequestDetails && clicked &&
                <MyRideViewDialog
                    open={moreDialogOpen}
                    onClose={handleClose}
                    userFirstName={userFirstName}
                    joinRequestDetails={joinRequestDetails}
                    userId={userId}
                />}
        </React.Fragment>
    )
}