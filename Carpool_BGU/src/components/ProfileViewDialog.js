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
import {formatPhoneNumber} from "../common/Functions";

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