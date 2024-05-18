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
import {useState} from "react";
import Typography from "@mui/material/Typography";

function ExtraDetailsForm({notes, setAvSeats, setDateTime, setNotes}) {

    const roundToNearest30Minutes = (time) => {
        const roundedMinute = Math.round(time.minute() / 30) * 30;
        return time.startOf("hour").add(roundedMinute, "minute");
    };

    return (
        <Box display='flex'
             justifyContent="center">
            <Grid container display='flex' justifyContent="center">
                <Grid item xs={12}>
                    <Typography>
                        הכנס פרטים נוספים
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField type="number"
                               label="מקומות פנויים"
                               defaultValue={0}
                               fullWidth
                               margin="normal"
                               onChange={(e) => setAvSeats(e.target.value)}
                               InputProps={{inputProps: {min: 0, max: 10}}}/>
                </Grid>
                <Grid item xs={12}>
                    <DateTimePicker margin="normal"
                                    label="תאריך ושעת יציאה משוערת"
                                    onChange={(v) => setDateTime(v.format('YYYY-MM-DD_HH:MM'))}
                                    defaultValue={roundToNearest30Minutes(dayjs().add(6, 'h'))}
                    />
                </Grid>
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
                </Grid>
            </Grid>
        </Box>
    )
}

export default function TextMobileStepper({rideDetails, setRideDetails}) {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
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
    const setAvSeats = (avSeats) => {
        setRideDetails(existingState => ({
            ...existingState,
            avSeats: avSeats
        }))
    }
    const setDateTime = (dateTime) => {
        setRideDetails(existingState => ({
            ...existingState,
            dateTime: dateTime
        }))
    }
    const setNotes = (notes) => {
        setRideDetails(existingState => ({
            ...existingState,
            notes: notes
        }))
    }
    const maxSteps = 3;

    const originSelector = (<LocationSelector
        title="בחר כתובת מוצא"
        setLocationDetails={setPickupLocationDetails}/>)
    const destinationSelector = (<LocationSelector
        title="בחר כתובת יעד"
        setLocationDetails={setDropOffLocationDetails}/>)

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

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
                        notes={rideDetails.notes}
                        setAvSeats={setAvSeats}
                        setDateTime={setDateTime}
                        setNotes={setNotes}/>
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
                    >
                        הבא
                        {theme.direction === 'rtl' ? (<KeyboardArrowLeft/>) : (<KeyboardArrowRight/>)}
                    </Button>}
                    backButton={<Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? (<KeyboardArrowRight/>) : (<KeyboardArrowLeft/>)}
                        הקודם
                    </Button>}
                />
            </Grid>
        </Grid>
    );
}
