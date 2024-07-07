import {useState} from "react";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MobileStepper from "@mui/material/MobileStepper";
import {enterCode, verifyEmail} from "../common/fetchers";
import {toast, ToastContainer} from "react-toastify";

export default function VerifyProfileDialog(props) {
    const [activeStep, setActiveStep] = useState(0);
    const [loadingRequest, setLoadingRequest] = useState(false)
    const [verificationCode, setVerificationCode] = useState('')

    async function handleSendCode(event) {
        setLoadingRequest(true)
        event.preventDefault()
        verifyEmail(props.profile.id, localStorage.getItem('access_token'))
            .then(() => { //TODO: check that ret is fine
                setActiveStep(activeStep + 1)
            })
            .catch((err) => {
                console.error(err)
            })
    }

    async function handleEnterCode() {
        const {success, msg} = await enterCode(props.profile.email, verificationCode);
        if (success) {
            setActiveStep(activeStep + 1)
        } else {
            toast.error(
                <Typography responsive variant="body1">
                    {msg || 'הקוד שהוזן אינו תקין'}
                </Typography>
            );
        }
    }

    return (<React.Fragment>
        <Dialog open={props.open}
                onClose={props.handleCloseDialog}
                fullWidth={true}
                maxWidth={'xs'}>
            <DialogTitle>אימות חשבון</DialogTitle>
            <DialogContent>
                <Grid container display="flex" justifyContent="center">
                    <Grid item xs={12} sx={{width: '100%'}}>
                        <Box hidden={activeStep !== 0} sx={{width: '100%'}}>
                            <Typography>
                                כדי להגביר את הביטחון בין משתמשי Carpool Buddies, הוספנו את האפשרות לאמת את החשבון
                                האוניברסיטאי שלך.
                            </Typography>
                            <Typography>
                                החשבון שלך יוצג כמאומת לאחר אימות כתובת הדוא״ל האוניברסיטאי שלך באמצעות קוד חד פעמי
                                שתקבל אליה.
                            </Typography>
                            <Button
                                sx={{my: 5}}
                                onClick={handleSendCode}
                                fullWidth
                                variant="contained"
                                disabled={loadingRequest}>
                                שלחו לי את הקוד
                            </Button>
                        </Box>
                        <Box hidden={activeStep !== 1} justifyContent="center">
                            <Grid>
                                <Grid item xs={12}>
                                    <Typography>
                                        נשלח קוד לכתובת הדוא״ל שלך. אנא הזן אותו בתיבת הטקסט.
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} display="flex" justifyContent="center">
                                    <TextField
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        value={verificationCode}
                                        inputProps={{min: 0, style: {textAlign: 'center'}}}
                                        sx={{mt: 5}}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        sx={{my: 5}}
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        onClick={handleEnterCode}
                                    >שלח</Button>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box hidden={activeStep !== 2}>
                            <Typography>
                                מזל טוב, החשבון שלך מאומת! כעת אתה ומשתמשים אחרים יוכלו לראות את סמל האוניברסיטה מצורף
                                לאווטאר המשתמש שלך.
                            </Typography>
                            <Button
                                onClick={props.handleCloseDialog}
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{my: 5}}>
                                סגור חלון
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="center">
                        <MobileStepper
                            steps={3}
                            position="static"
                            activeStep={activeStep}
                            nextButton={<React.Fragment/>}
                            backButton={<React.Fragment/>}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
        <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={true}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{
                width: '100%',
                maxWidth: '500px',
                margin: '0 auto',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif'
            }}
        />
    </React.Fragment>);

}