import {Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import * as React from "react";
import Box from "@mui/material/Box";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HailIcon from '@mui/icons-material/Hail';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import LogoutIcon from '@mui/icons-material/Logout';
import SideMenuItems from "./SideMenuItems";
import {contextTypes} from "../DialogContexts";

const SideMenu = ({open, setOpen, navigate, handleOpenDialog, handleLogout, name}) => {

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    const DrawerList = (
        <Box sx={{width: 250}} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {SideMenuItems.map(item => (
                    <React.Fragment key={item.key}>
                        <ListItem>
                            <ListItemButton disabled={item.disabled} onClick={() => {
                                switch (item.link) {
                                    case contextTypes.publishRide:
                                    case contextTypes.publishRideSearch:
                                    case contextTypes.findRide:
                                    case contextTypes.findRiders:
                                        handleOpenDialog(item.link)
                                        break
                                    default:
                                        navigate(item.link)
                                        break
                                }
                            }}>
                                <ListItemIcon>
                                    {item.key === contextTypes.publishRide ? <DirectionsCarFilledIcon/> :
                                        item.key === contextTypes.findRiders ? <PersonSearchIcon/> :
                                            item.key === contextTypes.findRiders ? <PersonSearchIcon/> :
                                                item.key === contextTypes.findRide ? <TravelExploreIcon/> :
                                                    item.key === contextTypes.publishRideSearch ? <HailIcon/> :
                                                        item.key === 'myRides' ? <DepartureBoardIcon/> :
                                                            item.key === 'myRequests' ? <LocalTaxiIcon/> :
                                                                item.key === 'profile' ? <AccountCircleIcon/> :
                                                                    (<></>)}
                                </ListItemIcon>
                                <ListItemText primary={(item.primary) + (item.key === 'profile' ? ' ' + name : '')}
                                              secondary={item.secondary}/>
                            </ListItemButton>
                        </ListItem>
                        {item.divider_after && <Divider/>}
                    </React.Fragment>
                ))}
                <React.Fragment key='logout'>
                    <ListItem>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon/>
                            </ListItemIcon>
                            <ListItemText primary='התנתק'/>
                        </ListItemButton>
                    </ListItem>
                </React.Fragment>
            </List>
        </Box>
    );

    return (<Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
    </Drawer>)

}


export default SideMenu