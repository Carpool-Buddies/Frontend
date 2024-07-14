import * as React from 'react';
import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {AdvancedMarker, APIProvider, Map} from "@vis.gl/react-google-maps";
import {fetchHome, findRide, getUserDetails, logout} from '../common/fetchers'
import {Box} from "@mui/material";
import SideMenu from "../components/sideMenu/SideMenu";
import LoginComp from "../components/login";
import {toast} from "react-toastify";
import {AvatarInitials} from "../common/Functions";
import dayjs from "dayjs";
import MainMapMarker from "../components/mainMapMarker";
import SwipeableTemporaryDrawer from "../components/swipableDrawer";
import UpcomingRideAlert from "../components/upcomingRideAlert";

export default function Home() {

    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const [viewport, setViewport] = useState({})
    const [rideMarkers, setRideMarkers] = useState([]);

    const [profile, setProfile] = useState(null)

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('access_token'))
            fetchHome(localStorage.getItem('access_token')).then((ret) => {
                if (ret.success)
                    setIsLoggedIn(true)
                else {
                    localStorage.removeItem('access_token')
                    setIsLoggedIn(false)
                }
                if (!ret) {
                    console.log('Access token based login failed')
                    setIsLoggedIn(false)
                }
            }).catch(() => localStorage.removeItem('access_token'))
        else
            setIsLoggedIn(false)
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

    const handleLogout = async () => {
        const ret = await logout(localStorage.getItem('access_token'));
        if (ret.success === true) {
            setIsLoggedIn(false)
            setProfile(null)
            setRideMarkers([])
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
        <SideMenu navigate={navigate} handleLogout={handleLogout} profile={profile}/>
        <SwipeableTemporaryDrawer/>
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
        {profile && <UpcomingRideAlert profile={profile}/>}
    </Box>)

    return isLoggedIn ? (loggedIn) : (<LoginComp navigate={navigate} setIsLoggedIn={setIsLoggedIn}/>);
}