import * as React from 'react';
import Box from '@mui/material/Box';
import {useTheme} from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LocationSelector from "./LocationSelector";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import {Slider} from "@mui/material";
import {contextTypes} from "./DialogContexts";
import RideResults from "./RideResults/RideResults";

function ExtraDetailsForm({context, notes, dateTime, setRideDetails}) {
    const setAvSeats = (avSeats) => {
        setRideDetails(existingState => ({
            ...existingState,
            avSeats: avSeats
        }))
    }
    const setDateTime = (dateTime) => {
        setRideDetails(existingState => ({
            ...existingState,
            dateTime: dayjs(dateTime)
        }))
    }
    const setNotes = (notes) => {
        setRideDetails(existingState => ({
            ...existingState,
            notes: notes
        }))
    }
    const setDeltaHours = (hours) => {
        setRideDetails(existingState => ({
            ...existingState,
            deltaHours: hours
        }))
    }
    return (
        <Box display='flex'>
            <Grid container display='flex'>
                <Grid item xs={12}>
                    <Typography>
                        הכנס פרטים נוספים
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField type="number"
                               label={context.seats}
                               defaultValue={0}
                               fullWidth
                               margin="normal"
                               onChange={(e) => setAvSeats(e.target.value)}
                               InputProps={{inputProps: {min: 0, max: 10}}}/>
                </Grid>
                <Grid item xs={12}>
                    <DateTimePicker margin="normal"
                                    label={context.dateTime}
                                    onChange={(v) => setDateTime(v.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z')}
                                    defaultValue={dateTime}
                    />
                </Grid>
                {context.contextId === contextTypes.findRide ?
                    <React.Fragment>
                        <Grid item xs={12}>
                            <Typography>
                                טווח גמישות (בשעות)
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Slider
                                size="small"
                                defaultValue={0.5}
                                min={0.5}
                                max={10}
                                step={0.5}
                                valueLabelDisplay="auto"
                                onChange={(event, newValue) => {
                                    setDeltaHours(newValue);
                                }}
                            />
                        </Grid>
                    </React.Fragment> :
                    <Grid item xs={12}>
                        <TextField
                            margin="normal"
                            label={"הערות (" + notes.length + "/120)"}
                            multiline
                            fullWidth
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                            inputProps={{maxLength: 120}}
                        />
                    </Grid>}
            </Grid>
        </Box>
    )
}

export default function TextMobileStepper({
                                              context,
                                              activeStep,
                                              setActiveStep,
                                              rideDetails,
                                              setRideDetails,
                                              searchResults,
                                              handleCloseDialog
                                          }) {
    const theme = useTheme();
    const setPickupLocationDetails = (pickupLocationDetails) => {
        setRideDetails(existingState => ({
            ...existingState,
            origin: {
                coords: pickupLocationDetails.coords,
                radius: pickupLocationDetails.radius
            }
        }))
    }
    const setDropOffLocationDetails = (dropOffLocationDetails) => {
        setRideDetails(existingState => ({
            ...existingState,
            destination: {
                coords: dropOffLocationDetails.coords,
                radius: dropOffLocationDetails.radius
            }
        }))
    }
    const maxSteps = context.contextId === contextTypes.findRide ? 4 : 3;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const originSelector = (<LocationSelector
        title="בחר כתובת מוצא"
        setLocationDetails={setPickupLocationDetails}
        actionText="איסוף"/>)
    const destinationSelector = (<LocationSelector
        title="בחר כתובת יעד"
        setLocationDetails={setDropOffLocationDetails}
        actionText="הורדה"/>)

    return (
        <Grid container display="flex" justifyContent="center">
            <Grid item xs={12} sx={{width: '100%'}}>
                <Box hidden={activeStep !== 0} sx={{width: '100%'}}>
                    {originSelector}
                </Box>
                <Box hidden={activeStep !== 1}>
                    {destinationSelector}
                </Box>
                <Box hidden={activeStep !== 2}>
                    <ExtraDetailsForm
                        context={context}
                        notes={rideDetails.notes}
                        dateTime={rideDetails.dateTime}
                        setRideDetails={setRideDetails}/>
                </Box>
                <Box hidden={activeStep !== 3}>
                    <RideResults
                        results={searchResults}
                        handleCloseDialog={handleCloseDialog}
                        context={context}/>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={<Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                        sx={{visibility: activeStep === maxSteps - 1 || (context.contextId === contextTypes.findRide && activeStep === 2) ? 'hidden' : 'visible'}}
                    >
                        הבא
                        {theme.direction === 'rtl' ? (<KeyboardArrowLeft/>) : (<KeyboardArrowRight/>)}
                    </Button>}
                    backButton={<Button
                        size="small"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        sx={{visibility: activeStep === 0 ? 'hidden' : 'visible'}}
                    >
                        {theme.direction === 'rtl' ? (<KeyboardArrowRight/>) : (<KeyboardArrowLeft/>)}
                        הקודם
                    </Button>}
                />
            </Grid>
        </Grid>
    );
}
