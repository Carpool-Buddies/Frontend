import * as React from 'react';
import {useNavigate} from "react-router-dom";
import Box from '@mui/material/Box';
import Map, {GeolocateControl, Marker} from 'react-map-gl/maplibre';
import {useEffect, useState} from "react";
import {fetchHome, getUserDetails, logout} from '../common/fetchers'
import {Avatar, Fab} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import SideMenu from "../components/sideMenu/SideMenu";
import FormDialog from "../components/PostFutureRideDialog";
import LoginComp from "../components/login";
import {contextTypes} from "../components/DialogContexts";
import {toast} from "react-toastify";

const Home = props => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [avatarInitials, setAvatarInitials] = useState('')
    const [userFirstName, setUserFirstName] = useState('')
    const [viewport, setViewport] = useState({});
    const [openSideMenu, setOpenSideMenu] = useState(false);

    const [openPostRideDialog, setOpenPostRideDialog] = useState(false);
    const [openRideRequestDialog, setOpenRideRequestDialog] = useState(false);
    const [openFindRideDialog, setOpenFindRideDialog] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHome(localStorage.getItem('access_token')).then((ret) => {
            if (ret.success)
                setIsLoggedIn(true)
            else
                localStorage.removeItem('access_token')
            if (!ret) {
                console.log('Access token based login failed')
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
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            getUserDetails(localStorage.getItem('access_token')).then((ret) => {
                if (ret.success) {
                    setUserFirstName(ret.first_name)
                    setAvatarInitials(ret.first_name[0] + ret.last_name[0])
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

    const loggedIn = (<Box display='flex' height="100vh">
        <Fab variant="extended" color='primary'
             onClick={toggleSideMenu(true)}
             style={{position: 'absolute', top: 25, right: 25, zIndex: 10}}>
            <MenuIcon sx={{mr: 1}}/>
            תפריט
        </Fab>
        <SideMenu open={openSideMenu} setOpen={setOpenSideMenu} navigate={navigate}
                  handleOpenDialog={handleOpenDialog} handleLogout={handleLogout} name={userFirstName}/>
        {viewport.latitude && viewport.longitude && (
            <Map
                initialViewState={viewport}
                style={{width: '100%', height: '100%', zIndex: 0}}
                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            >
                <GeolocateControl position='bottom-left'/>
                <Marker longitude={viewport.longitude} latitude={viewport.latitude}>
                    {avatarInitials && (<Avatar
                        sx={{width: 24, height: 24, fontSize: 14}}>{avatarInitials}</Avatar>)}
                </Marker>
            </Map>
        )}
        <FormDialog dialogContext={contextTypes.publishRide} openDialog={openPostRideDialog} handleCloseDialog={handleCloseDialog}/>
        <FormDialog dialogContext={contextTypes.publishRideSearch} openDialog={openRideRequestDialog} handleCloseDialog={handleCloseDialog}/>
        <FormDialog dialogContext={contextTypes.findRide} openDialog={openFindRideDialog} handleCloseDialog={handleCloseDialog}/>
    </Box>)

    return isLoggedIn ? (loggedIn) : (<LoginComp navigate={navigate} setIsLoggedIn={setIsLoggedIn}/>);
}

export default Home;