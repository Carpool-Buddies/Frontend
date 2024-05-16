import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextMobileStepper from "./Stepper";
import {useState} from "react";

export default function FormDialog({openDialog, handleCloseDialog}) {

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
        dateTime: '',
        notes: ''
    })

    return (<React.Fragment>
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth={true} maxWidth={'xs'}
                PaperProps={{
                    component: 'form', onSubmit: (event) => {
                        event.preventDefault();
                        handleCloseDialog();
                    },
                }}
        >
            <DialogTitle>פרסום נסיעה חדשה</DialogTitle>
            <DialogContent>
                <TextMobileStepper setFormDetails={setRideDetails}/>
            </DialogContent>
            <DialogActions>
                <Button type="submit">שלח</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>);
}
