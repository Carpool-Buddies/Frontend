import * as React from 'react';
import {AppBar, Box, Divider, IconButton, List, ListItem, ListItemText, Toolbar, Typography} from "@mui/material";
import dayjs from "dayjs";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchHome, fetchRides, getUserDetails} from "../common/fetchers";
import RideItem from "../components/MyRidesRideItem";
import {dateSort} from "../common/Functions";
import {rideStatusTypes} from "../common/backendTerms";

const MyRides = () => {

    const [userFirstName, setUserFirstName] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [userRides, setUserRides] = useState(null)

    const navigate = useNavigate();

    useEffect(() => {
        fetchHome(localStorage.getItem('access_token')).then((ret) => {
            if (ret.success)
                setIsLoggedIn(true)
            else
                localStorage.removeItem('access_token')
            if (!ret) {
                console.log('Access token based login failed')
                navigate('/')
            }
        }).catch(() => localStorage.removeItem('access_token'))
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            getUserDetails(localStorage.getItem('access_token')).then((ret) => {
                if (ret.success) {
                    setUserFirstName(ret.first_name)
                    fetchRides(ret.id, localStorage.getItem('access_token')).then((ret) => {
                        setUserRides(ret.ride_posts)
                    })
                }
            }).catch()
        } else {
            navigate('/')
        }
    }, [isLoggedIn]);

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton onClick={() => navigate('/')}>
                        <ArrowForwardIcon sx={{mr: 1}}/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        הנסיעות של {userFirstName}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box component="main" sx={{p: 3}}>
                {userRides ? (
                        <List>
                            {userRides.filter((ride) => ride._status === rideStatusTypes.inProgress).length > 0 ?
                                <React.Fragment>
                                    <Typography>נסיעות שמתקיימות כעת</Typography>
                                    {userRides
                                        .filter((ride) => ride._status === rideStatusTypes.inProgress)
                                        .sort((a, b) => dateSort(a, b))
                                        .map(ride => (<RideItem key={ride.ride_id} ride={ride} userFirstName={userFirstName}/>)
                                        )}
                                    <Divider/>
                                </React.Fragment>
                                : (<React.Fragment/>)}
                            <Typography>נסיעות עתידיות</Typography>
                            {userRides.filter((ride) =>
                                dayjs(ride._departure_datetime).isAfter(dayjs()) &&
                                ride._status !== rideStatusTypes.inProgress).length > 0 ?
                                userRides
                                    .filter((ride) => dayjs(ride._departure_datetime).isAfter(dayjs()) &&
                                        ride._status !== rideStatusTypes.inProgress)
                                    .sort((a, b) => dateSort(a, b))
                                    .map(ride => (<RideItem key={ride.ride_id} ride={ride} userFirstName={userFirstName}/>))
                                : <ListItem><ListItemText primary='לא נמצאו רשומות'/></ListItem>}
                            <Divider/>
                            <Typography>
                                נסיעות עבר
                            </Typography>
                            {userRides.filter((ride) => dayjs(ride._departure_datetime).isBefore(dayjs()) &&
                                ride._status !== rideStatusTypes.inProgress).length > 0 ?
                                userRides
                                    .filter((ride) => dayjs(ride._departure_datetime).isBefore(dayjs()) &&
                                        ride._status !== rideStatusTypes.inProgress)
                                    .sort((a, b) => dateSort(b, a))
                                    .map(ride => (
                                        <RideItem key={ride.ride_id} ride={ride} userFirstName={userFirstName}/>
                                    )) : <ListItem><ListItemText primary='לא נמצאו רשומות'/></ListItem>}
                        </List>) :
                    (<div>לא מוכן עדיין</div>)}
            </Box>
        </Box>
    )
}

export default MyRides