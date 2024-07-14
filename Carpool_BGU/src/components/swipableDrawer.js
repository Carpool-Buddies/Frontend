import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import {Badge, Fab} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function SwipeableTemporaryDrawer(props) {
    const [notificationsDrawerOpen, setNotificationsDrawerOpen] = React.useState(false);

    const toggleDrawer = (open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setNotificationsDrawerOpen(open);
    };

    return (
        <React.Fragment>
            <Fab size="medium" color='primary'
                 onClick={() => setNotificationsDrawerOpen(true)}
                 style={{position: 'absolute', top: 25, left: 25, zIndex: 10}}>
                <Badge badgeContent={100} color="error">
                    <NotificationsIcon/>
                </Badge>
            </Fab>
            <SwipeableDrawer
                anchor={'bottom'}
                open={notificationsDrawerOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
            >
                <Box
                    sx={{width: 'auto', height: '80vh'}}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}
                                    </ListItemIcon>
                                    <ListItemText primary={text}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider/>
                </Box>
            </SwipeableDrawer>
        </React.Fragment>
    );
}