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

const originSelector = (<LocationSelector/>)
const destinationSelector = (<LocationSelector/>)

export default function TextMobileStepper() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = 3;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Grid container display="flex" justifyContent="center">
            <Grid item xs={12} sx={{width: '100%'}}>
                <Box hidden={activeStep !== 0} sx={{width:'100%'}} >
                    {originSelector}
                </Box>
                <Box hidden={activeStep !== 1}>
                    <TextField/>
                </Box>
                <Box hidden={activeStep !== 2}>
                    {destinationSelector}
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
