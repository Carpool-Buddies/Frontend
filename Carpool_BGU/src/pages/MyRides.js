import * as React from 'react';
import {AppBar, Box, IconButton, List, Toolbar, Typography} from "@mui/material";
import dayjs from "dayjs";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchHome, fetchRides, getUserDetails} from "../common/fetchers";
import RideItem from "../components/MyRidesRideItem";

const MyRides = (props) => {

    const [userFirstName, setUserFirstName] = useState('')
    const [userId, setUserId] = useState('')
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
                    setUserId(ret.id)
                    fetchRides(ret.id, localStorage.getItem('access_token')).then((ret) => {
                        console.log(ret)
                        setUserRides(ret.ride_posts)
                    })
                }
            }).catch()
        } else {
            navigate('/')
        }
    }, [isLoggedIn]);

    const dateSort = (a, b) => {
        const dateA = dayjs(a._departure_datetime);
        const dateB = dayjs(b._departure_datetime);

        // Compare the dates
        if (dateA.isBefore(dateB)) return -1;
        if (dateA.isAfter(dateB)) return 1;
        return 0;


    }

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
                            <Typography>
                                נסיעות עתידיות
                            </Typography>
                            {userRides
                                .filter((ride) => dayjs(ride._departure_datetime).isAfter(dayjs()))
                                .sort((a, b) => dateSort(a, b))
                                .map(ride => (
                                    <RideItem key={ride.ride_id} ride={ride}/>
                                ))}
                            <Typography>
                                נסיעות עבר
                            </Typography>
                            {userRides
                                .filter((ride) => dayjs(ride._departure_datetime).isBefore(dayjs()))
                                .sort((a, b) => dateSort(b, a))
                                .map(ride => (
                                    <RideItem key={ride.ride_id} ride={ride}/>
                                ))}
                        </List>) :
                    (<div>לא מוכן עדיין</div>)}
            </Box>
        </Box>
    )
}

export default MyRides