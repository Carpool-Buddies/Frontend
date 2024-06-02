import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import CallIcon from "@mui/icons-material/Call";

function formatPhoneNumber(phoneNumber) {
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

export default function ProfileViewDialog(props) {

    const handleClose = () => {
        props.setDetailsDialogOpen(false);
    };

    return props.profile &&
        <Dialog onClose={handleClose} open={props.detailsDialogOpen}>
            <DialogTitle>{props.profile.first_name + ' ' + props.profile.last_name}</DialogTitle>
            <DialogContent>
                <List sx={{pt: 0}}>
                    <ListItem>
                        {/*TODO: implement call number*/}
                        <ListItemButton onClick={() => alert('one day this will call a number!')}>
                            <ListItemIcon>
                                <CallIcon/>
                            </ListItemIcon>
                            <ListItemText dir='ltr' primary={formatPhoneNumber(props.profile.phone_number)}/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </DialogContent>
        </Dialog>
}