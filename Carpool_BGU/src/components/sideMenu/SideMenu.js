import {Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import * as React from "react";
import Box from "@mui/material/Box";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import SideMenuItems from "./SideMenuItems";

const SideMenu = ({open, setOpen, navigate}) => {

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    const DrawerList = (
        <Box sx={{width: 250}} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {SideMenuItems.map(item => (
                    <>
                        <ListItem key={item.key}>
                            <ListItemButton onClick={() => {
                                navigate(item.link)
                            }}>
                                <ListItemIcon>
                                    {item.icon === 'DirectionsCarFilledIcon' && <DirectionsCarFilledIcon/>}
                                    {item.icon === 'EmojiPeopleIcon' && <EmojiPeopleIcon/>}
                                    {item.icon === 'AccountCircleIcon' && <AccountCircleIcon/>}
                                </ListItemIcon>
                                <ListItemText primary={item.primary} secondary={item.secondary}/>
                            </ListItemButton>
                        </ListItem>
                        {item.divider_after && <Divider/>}
                    </>
                ))}
            </List>
        </Box>
    );

    return (<Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
    </Drawer>)

}


export default SideMenu