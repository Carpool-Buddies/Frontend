 import * as React from 'react';
import {useNavigate} from "react-router-dom";
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Map, {GeolocateControl, Marker} from 'react-map-gl/maplibre';
import {useEffect, useState} from "react";
import {fetchHome, getUserDetails} from '../common/fetchers'
import {Avatar, Fab} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import SideMenu from "../components/sideMenu/SideMenu";
import FormDialog from "../components/PostFutureRideDialog";
import LoginComp from "../components/login";


    const StyledLink = styled(Link)(({ theme }) => ({
        cursor: 'pointer', // Change the cursor to pointer (hand icon)
        '&:hover': {
            textDecoration: 'underline', // Optionally, add an underline on hover
        },
    }));

const Home = props => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [avatarInitials, setAvatarInitials] = useState('')
    const [viewport, setViewport] = useState({});
    const [openSideMenu, setOpenSideMenu] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);
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

    const toggleSideMenu = (newOpen) => () => {
        setOpenSideMenu(newOpen);
    };

    const loggedIn = (<Box display='flex' height="100vh">
        <Fab variant="extended" color='primary'
             onClick={toggleSideMenu(true)}
             style={{position: 'absolute', top: 25, right: 25, zIndex: 10}}>
            <MenuIcon sx={{mr: 1}}/>
            תפריט
        </Fab>
        <SideMenu open={openSideMenu} setOpen={setOpenSideMenu} navigate={navigate}
                  handleOpenDialog={handleOpenDialog}/>
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
        <FormDialog openDialog={openDialog} handleCloseDialog={handleCloseDialog}/>
    </Box>)

    return isLoggedIn ? (loggedIn) : (<LoginComp setIsLoggedIn={setIsLoggedIn}/>);
}

export default Home;