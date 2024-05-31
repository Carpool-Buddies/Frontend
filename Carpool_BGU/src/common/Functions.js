import * as React from "react";
import dayjs from "dayjs";
import {Avatar} from "@mui/material";
import {getProfile} from "./fetchers";
import {useEffect, useState} from "react";


export const dateSort = (a, b) => {
    const dateA = dayjs(a._departure_datetime);
    const dateB = dayjs(b._departure_datetime);

    // Compare the dates
    if (dateA.isBefore(dateB)) return -1;
    if (dateA.isAfter(dateB)) return 1;
    return 0;
}

export const datePassed = (date_str) => {
    return dayjs(date_str).isBefore(dayjs())
}

export const AvatarInitials = (props) => {
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        getProfile(props.userId, localStorage.getItem('access_token'))
            .then((ret) => {
                setProfile(ret.profile)
            })
            .catch(() => {
                setProfile({first_name: "CPB", last_name: ""})
            })
    }, [])

    return profile && (props.small ?
        (<Avatar sx={{width: 24, height: 24, fontSize: 14}}>{profile.first_name[0] + profile.last_name[0]}</Avatar>) :
        (<Avatar>{profile.first_name[0] + profile.last_name[0]}</Avatar>))
}