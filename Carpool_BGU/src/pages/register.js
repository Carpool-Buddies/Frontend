import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useState} from "react";
import logo from '../static/CPB logo.png'
import {DatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import {register} from "../common/fetchers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const Register = () => {

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

        if (!email || !password || !confirmPassword || !firstName || !lastName || !phoneNumber || !birthday) {
            toast.error("אנא מלא את כל השדות");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("הסיסמאות אינן תואמות");
            return;
        }

        if (dayjs(birthday).isAfter(maxBirthDate)) {
            toast.error("עליך להיות לפחות בן 16 כדי להירשם");
            return;
        }

        const ret = await register(email, password, firstName, lastName, '+972 ' + phoneNumber, birthday);
        if (ret.success) {
            toast.success(
                <Typography responsive variant="body1">
                {'ההרשמה הושלמה בהצלחה'}
            </Typography>
        );
            setTimeout(() => {
                navigate('/');
            }, 2000); // Delay navigation by 2 seconds (2000 milliseconds)
        } else {
            toast.error(ret.error);
        }
    };


    function Copyright(props) {
        return (
            <Typography variant="body2" color="text.secondary" align="center" {...props}>
                {'Copyright © '}
                <Link color="inherit" href="https://www.google.com">
                    Carpool Buddies
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }

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
                        <img src={logo} alt="cpb logo" style={{width: 50}}/>
                        <Typography component="h1" variant="h5">
                            Carpool Buddies
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
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="מספר טלפון"
                                value={phoneNumber}
                                onChange={(e) => {
                                    const number = e.target.value.trim().replace(/[^0-9]/g, "");
                                    if (number.length < 4) setPhoneNUmber(number)
                                    else if (number.length < 7) setPhoneNUmber(number.replace(/(\d{3})(\d)/, "$1-$2"))
                                    else if (number.length < 11) setPhoneNUmber(number.replace(/(\d{3})(\d{3})(\d)/, "$1-$2-$3"))
                                    else setPhoneNUmber(number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"))
                                }}
                                inputProps={{maxLength: 12}}
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
                                        onClick={() => {
                                            navigate('/')
                                        }}
                                        variant="body2"
                                        style={{ cursor: 'pointer' }}
                                        >
                                        {"כבר יש לך משתמש קיים?"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Copyright sx={{mt: 8, mb: 4}}/>
                </Grid>
            </Grid>
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
        </Container>
    );
}

export default Register;