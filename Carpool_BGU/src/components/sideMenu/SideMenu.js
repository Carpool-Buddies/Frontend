import {Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import * as React from "react";
import Box from "@mui/material/Box";
import HailIcon from '@mui/icons-material/Hail';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import LogoutIcon from '@mui/icons-material/Logout';
import SideMenuItems from "./SideMenuItems";
import {contextTypes} from "../DialogContexts";
import {AvatarInitials} from "../../common/Functions";
import verifiedBadge from '../../static/BGU_logo.png'

const SideMenu = ({open, setOpen, navigate, handleOpenDialog, handleLogout, profile, setOpenVerifyProfileDialog}) => {

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    const DrawerList = profile && (
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
                                                                item.key === 'profile' ?
                                                                    <AvatarInitials userId={profile.id}/> :
                                                                    (<></>)}
                                </ListItemIcon>
                                <ListItemText primary={(item.primary) + (item.key === 'profile' ? ' ' + profile.first_name : '')}
                                              secondary={item.secondary}/>
                            </ListItemButton>
                        </ListItem>
                        {item.key === 'profile' && !profile.approved &&
                            <ListItem>
                                <ListItemButton onClick={() => setOpenVerifyProfileDialog(true)}>
                                    <ListItemIcon>
                                        <img src={verifiedBadge} alt="verified logo"
                                             style={{width: 20, marginLeft: 15, marginRight: 10}}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={'אמת את חשבונך'}/>
                                </ListItemButton>
                            </ListItem>}
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