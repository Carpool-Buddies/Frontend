import {Alert, AlertTitle} from "@mui/material";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import {MyRideViewDialog} from "./MyRides/MyRidesRideItem";
import * as React from "react";
import {useEffect, useState} from "react";
import {fetchRides} from "../common/fetchers";
import {rideStatusTypes} from "../common/backendTerms";
import {dateSort, startRideIsDue} from "../common/Functions";

export default function UpcomingRideAlert(props) {
    const [clicked, setClicked] = useState(false)
    const [upcomingRide, setUpcomingRide] = useState(null)
    const [upcomingRideDialogOpen, setUpcomingRideDialogOpen] = useState(false)

    useEffect(() => {
        fetchRides(props.profile.id, localStorage.getItem('access_token')).then((rides_ret) => {
            try {
                const inProgressRide = rides_ret.ride_posts.find(item => item._status === rideStatusTypes.inProgress)
                if (inProgressRide) {
                    setUpcomingRide(inProgressRide)
                } else {
                    setUpcomingRide(rides_ret.ride_posts
                        .filter(ride =>
                            ride._status === rideStatusTypes.waiting &&
                            startRideIsDue(ride._departure_datetime) &&
                            dayjs(ride._departure_datetime).isAfter(dayjs())
                        )
                        .sort((a, b) => dateSort(a, b))[0])
                }

            } catch (e) {
            }
        })
    }, [])

    const handleClickOpen = () => {
        setClicked(true)
        setUpcomingRideDialogOpen(true);
    };

    const handleClose = () => {
        setUpcomingRideDialogOpen(false);
    };
    return upcomingRide && (
        <React.Fragment>
            <Alert
                style={{width: 'calc(100% - 75px)', position: 'absolute', bottom: 25, right: 25, zIndex: 10, alignItems: "center"}}
                color='primary'
                variant="filled"
                icon={false}
                action={
                    <Button onClick={handleClickOpen} color="inherit" size="small">
                        פתח<br/>נסיעה
                    </Button>
                }
            >
                <AlertTitle>
                    {upcomingRide._status === rideStatusTypes.inProgress ?
                        'נסיעה בתהליך' :
                        'הנסיעה שלך תתחיל בקרוב'}
                </AlertTitle>

                {upcomingRide._status === rideStatusTypes.inProgress ?
                    '' :
                    <React.Fragment>
                        יציאה ב-{dayjs(upcomingRide._departure_datetime).format("D/M/YY, H:mm")}
                    </React.Fragment>
                }
            </Alert>
            {clicked && props.profile && <MyRideViewDialog
                open={upcomingRideDialogOpen}
                onClose={handleClose}
                userFirstName={props.profile.first_name}
                rideDetails={upcomingRide}
            />}
        </React.Fragment>
    )
}