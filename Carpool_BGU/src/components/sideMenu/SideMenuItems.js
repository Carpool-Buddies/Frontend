import {contextTypes} from "../../common/DialogContexts";

export default [
    {
        "key": "profile",
        "primary": "שלום, ",
        "secondary": "ערוך פרופיל",
        "link": "./EditProfilePage",
        "disabled": false,
        "divider_after": true
    },
    {
        "key": contextTypes.publishRide,
        "primary": "פרסם נסיעה",
        "secondary": "",
        "link": contextTypes.publishRide,
        "disabled": false,
        "divider_after": false
    },
    {
        "key": contextTypes.findRiders,
        "primary": "מצא טרמפיסטים",
        "secondary": "בקרוב!",
        "link": "./register",
        "disabled": true,
        "divider_after": false
    },
    {
        "key": contextTypes.publishRideSearch,
        "primary": "פרסם בקשה לטרמפ",
        "secondary": "בקרוב!",
        "link": contextTypes.publishRideSearch,
        "disabled": true,
        "divider_after": false
    },
    {
        "key": contextTypes.findRide,
        "primary": "מצא טרמפ",
        "secondary": "",
        "link": contextTypes.findRide,
        "disabled": false,
        "divider_after": true
    },
    {
        "key": 'myRides',
        "primary": "הנסיעות שלך",
        "secondary": '',
        "link": './myRides',
        "disabled": false,
        "divider_after": false
    },
    {
        "key": 'myRequests',
        "primary": "הבקשות שלך",
        "secondary": "",
        "link": './myJoinRequests',
        "disabled": false,
        "divider_after": true
    }
]
