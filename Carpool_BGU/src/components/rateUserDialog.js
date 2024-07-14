import * as React from "react";
import {useState} from "react";
import {Dialog, DialogContent, DialogTitle, Rating} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import DialogActions from "@mui/material/DialogActions";
import {rateRide} from "../common/fetchers";
import {toast} from "react-toastify";
import Typography from "@mui/material/Typography";

export default function RateUserDialog(props) {

    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState('');

    const handleRateUser = async () => {
        await rateRide(props.userId, props.ratingId, rating, comments, localStorage.getItem('access_token'))
            .then((ret) => {
                if (ret.success) {
                    toast.success(
                        <Typography responsive variant="body1">
                            {'הדירוג נרשם בהצלחה!'}
                        </Typography>
                    );
                    props.setRated(true)
                    handleClose()
                } else {
                    toast.error(
                        <Typography responsive variant="body1">
                            {ret.msg || 'ארעה שגיאה ברישום הדירוג'}
                        </Typography>
                    );
                }
            })
    }

    const handleClose = () => {
        props.setRatingDialogOpen(false);
    };

    return props.profile &&
        <Dialog onClose={handleClose} open={props.ratingDialogOpen}>
            <DialogTitle>דרג את {props.profile.first_name + ' ' + props.profile.last_name}</DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid item sx={{pb: 3}} xs={12} textAlign='center'>
                        <Rating size='large' onChange={(event, newValue) => setRating(newValue)}/>
                    </Grid>
                    <Grid item xs={12} textAlign='center'>
                        <TextField
                            value={comments}
                            onChange={(event) => setComments(event.target.value)}
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
                <Button onClick={handleRateUser}>שלח</Button>
            </DialogActions>
        </Dialog>
}