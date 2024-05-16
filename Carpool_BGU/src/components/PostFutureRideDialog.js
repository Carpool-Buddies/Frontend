import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextMobileStepper from "./Stepper";

export default function FormDialog({openDialog, handleCloseDialog}) {
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
                <DialogContentText>
                    Sample text
                </DialogContentText>
                <TextMobileStepper/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit">Subscribe</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>);
}
