import * as React from "react";
import dayjs from "dayjs";
import {Avatar} from "@mui/material";
import {getAddressFromCoords, getProfile} from "./fetchers";
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

export function formatPhoneNumber(phoneNumber) {
    // Remove any non-digit characters (like +, -, spaces)
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Check for the country code and format accordingly
    let formattedNumber;
    if (cleaned.startsWith('972')) {
        // Format for numbers starting with country code 972 (Israel)
        const countryCode = cleaned.slice(0, 3);
        const areaCode = cleaned.slice(3, 5);
        const mainNumberPart1 = cleaned.slice(5, 8);
        const mainNumberPart2 = cleaned.slice(8, 12);
        formattedNumber = `+${countryCode} ${areaCode} ${mainNumberPart1} ${mainNumberPart2}`;
    } else {
        // General format (fallback if country code is not 972)
        formattedNumber = phoneNumber;
    }

    return formattedNumber;
}

export function setCityName(coords, setFunction) {
    getAddressFromCoords(coords)
        .then((ret) => {
            if (ret.address.city)
                setFunction(ret.address.city)
            else
                setFunction(ret.address.town)
        })
}