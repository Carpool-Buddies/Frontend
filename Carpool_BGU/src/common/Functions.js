import * as React from "react";
import dayjs from "dayjs";
import {Avatar, Badge, styled} from "@mui/material";
import {getAddressFromCoords, getProfile} from "./fetchers";
import {useEffect, useState} from "react";
import verifiedBadge from '../static/BGU_logo.png'


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
        if (!props.profile) {
            getProfile(props.userId, localStorage.getItem('access_token'))
                .then((ret) => {
                    setProfile(ret.profile)
                })
                .catch(() => {
                    setProfile({first_name: "CPB", last_name: ""})
                })
        }
    }, [])

    const SmallAvatar = styled(Avatar)(() => ({
        width: props.small? 15: 20,
        height: props.small? 15: 20
    }));

    if (props.profile)
        return <Badge
            overlap="circular"
            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            badgeContent={
                props.profile.approved ? <SmallAvatar alt="verified" src={verifiedBadge}/> : <React.Fragment/>
            }>
            {props.small ?
                <Avatar sx={{width: 24, height: 24, fontSize: 14}}>
                    {props.profile.first_name[0] + props.profile.last_name[0]}
                </Avatar> :
                <Avatar sx={{bgcolor: '#FF9900'}}>{props.profile.first_name[0] + props.profile.last_name[0]}</Avatar>}
        </Badge>

    return profile &&
        <Badge
            overlap="circular"
            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            badgeContent={
                profile.approved ? <SmallAvatar alt="verified" src={verifiedBadge}/> : <React.Fragment/>
            }>
            {props.small ?
                <Avatar sx={{width: 24, height: 24, fontSize: 14}}>
                    {profile.first_name[0] + profile.last_name[0]}
                </Avatar> :
                <Avatar sx={{bgcolor: '#FF9900'}}>{profile.first_name[0] + profile.last_name[0]}</Avatar>}
        </Badge>
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
    const levels = ['locality', 'administrative_area_level_2', 'administrative_area_level_1', 'country']
    getAddressFromCoords(coords)
        .then((ret) => {
            if (ret.results && ret.results[0]) {
                for (let j = 0; j < levels.length; j++) {
                    for (let i = 0; i < ret.results[0].address_components.length; i++) {
                        if (ret.results[0].address_components[i].types.includes(levels[j])) {
                            setFunction(ret.results[0].address_components[i].long_name)
                            return
                        }
                    }
                }
            } else
                setFunction('...')
        })
        .catch(() => setFunction('...'))
}

export function startRideIsDue(departureDatetime) {
    return dayjs(departureDatetime).isBefore(dayjs().add(30, 'day')) //TODO: day is for debugging, change to minutes
}