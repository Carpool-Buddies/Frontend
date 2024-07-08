import * as React from 'react';
import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {AdvancedMarker, APIProvider, Map} from "@vis.gl/react-google-maps";
import {fetchHome, findRide, getUserDetails, logout} from '../common/fetchers'
import {Box, Fab} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import SideMenu from "../components/sideMenu/SideMenu";
import FormDialog from "../components/PostFutureRideDialog";
import LoginComp from "../components/login";
import {contextTypes} from "../components/DialogContexts";
import {toast} from "react-toastify";
import {AvatarInitials} from "../common/Functions";
import dayjs from "dayjs";
import MainMapMarker from "../components/mainMapMarker";
import VerifyProfileDialog from "../components/verifyProfileDialog";

export default function Home() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [viewport, setViewport] = useState({})
    const [rideMarkers, setRideMarkers] = useState([]);

    const [profile, setProfile] = useState(null)
    const [openSideMenu, setOpenSideMenu] = useState(false);

    const [openPostRideDialog, setOpenPostRideDialog] = useState(false);
    const [openRideRequestDialog, setOpenRideRequestDialog] = useState(false);
    const [openFindRideDialog, setOpenFindRideDialog] = useState(false);
    const [openVerifyProfileDialog, setOpenVerifyProfileDialog] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('access_token'))
            fetchHome(localStorage.getItem('access_token')).then((ret) => {
                if (ret.success)
                    setIsLoggedIn(true)
                else
                    localStorage.removeItem('access_token')
                if (!ret) {
                    console.log('Access token based login failed')
                }
            }).catch(() => localStorage.removeItem('access_token'))
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            if (!window.google || !window.google.maps) {
                const loadScript = (src) => {
                    return new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = src;
                        script.async = true;
                        script.defer = true
                        script.onload = resolve;
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });
                };
                loadScript(`https://maps.googleapis.com/maps/api/js?key=AIzaSyCFaNEpBsTboNXUeUheimTz8AbP5BLPZ2g&language=he`)
                    .then(() => {
                        // Handle script load success
                    })
                    .catch(() => {
                        console.error('Google Maps script could not be loaded');
                    });
            }
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setViewport({
                        ...viewport,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        zoom: 14,
                    });

                    findRide({
                        origin: {
                            coords: {lat: position.coords.latitude, long: position.coords.longitude},
                            radius: 5 * 1000
                        },
                        destination: {
                            coords: {lat: 31.400000, long: 34.976389},
                            radius: 240 * 1000
                        },
                        avSeats: 1,
                        dateTime: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS')+'Z',
                        deltaHours: 240
                    }, localStorage.getItem('access_token')).then(ret => {
                        if (ret.success) {
                            setRideMarkers(ret.ride_posts)
                        }
                    })
                },
                function (error) {
                    console.log(error.code + ": " + error.message);
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 10000,
                    timeout: 5000
                }
            )
            getUserDetails(localStorage.getItem('access_token')).then((ret) => {
                if (ret.success) {
                    setProfile(ret)
                }
            }).catch()
        }
    }, [isLoggedIn]);

    const handleOpenDialog = (dialogKey) => {
        switch (dialogKey) {
            case contextTypes.publishRide:
                setOpenPostRideDialog(true)
                break
            case contextTypes.publishRideSearch:
                setOpenRideRequestDialog(true)
                break
            case contextTypes.findRide:
                setOpenFindRideDialog(true)
                break
            default:
                break
        }
    };

    const handleCloseDialog = (dialogKey) => {
        switch (dialogKey) {
            case contextTypes.publishRide:
                setOpenPostRideDialog(false);
                break
            case contextTypes.publishRideSearch:
                setOpenRideRequestDialog(false)
                break
            case contextTypes.findRide:
                setOpenFindRideDialog(false)
                break
            default:
                break
        }
    };

    const toggleSideMenu = (newOpen) => () => {
        setOpenSideMenu(newOpen);
    };

    const handleLogout = async () => {
        const ret = await logout(localStorage.getItem('access_token'));
        if (ret.success === true) {
            setIsLoggedIn(false)
            localStorage.removeItem('access_token')
            toast.success('התנתקת בהצלחה');
        } else {
            if (ret.error) {
                toast.error(ret.error);
            } else {
                toast.error('ההתנתקות נכשלה');
            }
        }
    }

    const loggedIn = (<Box display='flex' height="90vh">
        <Fab variant="extended" color='primary'
             onClick={toggleSideMenu(true)}
             style={{position: 'absolute', top: 25, right: 25, zIndex: 10}}>
            <MenuIcon sx={{mr: 1}}/>
            תפריט
        </Fab>
        <SideMenu open={openSideMenu} setOpen={setOpenSideMenu} navigate={navigate}
                  handleOpenDialog={handleOpenDialog} handleLogout={handleLogout} profile={profile}
                  setOpenVerifyProfileDialog={setOpenVerifyProfileDialog}/>
        {viewport.latitude && viewport.longitude && (

            <APIProvider apiKey='AIzaSyCFaNEpBsTboNXUeUheimTz8AbP5BLPZ2g'>
                <Map
                    mapId={'a6c72e4f93862a68'}
                    style={{width: '100%', height: '100%', zIndex: 0}}
                    defaultCenter={{lat: viewport.latitude, lng: viewport.longitude}}
                    defaultZoom={14}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                >
                    {profile && <AdvancedMarker position={{lat: viewport.latitude, lng: viewport.longitude}}>
                        <AvatarInitials userId={profile.id} profile={profile} small={true}/>
                    </AdvancedMarker>}

                    {rideMarkers.map((item, index) =>
                        <MainMapMarker ride={{key: index, rideDetails: item}}/>)}
                </Map>
            </APIProvider>
        )}
        <FormDialog dialogContext={contextTypes.publishRide} openDialog={openPostRideDialog}
                    handleCloseDialog={handleCloseDialog}/>
        <FormDialog dialogContext={contextTypes.publishRideSearch} openDialog={openRideRequestDialog}
                    handleCloseDialog={handleCloseDialog}/>
        <FormDialog dialogContext={contextTypes.findRide} openDialog={openFindRideDialog}
                    handleCloseDialog={handleCloseDialog}/>
        {profile && <VerifyProfileDialog profile={profile} open={openVerifyProfileDialog}
                                         handleCloseDialog={() => setOpenVerifyProfileDialog(false)}/>}
    </Box>)

    return isLoggedIn ? (loggedIn) : (<LoginComp navigate={navigate} setIsLoggedIn={setIsLoggedIn}/>);
}