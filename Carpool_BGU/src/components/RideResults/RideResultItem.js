import * as React from "react";
import {useEffect, useState} from "react";
import {DialogContentText, IconButton, ListItem, ListItemAvatar, ListItemText, Rating} from "@mui/material";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import {getProfile, getComments, joinRide} from "../../common/fetchers";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import {AvatarInitials, setCityName} from "../../common/Functions";
import InfoIcon from "@mui/icons-material/Info";
import RideViewMap from "../RideViewMap";
import Box from "@mui/material/Box";

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

export function RideInfoDialog(props) {
    const [profile, setProfile] = useState(null)
    const [responseDialogOpen, setResponseDialogOpen] = useState(false)
    const [retSuccess, setRetSuccess] = useState(false)
    const [successTitle, setSuccessTitle] = useState('')
    const [successDescription, setSuccessDescription] = useState('')

    useEffect(() => {
        getProfile(props.rideDetails._driver_id, localStorage.getItem('access_token'))
            .then((ret) => {
                setProfile(ret.profile)
            })
    }, [])

    const handleOpenResponseDialog = () => {
        setResponseDialogOpen(true);
    };

    const handleCloseResponseDialog = () => {
        setResponseDialogOpen(false);
        if (props.isFromMarker === null && retSuccess)
            props.handleCloseDialog(props.context.dialogLink)
    };

    const handleJoinRide = async () => {
        const ret = await joinRide(props.rideDetails.ride_id, 1, localStorage.getItem('access_token'))
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
                    <RideViewMap rideDetails={props.rideDetails}/>
                    <Grid item xs={12}>
                        <Typography variant="h5">הערות מ{profile ? profile.first_name : "..."}</Typography>
                        <Typography sx={{whiteSpace: 'pre-wrap'}}>
                            {props.rideDetails._notes}
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

    const [departureCity, setDepartureCity] = useState(null)
    const [destinationCity, setDestinationCity] = useState(null)
    const [rideDetails, setRideDetails] = useState(null)
    const [userRating, setUserRating] = useState(0)

    const [moreDialogOpen, setMoreDialogOpen] = useState(false)

    useEffect(() => {
        setCityName(item._departure_location, setDepartureCity)
        setCityName(item._destination, setDestinationCity)
        setRideDetails(item)
        getComments(item._driver_id, localStorage.getItem('access_token'))
            .then((ret) => {
                setUserRating(ret.comments)
            })
    }, []);

    const handleClickOpen = () => {
        setMoreDialogOpen(true);
    };

    const handleClose = () => {
        setMoreDialogOpen(false);
    };

    return (departureCity && destinationCity && item &&
        <React.Fragment>
            <ListItem alignItems="center"
                      secondaryAction={
                          <IconButton variant='outlined' onClick={() => handleClickOpen()}><InfoIcon/></IconButton>
                      }>
                <ListItemAvatar><AvatarInitials userId={rideDetails._driver_id}/></ListItemAvatar>
                <ListItemText
                    primary={"ב-" + dayjs(rideDetails._departure_datetime).format("D/M/YY, H:mm")}
                    secondary={
                        <Typography component="div">
                            <Grid>
                                <Grid item>
                                    <Typography component="span" color="secondary">
                                        מ{departureCity} ל{destinationCity}
                                    </Typography>
                                </Grid>
                                {userRating ? <Grid item>
                                    <Typography component="div">
                                        <Box display='flex' alignItems='center'>
                                            <Rating value={userRating.rating} size="small" readOnly/>
                                            <Typography component="span">
                                                ({userRating.num_of_raters})
                                            </Typography>
                                        </Box>
                                    </Typography>
                                </Grid> : <React.Fragment/>}
                            </Grid>
                        </Typography>
                    }
                />
                <RideInfoDialog open={moreDialogOpen} onClose={handleClose} rideDetails={rideDetails}
                                handleCloseDialog={handleCloseDialog} context={context}/>
            </ListItem>
        </React.Fragment>);
}