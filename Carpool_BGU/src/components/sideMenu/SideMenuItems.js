import {contextTypes} from "../DialogContexts";

export default [
    {
        "key": "profile",
        "icon": "AccountCircleIcon",
        "primary": "שלום אורח",
        "secondary": "ערוך פרופיל",
        "link": "./profileView",
        "disabled": false,
        "divider_after": true
    },
    {
        "key": contextTypes.publishRide,
        "icon": "DirectionsCarFilledIcon",
        "primary": "פרסם נסיעה",
        "secondary": "",
        "link": contextTypes.publishRide,
        "disabled": false,
        "divider_after": false
    },
    {
        "key": contextTypes.findRiders,
        "icon": "DirectionsCarFilledIcon",
        "primary": "מצא טרמפיסטים",
        "secondary": "",
        "link": "./register",
        "disabled": false,
        "divider_after": false
    },
    {
        "key": contextTypes.publishRideSearch,
        "icon": "EmojiPeopleIcon",
        "primary": "פרסם בקשה לטרמפ",
        "secondary": "בקרוב!",
        "link": contextTypes.publishRideSearch,
        "disabled": true,
        "divider_after": false
    },
    {
        "key": contextTypes.findRide,
        "icon": "EmojiPeopleIcon",
        "primary": "מצא טרמפ",
        "secondary": "",
        "link": contextTypes.findRide,
        "disabled": false,
        "divider_after": false
    }
]
