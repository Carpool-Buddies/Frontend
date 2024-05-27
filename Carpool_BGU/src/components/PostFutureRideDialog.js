import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextMobileStepper from "./Stepper";
import {useState} from "react";
import {postFutureRide, postRideJoinRequest} from "../common/fetchers";
import dayjs from "dayjs";
import {DialogContentText} from "@mui/material";
import {makeRideOfferContext, postFutureRideContext} from "./DialogContexts"

export default function FormDialog({dialogContext, openDialog, handleCloseDialog}) {
    const [open, setOpen] = useState(false);
    const [successTitle, setSuccessTitle] = useState('')
    const [successDescription, setSuccessDescription] = useState('')
    const context = dialogContext === 'driver' ? postFutureRideContext : makeRideOfferContext

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const roundToNearest30Minutes = (time) => {
        const roundedMinute = Math.round(time.minute() / 30) * 30;
        return time.startOf("hour").add(roundedMinute, "minute");
    };

    const [rideDetails, setRideDetails] = useState({
        origin: {
            coords: {lat: 0, long: 0},
            radius: 0.0
        },
        destination: {
            coords: {lat: 0, long: 0},
            radius: 0.0
        },
        avSeats: 0,
        dateTime: roundToNearest30Minutes(dayjs().add(6, 'h')),
        notes: ''
    })

    async function handleSubmit(event) {
        event.preventDefault();
        let ret;
        switch (dialogContext) {
            case 'driver':
                ret = await postFutureRide(rideDetails, localStorage.getItem('access_token'))
                handleClickOpen()
                if (ret.success) {
                    setSuccessTitle('הפעולה הושלמה בהצלחה!')
                    setSuccessDescription('תוכל לראות את הנסיעה שלך ברשימת הנסיעות בעמוד הפרופיל שלך')
                    handleCloseDialog(context.dialogLink)
                } else {
                    setSuccessTitle('הפעולה נכשלה')
                    setSuccessDescription(ret.msg)
                }
                break
            case 'passenger':
                ret = await postRideJoinRequest(rideDetails, localStorage.getItem('access_token'))
                handleClickOpen()
                if (ret.success) {
                    setSuccessTitle('הפעולה הושלמה בהצלחה!')
                    setSuccessDescription('תוכל לראות את הבקשה שלך ברשימת הבקשות בעמוד הפרופיל שלך')
                    handleCloseDialog(context.dialogLink)
                } else {
                    setSuccessTitle('הפעולה נכשלה')
                    setSuccessDescription(ret.msg)
                }
                break
        }
    }

    return (<React.Fragment>
        <Dialog open={openDialog} onClose={() => handleCloseDialog(context.dialogLink)} fullWidth={true} maxWidth={'xs'}
                PaperProps={{
                    component: 'form', onSubmit: (event) => {
                        handleSubmit(event);
                    },
                }}
        >
            <DialogTitle>{context.dialogTitle}</DialogTitle>
            <DialogContent>
                <TextMobileStepper dialogContext={context} rideDetails={rideDetails} setRideDetails={setRideDetails}/>
            </DialogContent>
            <DialogActions>
                <Button
                    type="submit"
                    disabled={!(rideDetails.origin.coords.lat !== 0 &&
                        rideDetails.origin.coords.long !== 0 &&
                        rideDetails.origin.radius !== 0.0 &&
                        rideDetails.destination.coords.lat !== 0 &&
                        rideDetails.destination.coords.long !== 0 &&
                        rideDetails.destination.radius !== 0.0 &&
                        rideDetails.avSeats > 0)}
                >שלח</Button>
            </DialogActions>
        </Dialog>
        <Dialog
            open={open}
            onClose={handleClose}
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
                <Button onClick={handleClose}>חזרה לדף הבית</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>);
}
