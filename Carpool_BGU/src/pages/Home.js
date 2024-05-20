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
import {useContext, useEffect, useState} from "react";
import logo from '../static/BGU_logo.png'
import {fetchHome, getUserDetails, login} from '../common/fetchers'
import AuthContext from "../common/AuthProvider";
import {Avatar, Fab} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import SideMenu from "../components/sideMenu/SideMenu";
import FormDialog from "../components/PostFutureRideDialog";


const Home = props => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [viewport, setViewport] = useState({});
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const [avatarInitials, setAvatarInitials] = useState('')

    const {setAuth} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHome(localStorage.getItem('access_token')).then((ret) => {
            if (ret.success)
                setIsLoggedIn(true)
            else
                localStorage.removeItem('access_token')
            if (!ret) {
                console.log('ret false')
            }
        }).catch(() => localStorage.removeItem('access_token'))

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setViewport({
                    ...viewport,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    zoom: 14,
                });
            });
    }, []);

    useEffect(() => {
        getUserDetails(localStorage.getItem('access_token')).then((ret) => {
            if (ret.success)
                setAvatarInitials(ret.first_name[0] + ret.last_name[0])
        }).catch()
    }, [isLoggedIn]);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    
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
            localStorage.setItem('access_token', ret_token)
        } else
            console.log('nay.')
    };

    const toggleSideMenu = (newOpen) => () => {
        setOpenSideMenu(newOpen);
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

    const loggedIn = (<Box display='flex' height="100vh">
        <Fab variant="extended" color='primary'
             onClick={toggleSideMenu(true)}
             style={{position: 'absolute', top: 25, right: 25, zIndex: 10}}>
            <MenuIcon sx={{mr: 1}}/>
            תפריט
        </Fab>
        <SideMenu open={openSideMenu} setOpen={setOpenSideMenu} navigate={navigate} handleOpenDialog={handleOpenDialog}/>
        {viewport.latitude && viewport.longitude && (
            <Map
                initialViewState={viewport}
                style={{width: '100%', height: '100%', zIndex: 0}}
                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            >
                <GeolocateControl position='bottom-left'/>
                <Marker longitude={viewport.longitude} latitude={viewport.latitude} anchor="bottom"
                        pitchAlignment='map'>
                    {avatarInitials && (<Avatar
                        sx={{ width: 24, height: 24, fontSize: 14 }}>{avatarInitials}</Avatar>)}
                </Marker>
            </Map>
        )}
        <FormDialog openDialog={openDialog} handleCloseDialog={handleCloseDialog}/>
    </Box>)

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

    return isLoggedIn ? (loggedIn) : (loggedOut);
}

export default Home;