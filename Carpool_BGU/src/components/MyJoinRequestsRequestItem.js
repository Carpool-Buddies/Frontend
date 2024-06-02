import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    List,
    ListItem,
    ListItemAvatar, ListItemButton, ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";
import dayjs from "dayjs";
import * as React from "react";
import {useEffect, useState} from "react";
import {getAddressFromCoords, getProfile} from "../common/fetchers";
import RideViewMap from "./RideViewMap";
import {AvatarInitials, formatPhoneNumber} from "../common/Functions";
import CallIcon from "@mui/icons-material/Call";

function MyRideViewDialog(props) {
    const [driverProfile, getDriverProfile] = useState(null)

    useEffect(() => {
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
                    <Typography>
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
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>חזרה לתוצאות</Button>
        </DialogActions>
    </Dialog>
}

export default function JoinRequestItem({joinRequest, userFirstName}) {

    const [departureCity, setDepartureCity] = useState('')
    const [destinationCity, setDestinationCity] = useState('')

    const [moreDialogOpen, setMoreDialogOpen] = useState(false)
    const [joinRequestDetails, setJoinRequestDetails] = useState(null)

    useEffect(() => {
        getAddressFromCoords(joinRequest._departure_location)
            .then((ret) => {
                if (ret.address.city)
                    setDepartureCity(ret.address.city)
                else
                    setDepartureCity(ret.address.town)
            })
        getAddressFromCoords(joinRequest._destination)
            .then((ret) => {
                if (ret.address.city)
                    setDestinationCity(ret.address.city)
                else
                    setDestinationCity(ret.address.town)
            })
        setJoinRequestDetails(joinRequest)
    }, []);

    const handleClickOpen = () => {
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
                            מ-{departureCity === '' ? "..." : departureCity}
                            <br/>
                            ל-{destinationCity === '' ? "..." : destinationCity}
                            <br/>
                            {joinRequestDetails ?
                                (joinRequestDetails.ride_status === 'accepted' ? "הבקשה אושרה!" :
                                    joinRequestDetails.ride_status === 'rejected' ? "הבקשה נדחתה" :
                                        joinRequestDetails.ride_status === 'pending' ? "הבקשה טרם אושרה" : '') : "..."}
                        </React.Fragment>
                    }
                />
            </ListItem>
            {joinRequestDetails &&
                <MyRideViewDialog
                    open={moreDialogOpen}
                    onClose={handleClose}
                    userFirstName={userFirstName}
                    joinRequestDetails={joinRequestDetails}
                />}
        </React.Fragment>
    )
}