import {Divider, Drawer, Fab, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
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
import {contextTypes} from "../../common/DialogContexts";
import {AvatarInitials} from "../../common/Functions";
import verifiedBadge from '../../static/BGU_logo.png'
import MenuIcon from "@mui/icons-material/Menu";
import {useState} from "react";
import FormDialog from "../PostRideDialogs/PostFutureRideDialog";
import VerifyProfileDialog from "../verifyProfileDialog";

const SideMenu = ({navigate, handleLogout, profile}) => {
    const [open, setOpen] = useState(false);

    const [openPostRideDialog, setOpenPostRideDialog] = useState(false);
    const [openRideRequestDialog, setOpenRideRequestDialog] = useState(false);
    const [openFindRideDialog, setOpenFindRideDialog] = useState(false);
    const [openVerifyProfileDialog, setOpenVerifyProfileDialog] = useState(false)

    const toggleSideMenu = (newOpen) => () => {
        setOpen(newOpen);
    };

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

    const handleOpenDialog = (dialogKey) => {
        switch (dialogKey) {
            case contextTypes.publishRide:
                setOpenPostRideDialog(true)
                break
            case contextTypes.publishRideSearch:
                setOpenRideRequestDialog(true)
                break
            case contextTypes.findRide:
                setOpenFindRideDialog(true)
                break
            default:
                break
        }
    };

    const handleCloseDialog = (dialogKey) => {
        switch (dialogKey) {
            case contextTypes.publishRide:
                setOpenPostRideDialog(false);
                break
            case contextTypes.publishRideSearch:
                setOpenRideRequestDialog(false)
                break
            case contextTypes.findRide:
                setOpenFindRideDialog(false)
                break
            default:
                break
        }
    };

    return (
        <React.Fragment>
            <Fab variant="extended" color='primary'
                 onClick={toggleSideMenu(true)}
                 style={{position: 'absolute', top: 25, right: 25, zIndex: 10}}>
                <MenuIcon sx={{mr: 1}}/>
                תפריט
            </Fab>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
            <FormDialog dialogContext={contextTypes.publishRide} openDialog={openPostRideDialog}
                        handleCloseDialog={handleCloseDialog}/>
            <FormDialog dialogContext={contextTypes.findRide} openDialog={openFindRideDialog}
                        handleCloseDialog={handleCloseDialog}/>
            {profile && <VerifyProfileDialog profile={profile} open={openVerifyProfileDialog}
                                             handleCloseDialog={() => setOpenVerifyProfileDialog(false)}/>}
        </React.Fragment>)

}


export default SideMenu