import {Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import * as React from "react";
import Box from "@mui/material/Box";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import SideMenuItems from "./SideMenuItems";

const SideMenu = ({open, setOpen, navigate, handleOpenDialog}) => {

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    const DrawerList = (
        <Box sx={{width: 250}} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {SideMenuItems.map(item => (
                    <React.Fragment key={item.key}>
                        <ListItem>
                            <ListItemButton onClick={() => {
                                switch (item.link) {
                                    case "publish-ride":
                                        handleOpenDialog(item.link)
                                        break
                                    case "publish-request":
                                        handleOpenDialog(item.link)
                                        break
                                    default:
                                        navigate(item.link)
                                        break
                                }
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
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );

    return (<Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
    </Drawer>)

}


export default SideMenu