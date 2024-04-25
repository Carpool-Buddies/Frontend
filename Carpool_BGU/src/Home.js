import * as React from 'react';
import {useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {styled} from "@mui/material/styles";
import {useState} from "react";
import logo from './static/BGU_logo.png'
import {Paper} from "@mui/material";


const Home = props => {
    const navigate = useNavigate();

    const {children} = props;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
                                onChange={(e) => setUsername(e.target.value)}
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
                                    <Link href="#" variant="body2">
                                        שכחתי סיסמה
                                    </Link>
                                </Grid>
                                <Grid item xs={12}>
                                    <Link
                                        onClick={(event) => {
                                            navigate('/register')
                                        }}
                                        variant="body2">
                                        {"עדיין אין לך משתמש?"}
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

export default Home;