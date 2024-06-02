import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import logo from "../static/BGU_logo.png";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import * as React from "react";
import {login} from "../common/fetchers";
import {useContext, useState} from "react";
import AuthContext from "../common/AuthProvider";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function LoginComp({navigate, setIsLoggedIn}) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {setAuth} = useContext(AuthContext);

    const handleSubmit = async event => {
        event.preventDefault();

        const ret = await login(email, password);
        if (ret.success === true) {
            const user = ret.user.email;
            const ret_token = ret.data.token;
            setAuth({ user, ret_token });
            setIsLoggedIn(true);
            localStorage.setItem('access_token', ret_token);

            // Show the success toast
            toast.success('התחברות בוצעה בהצלחה!', {
                onClose: () => {
                    navigate('/home');
                },
            });
        } else {
            if (ret.error) {
                toast.error(ret.error);
            } else {
                toast.error('ארעה שגיאה בהתחברות');
            }
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
                        <img src={logo} style={{width: 50}} alt="bgu logo"/>
                        <Typography component="h1" variant="h5">
                            Carpool BGU
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                            <TextField
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                required
                                fullWidth
                                label='דוא"ל'
                                name="email"
                                autoFocus
                            />
                            <TextField
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="סיסמה"
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
                                <Grid item xs={12}>
                                    <Link
                                        href="#"
                                        variant="body2"
                                        onClick={() => navigate('/forgot-password')}
                                    >
                                        שכחתי סיסמה
                                    </Link>
                                </Grid>
                                <Grid item xs={12}>
                                    <Link
                                        onClick={() => {
                                            navigate('/register')
                                        }}
                                        variant="body2"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {"עדיין אין לך משתמש?"}
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
            />
        </Container>)
}