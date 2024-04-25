import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {styled} from "@mui/material/styles";
import {useState} from "react";
import logo from './static/BGU_logo.png'
import {DatePicker, LocalizationProvider, StaticDatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useNavigate} from "react-router-dom";


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

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({
            email: username,
            password: password,
        });
    };

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
                                name="password"
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                // sx={{mt: 3, mb: 2}}
                            >
                                התחבר
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
        </Container>
    );
}

export default Register;