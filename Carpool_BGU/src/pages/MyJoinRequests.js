import * as React from 'react';
import {useEffect, useState} from 'react';
import {AppBar, Box, IconButton, List, ListItem, ListItemText, Toolbar, Typography} from "@mui/material";
import dayjs from "dayjs";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {useNavigate} from "react-router-dom";
import {fetchHome, fetchJoinRequests, getUserDetails} from "../common/fetchers";
import {dateSort} from "../common/Functions";
import JoinRequestItem from "../components/MyJoinRequestsRequestItem";

const MyJoinRequests = () => {

    const [userFirstName, setUserFirstName] = useState('')
    const [userId, setUserId] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [userJoinRequests, setUserJoinRequests] = useState(null)

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
                    fetchJoinRequests(ret.id, localStorage.getItem('access_token')).then((ret) => {
                        setUserJoinRequests(ret.data)
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
                        בקשות ההצטרפות של {userFirstName}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box component="main" sx={{p: 3}}>
                {userJoinRequests ? (
                        <List>
                            <Typography>
                                נסיעות עתידיות
                            </Typography>
                            {userJoinRequests.filter((ride) => dayjs(ride._departure_datetime).isAfter(dayjs())).length > 0 ?
                                userJoinRequests
                                    .filter((ride) => dayjs(ride._departure_datetime).isAfter(dayjs()))
                                    .sort((a, b) => dateSort(a, b))
                                    .map(ride => (
                                        <JoinRequestItem key={ride.ride_id} joinRequest={ride} userFirstName={userFirstName} userId={userId}/>
                                    )) : <ListItem><ListItemText primary='לא נמצאו רשומות'/></ListItem>}
                            <Typography>
                                נסיעות עבר
                            </Typography>
                            {userJoinRequests.filter((ride) => dayjs(ride._departure_datetime).isBefore(dayjs())).length > 0 ?
                                userJoinRequests
                                    .filter((ride) => dayjs(ride._departure_datetime).isBefore(dayjs()))
                                    .sort((a, b) => dateSort(b, a))
                                    .map(ride => (
                                        <JoinRequestItem key={ride.ride_id} joinRequest={ride} userFirstName={userFirstName} userId={userId}/>
                                    )) : <ListItem><ListItemText primary='לא נמצאו רשומות'/></ListItem>}
                        </List>) :
                    (<div>לא מוכן עדיין</div>)}
            </Box>
        </Box>
    )
}

export default MyJoinRequests