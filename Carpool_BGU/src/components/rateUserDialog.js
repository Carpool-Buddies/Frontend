import * as React from "react";
import {Dialog, DialogContent, DialogTitle, Rating} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import DialogActions from "@mui/material/DialogActions";
import {getServerStatus} from "../common/fetchers";

export default function RateUserDialog(props) {

    const handleClose = () => {
        props.setRatingDialogOpen(false);
    };

    return props.profile &&
        <Dialog onClose={handleClose} open={props.ratingDialogOpen}>
            <DialogTitle>דרג את {props.profile.first_name + ' ' + props.profile.last_name}</DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid item sx={{pb: 3}} xs={12} textAlign='center'>
                        <Rating size='large'/>
                    </Grid>
                    <Grid item xs={12} textAlign='center'>
                        <TextField
                            id="outlined-multiline-static"
                            label="הערות (אופציונלי)"
                            multiline
                            fullWidth
                            rows={4}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>שלח</Button>
            </DialogActions>
        </Dialog>
}