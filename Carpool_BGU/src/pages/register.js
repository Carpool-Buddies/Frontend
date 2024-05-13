import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {styled} from "@mui/material/styles";
import {DatePicker} from "@mui/x-date-pickers";
import {MenuItem} from "@mui/material";
import MuiPhoneNumber from "mui-phone-number";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../common/fetchers";
import { TextField, Button, Grid, Typography, Box, Container, Link } from "@mui/material";
import dayjs from 'dayjs';
import logo from '../static/BGU_logo.png';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const Register = props => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNUmber] = useState('');
    const [birthday, setBirthday] = useState('');
    const maxBirthDate = dayjs().subtract(16, 'year');


    const handleSubmit = async event => {
        event.preventDefault();

        // Validate form fields
        if (!email || !password || !confirmPassword || !firstName || !lastName || !phoneNumber || !birthday) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (dayjs(birthday).isAfter(maxBirthDate)) {
            toast.error("You must be at least 16 years old to register");
            return;
        }

        const ret = await register(email, password, firstName, lastName, phoneNumber, birthday);
        if (ret.success) {
            toast.success("Registration successful");
            navigate('/');
        } else {
            toast.error(ret.error);
        }
    };


    function Copyright(props) {
        return (
            <Typography variant="body2" color="text.secondary" align="center" {...props}>
                {'Copyright © '}
                <Link color="inherit" href="https://www.google.com">
                    Carpool BGU
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }

    const MyComponent = styled('button')({
            fontSize: 60,
            backgroundColor: 'orange'
        },
        {
            '&:hover': {
                fontSize: 40,
                backgroundColor: 'red'
            }
        });

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{minHeight: '100vh'}}
            >
                <Grid item xs={3}>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            border: 1,
                            borderRadius: 10,
                            boxShadow: 5,
                            padding: 10
                        }}
                    >
                        <img src={logo} style={{width: 50}}/>
                        <Typography component="h1" variant="h5">
                            Carpool BGU
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                            <TextField
                                autoFocus
                                margin="normal"
                                required
                                fullWidth
                                label='שם פרטי'
                                name="first_name"
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label='שם משפחה'
                                name="last_name"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <MuiPhoneNumber
                                defaultCountry={'il'}
                                onlyCountries={['il']}
                                label='מספר טלפון'
                                variant='outlined'
                                onChange={(e) => setPhoneNUmber(e)}/>
                            <DatePicker
                                margin="normal"
                                required
                                fullWidth
                                label="תאריך לידה"
                                name="birth-date"
                                openTo="year"
                                maxDate={maxBirthDate}
                                views={['year', 'month', 'day']}
                                onChange={(e) => setBirthday(e)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label='דוא"ל'
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="סיסמה"
                                name="password"
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="אימות סיסמה"
                                name="confirm-password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type="password"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                // sx={{mt: 3, mb: 2}}
                            >
                                הירשם
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link
                                        onClick={(event) => {
                                            navigate('/')
                                        }} variant="body2">
                                        {"כבר יש לך משתמש קיים?"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Copyright sx={{mt: 8, mb: 4}}/>
                </Grid>
            </Grid>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable pauseOnFocusLoss />
        </Container>
    );
}

export default Register;