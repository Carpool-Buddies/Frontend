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
import Map, {GeolocateControl, Marker} from 'react-map-gl/maplibre';
import {useContext, useState} from "react";
import logo from '../static/BGU_logo.png'
import {login} from '../common/fetchers'
import AuthContext from "../common/AuthProvider";
import {Fab} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import SideMenu from "../components/sideMenu/SideMenu";
import FormDialog from "../components/PostFutureRide";


const Home = props => {

    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const {children} = props;
    const navigate = useNavigate();
    const {setAuth} = useContext(AuthContext);

    const [open, setOpen] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async event => {
        event.preventDefault();

        const ret = await login(email, password);
        console.log(ret)
        if (ret.success === true) {
            console.log('yay!')
            const user = ret.user.email
            const ret_token = ret.token
            setAuth({user, ret_token});
            setIsLoggedIn(true)
        } else
            console.log('nay.')
    };

    const toggleSideMenu = (newOpen) => () => {
        setOpen(newOpen);
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

    const lat = 32.034191
    const long = 34.87721

    const loggedIn = (
        <Box display='flex' height="100vh">
            <Fab variant="extended" color='primary'
                 onClick={toggleSideMenu(true)}
                 style={{position: 'absolute', top: 25, right: 25, zIndex: 10}}>
                <MenuIcon sx={{mr: 1}}/>
                תפריט
            </Fab>
            <SideMenu open={open} setOpen={setOpen} navigate={navigate} handleOpenDialog={handleOpenDialog}/>
            <Map
                initialViewState={{
                    longitude: long,
                    latitude: lat,
                    zoom: 14
                }}
                style={{width: '100%', height: '100%', zIndex: 0}}
                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            >
                <GeolocateControl position='bottom-left'/>
                <Marker longitude={long} latitude={lat} anchor="bottom" pitchAlignment='map'>
                    <img alt='marker' src={logo} style={{width: 20, height: "auto"}}/>
                </Marker>
            </Map>
            <FormDialog open={openDialog} handleCloseDialog={handleCloseDialog}/>
        </Box>
    )

    const loggedOut = (<Container component="main" maxWidth="xs">
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
                                <Link href="#" variant="body2">
                                    שכחתי סיסמה
                                </Link>
                            </Grid>
                            <Grid item xs={12}>
                                <Link
                                    onClick={() => {
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

    </Container>)

    return true ? (loggedIn) : (loggedOut);
}

export default Home;