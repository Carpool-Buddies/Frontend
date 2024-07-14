import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextMobileStepper from "./Stepper";
import {useState} from "react";
import {findRide, postFutureRide, postRideJoinRequest} from "../../common/fetchers";
import dayjs from "dayjs";
import {DialogContentText} from "@mui/material";
import {contextTypes, publishRideSearchContext, publishRideContext, findRideContext} from "../../common/DialogContexts"

export default function FormDialog({dialogContext, openDialog, handleCloseDialog}) {
    const [open, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [successTitle, setSuccessTitle] = useState('')
    const [successDescription, setSuccessDescription] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const context =
        dialogContext === contextTypes.publishRide ? publishRideContext :
            dialogContext === contextTypes.publishRideSearch ? publishRideSearchContext :
                dialogContext === contextTypes.findRide ? findRideContext : {}

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
        notes: '',
        deltaHours: 0.5
    })

    const resetAndClose = (link) => {
        setRideDetails({
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
            notes: '',
            deltaHours: 0.5
        })
        setActiveStep(0)
        handleCloseDialog(link)
    }

    async function handleSubmit(event) {
        event.preventDefault();
        let ret =
            dialogContext === contextTypes.publishRide ? await postFutureRide(rideDetails, localStorage.getItem('access_token')) :
                dialogContext === contextTypes.publishRideSearch ? await postRideJoinRequest(rideDetails, localStorage.getItem('access_token')) :
                    dialogContext === contextTypes.findRide ? await findRide(rideDetails, localStorage.getItem('access_token')) : {};
        if (ret.success) {
            if (dialogContext === contextTypes.findRide) {
                setSearchResults(ret.ride_posts)
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                handleClickOpen()
                setSuccessTitle('הפעולה הושלמה בהצלחה!')
                setSuccessDescription(context.successDescription)
                resetAndClose(context.dialogLink)
            }
        } else {
            handleClickOpen()
            setSuccessTitle('הפעולה נכשלה')
            setSuccessDescription(ret.msg)
        }
    }

    return (<React.Fragment>
        <Dialog open={openDialog} onClose={() => resetAndClose(context.dialogLink)} fullWidth={true} maxWidth={'xs'}
                PaperProps={{
                    component: 'form', onSubmit: (event) => {
                        handleSubmit(event);
                    },
                }}
        >
            <DialogTitle>{context.dialogTitle}</DialogTitle>
            <DialogContent>
                <TextMobileStepper
                    context={context}
                    rideDetails={rideDetails}
                    setRideDetails={setRideDetails}
                    searchResults={searchResults}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                handleCloseDialog={resetAndClose}/>
            </DialogContent>
            <DialogActions>
                {activeStep!==3 &&
                (<Button
                    type="submit"
                    disabled={!(rideDetails.origin.coords.lat !== 0 &&
                        rideDetails.origin.coords.long !== 0 &&
                        rideDetails.origin.radius !== 0.0 &&
                        rideDetails.destination.coords.lat !== 0 &&
                        rideDetails.destination.coords.long !== 0 &&
                        rideDetails.destination.radius !== 0.0 &&
                        rideDetails.avSeats > 0)}
                >{context.submitButtonText}</Button>)}
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
