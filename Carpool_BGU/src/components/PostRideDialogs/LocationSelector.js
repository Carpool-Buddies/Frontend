import React, {useEffect, useState} from 'react';
import {AdvancedMarker, APIProvider, Map} from '@vis.gl/react-google-maps';
import Box from "@mui/material/Box";
import RoomIcon from '@mui/icons-material/Room';
import {CircularProgress, IconButton, InputAdornment, Slider} from "@mui/material";
import TextField from "@mui/material/TextField";
import {getCoordsFromAddress} from "../../common/fetchers";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import SearchIcon from '@mui/icons-material/Search';
import Typography from "@mui/material/Typography";
import {Circle} from "../../common/circle";

function CustomTabPanel(props) {
    const {children, value, index, ...other} = props;

    return (<Box justifyContent="center" textAlign='center'
                 role="tabpanel"
                 hidden={value !== index}
                 id={`simple-tabpanel-${index}`}
                 aria-labelledby={`simple-tab-${index}`}
                 {...other}
    >
        {value === index && (<Box sx={{p: 3}}>
            {children}
        </Box>)}
    </Box>);
}

CustomTabPanel.propTypes = {
    children: PropTypes.node, index: PropTypes.number.isRequired, value: PropTypes.number.isRequired,
};

const LocationSelector = ({title, setLocationDetails, actionText}) => {
    const [searchText, setSearchText] = useState('')
    const [coords, setCoords] = useState({lat: 0, long: 0})
    const [radius, setRadius] = useState(1);


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({lat: position.coords.latitude, long: position.coords.longitude});
            });
    }, []);

    const findAddress = async () => {
        const ret = await getCoordsFromAddress(searchText)
        if (ret.results && ret.results.length > 0) {
            setCoords({lat: ret.results[0].geometry.location.lat, long: ret.results[0].geometry.location.lng})
            setLocationDetails({
                coords: {
                    lat: ret.results[0].geometry.location.lat,
                    long: ret.results[0].geometry.location.lng
                }, radius: radius
            })
        } else
            alert('מצטערים, לא נמצאו תוצאות')
    }

    return (<Box display='flex' justifyContent="center">
        <Grid
            container
            display='flex'
            justifyContent="center">
            <Grid item xs={12}>
                <Typography>
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} justifyContent='center'>
                <TextField fullWidth
                           onKeyUp={e => {
                               if (e.key === "Enter")
                                   findAddress()
                           }}
                           InputProps={{
                               endAdornment: (<InputAdornment position="end">
                                   <IconButton onClick={findAddress}><SearchIcon/></IconButton>
                               </InputAdornment>),
                           }}
                           label="הקלד כתובת"
                           onChange={(e) => setSearchText(e.target.value)}/>
            </Grid>
            {coords.lat !== 0 ? <Grid item xs={12}>
                <APIProvider apiKey='AIzaSyCFaNEpBsTboNXUeUheimTz8AbP5BLPZ2g'>
                    <Map
                        mapId={'a6c72e4f93862a68'}
                        style={{width: '100%', height: 300}}
                        center={{lat: coords.lat, lng: coords.long}}
                        defaultZoom={14}
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                    >
                        <AdvancedMarker position={{lat: coords.lat, lng: coords.long}}>
                            <RoomIcon color='primary'/>
                        </AdvancedMarker>
                        <Circle
                            radius={radius * 1000}
                            center={{lng: coords.long, lat: coords.lat}}
                            strokeOpacity={0}
                            fillColor={'#088'}
                            fillOpacity={0.4}
                        />
                    </Map>
                </APIProvider>
                <Typography>
                    רדיוס {actionText} (ק"מ)
                </Typography>
                <Slider
                    size="small"
                    value={radius}
                    min={0.5}
                    max={5}
                    step={0.1}
                    valueLabelDisplay="auto"
                    onChange={(event, newValue) => {
                        setRadius(newValue);
                    }}
                />
            </Grid> : <Grid alignItems="center" justifyContent="center" display='flex'
                            style={{width: '100%', height: 300}}><CircularProgress/></Grid>}
        </Grid>
    </Box>);
};

export default LocationSelector;
